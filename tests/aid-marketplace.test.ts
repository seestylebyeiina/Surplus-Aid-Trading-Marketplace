import { describe, it, expect, beforeEach } from "vitest";

const ERR_NOT_FOUND = 100;
const ERR_UNAUTHORIZED = 101;
const ERR_INVALID = 102;
const ERR_NOT_OPEN = 103;
const ERR_ALREADY_MATCHED = 104;
const ERR_INVALID_QUANTITY = 105;
const ERR_EXPIRED = 106;
const ERR_NOT_MATCHED = 107;
const ERR_NOT_CLOSED = 108;

class AidMarketplaceMock {
  listings: Map<number, any>;
  counter: number;
  blockHeight: number;

  constructor() {
    this.listings = new Map();
    this.counter = 0;
    this.blockHeight = 0;
  }

  advanceBlocks(n: number) {
    this.blockHeight += n;
  }

  listAid(ngo: string, item: string, qty: number, location: string, expiry: number, mode: string, price: number) {
    if (qty <= 0) return { ok: false, value: ERR_INVALID_QUANTITY };
    this.counter++;
    this.listings.set(this.counter, {
      ngo,
      item,
      quantity: qty,
      location,
      expiry,
      status: "open",
      mode,
      price,
      taker: null
    });
    return { ok: true, value: this.counter };
  }

  requestAid(id: number, taker: string) {
    const listing = this.listings.get(id);
    if (!listing) return { ok: false, value: ERR_NOT_FOUND };
    if (listing.status !== "open") return { ok: false, value: ERR_NOT_OPEN };
    if (listing.expiry <= this.blockHeight) return { ok: false, value: ERR_EXPIRED };
    listing.status = "matched";
    listing.taker = taker;
    this.listings.set(id, listing);
    return { ok: true, value: true };
  }

  confirmDelivery(id: number, caller: string) {
    const listing = this.listings.get(id);
    if (!listing) return { ok: false, value: ERR_NOT_FOUND };
    if (!listing.taker) return { ok: false, value: ERR_NOT_MATCHED };
    if (listing.taker !== caller) return { ok: false, value: ERR_UNAUTHORIZED };
    listing.status = "closed";
    this.listings.set(id, listing);
    return { ok: true, value: true };
  }

  cancelListing(id: number, caller: string) {
    const listing = this.listings.get(id);
    if (!listing) return { ok: false, value: ERR_NOT_FOUND };
    if (listing.ngo !== caller) return { ok: false, value: ERR_UNAUTHORIZED };
    if (listing.status !== "open") return { ok: false, value: ERR_NOT_OPEN };
    listing.status = "closed";
    this.listings.set(id, listing);
    return { ok: true, value: true };
  }

  getListing(id: number) {
    return this.listings.get(id) || null;
  }
}

describe("AidMarketplace", () => {
  let contract: AidMarketplaceMock;
  const ngo = "ST1NGO";
  const taker = "ST1TAKER";

  beforeEach(() => {
    contract = new AidMarketplaceMock();
  });

  it("should create valid listing", () => {
    const result = contract.listAid(ngo, "Rice", 100, "LocationA", 10, "donation", 0);
    expect(result).toEqual({ ok: true, value: 1 });
    expect(contract.getListing(1).item).toBe("Rice");
  });

  it("should reject invalid quantity", () => {
    const result = contract.listAid(ngo, "Rice", 0, "Loc", 10, "donation", 0);
    expect(result).toEqual({ ok: false, value: ERR_INVALID_QUANTITY });
  });

  it("should allow request before expiry", () => {
    contract.listAid(ngo, "Rice", 50, "Loc", 5, "donation", 0);
    const result = contract.requestAid(1, taker);
    expect(result).toEqual({ ok: true, value: true });
    expect(contract.getListing(1).status).toBe("matched");
  });

  it("should reject request after expiry", () => {
    contract.listAid(ngo, "Rice", 50, "Loc", 5, "donation", 0);
    contract.advanceBlocks(6);
    const result = contract.requestAid(1, taker);
    expect(result).toEqual({ ok: false, value: ERR_EXPIRED });
  });

  it("should confirm delivery by taker", () => {
    contract.listAid(ngo, "Rice", 50, "Loc", 5, "donation", 0);
    contract.requestAid(1, taker);
    const result = contract.confirmDelivery(1, taker);
    expect(result).toEqual({ ok: true, value: true });
    expect(contract.getListing(1).status).toBe("closed");
  });

  it("should reject delivery confirmation by non-taker", () => {
    contract.listAid(ngo, "Rice", 50, "Loc", 5, "donation", 0);
    contract.requestAid(1, taker);
    const result = contract.confirmDelivery(1, "ST1OTHER");
    expect(result).toEqual({ ok: false, value: ERR_UNAUTHORIZED });
  });

  it("should allow cancellation by NGO if open", () => {
    contract.listAid(ngo, "Rice", 50, "Loc", 5, "donation", 0);
    const result = contract.cancelListing(1, ngo);
    expect(result).toEqual({ ok: true, value: true });
    expect(contract.getListing(1).status).toBe("closed");
  });

  it("should reject cancellation by non-NGO", () => {
    contract.listAid(ngo, "Rice", 50, "Loc", 5, "donation", 0);
    const result = contract.cancelListing(1, "ST1OTHER");
    expect(result).toEqual({ ok: false, value: ERR_UNAUTHORIZED });
  });
});