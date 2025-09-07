# 🌍 Surplus Aid Trading Marketplace

Welcome to the **Blockchain Marketplace for Surplus Aid**, a decentralized platform that connects NGOs, charities, and aid providers to redistribute **unused or surplus resources** efficiently on the Stacks blockchain.

No more wasted food, medicine, or supplies — everything gets transparently listed, traded, or donated to where it's needed most.  

## ✨ Features

🤝 **List Surplus Aid** – NGOs can register extra resources (food, medicine, equipment)  
📦 **Request Aid** – Organizations in need can request or claim listed resources  
💱 **Trade or Donate** – Decide whether to exchange for tokens or donate freely  
📜 **Smart Escrow** – Escrow contract ensures fair delivery before payment is released  
🏆 **Reputation System** – Build trust with verifiable on-chain NGO profiles  
📊 **Transparency Dashboard** – Publicly visible activity to increase accountability  

## 🛠 Smart Contract Modules

This project consists of **7 Clarity smart contracts**, each handling a separate part of the system:

1. **NGO Registry**  
   - Register and verify NGOs  
   - Store metadata (mission, country, verification status)  

2. **Aid Listing**  
   - Create surplus aid listings with details (category, quantity, expiry, location)  
   - Prevent duplicate or fraudulent listings  

3. **Aid Request & Matching**  
   - NGOs can request aid based on needs  
   - Automatic or manual matching between supply and demand  

4. **Escrow & Settlement**  
   - Escrow contract holds tokens until aid delivery is confirmed  
   - Supports both **donations (zero-cost)** and **token-based trades**  

5. **Reputation & Feedback**  
   - Record transaction history and ratings for NGOs  
   - Reputation affects visibility and matching priority  

6. **Governance Contract**  
   - Community-driven governance for rules and upgrades  
   - Voting by verified NGOs for dispute resolution or system changes  

7. **Token Contract (optional)**  
   - Native utility token for aid trading  
   - Incentives for active participation and transparent exchanges  

## ⚙️ How It Works

**For Donor NGOs (with surplus aid):**
1. Register your organization in the **NGO Registry**  
2. List your extra resources via the **Aid Listing contract**  
3. Decide whether to donate for free or trade via tokens  

**For Recipient NGOs (in need of aid):**
1. Register in the **NGO Registry**  
2. Browse available listings  
3. Request aid through the **Aid Request contract**  
4. Tokens are held in **Escrow** until delivery is confirmed  

**For Everyone:**
- Check the **Transparency Dashboard** (built on-chain data)  
- View reputations and histories to ensure fair trade  

## ✅ Example Flow

- NGO A has 1,000kg of rice nearing expiry → Lists it as surplus  
- NGO B needs rice for refugee camps → Requests it  
- Tokens go into **Escrow** until NGO B confirms delivery  
- Both parties leave ratings, updating **Reputation scores**  

Boom! Surplus aid gets to where it’s needed, with **trustless and transparent verification**.  

---

🚀 Built with Clarity on the Stacks blockchain
