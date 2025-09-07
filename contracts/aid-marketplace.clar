(define-constant ERR-NOT-FOUND (err u100))
(define-constant ERR-UNAUTHORIZED (err u101))
(define-constant ERR-INVALID (err u102))
(define-constant ERR-NOT-OPEN (err u103))
(define-constant ERR-ALREADY-MATCHED (err u104))
(define-constant ERR-INVALID-QUANTITY (err u105))
(define-constant ERR-EXPIRED (err u106))
(define-constant ERR-NOT-MATCHED (err u107))
(define-constant ERR-NOT-CLOSED (err u108))

(define-data-var listing-counter uint u0)

(define-map listings
  { id: uint }
  {
    ngo: principal,
    item: (string-utf8 50),
    quantity: uint,
    location: (string-utf8 100),
    expiry: uint,
    status: (string-utf8 20),
    mode: (string-utf8 20),
    price: uint,
    taker: (optional principal)
  }
)

(define-public (list-aid (item (string-utf8 50)) (qty uint) (location (string-utf8 100)) (expiry uint) (mode (string-utf8 20)) (price uint))
  (begin
    (asserts! (> qty u0) ERR-INVALID-QUANTITY)
    (var-set listing-counter (+ (var-get listing-counter) u1))
    (map-set listings { id: (var-get listing-counter) }
      {
        ngo: tx-sender,
        item: item,
        quantity: qty,
        location: location,
        expiry: expiry,
        status: "open",
        mode: mode,
        price: price,
        taker: none
      })
    (ok (var-get listing-counter))
  )
)

(define-public (request-aid (id uint))
  (match (map-get? listings { id: id })
    listing
    (begin
      (asserts! (is-eq (get status listing) "open") ERR-NOT-OPEN)
      (asserts! (> (get expiry listing) block-height) ERR-EXPIRED)
      (map-set listings { id: id } (merge listing { status: "matched", taker: (some tx-sender) }))
      (ok true)
    )
    ERR-NOT-FOUND
  )
)

(define-public (confirm-delivery (id uint))
  (match (map-get? listings { id: id })
    listing
    (begin
      (asserts! (is-some (get taker listing)) ERR-NOT-MATCHED)
      (asserts! (is-eq (unwrap-panic (get taker listing)) tx-sender) ERR-UNAUTHORIZED)
      (map-set listings { id: id } (merge listing { status: "closed" }))
      (ok true)
    )
    ERR-NOT-FOUND
  )
)

(define-public (cancel-listing (id uint))
  (match (map-get? listings { id: id })
    listing
    (begin
      (asserts! (is-eq (get ngo listing) tx-sender) ERR-UNAUTHORIZED)
      (asserts! (is-eq (get status listing) "open") ERR-NOT-OPEN)
      (map-set listings { id: id } (merge listing { status: "closed" }))
      (ok true)
    )
    ERR-NOT-FOUND
  )
)

(define-read-only (get-listing (id uint))
  (map-get? listings { id: id })
)

(define-read-only (get-status (id uint))
  (match (map-get? listings { id: id })
    listing (ok (get status listing))
    ERR-NOT-FOUND
  )
)

(define-read-only (get-taker (id uint))
  (match (map-get? listings { id: id })
    listing (ok (get taker listing))
    ERR-NOT-FOUND
  )
)

(define-read-only (get-all-listings (start uint) (limit uint))
  (let ((end (+ start limit)))
    (ok (map
      (lambda (id)
        (unwrap-panic (map-get? listings { id: id })))
      (range start end)
    ))
  )
)
