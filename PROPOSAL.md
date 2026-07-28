# Product Proposal: Confidential Payroll Management

> **Midnight Hackathon Submission**  
> **Track / Category:** Level 3 — Private Payroll / Revenue Splits  
> **Blockchain Platform:** Midnight Network (Zero-Knowledge Privacy Ledger)

---

## Executive Summary

**Confidential Payroll Management** is an enterprise-grade zero-knowledge decentralised application (dApp) built natively on the Midnight Network. It enables DAOs, multinational corporations, and web3 organizations to manage employee compensation, process net salary disbursements, and execute performance revenue splits with complete cryptographic confidentiality.

By leveraging Compact ZK circuits, individual salary breakdowns (base salary, performance bonuses, tax withholdings) and revenue share percentages remain completely hidden from on-chain observers, while public ledger state transparently audits overall payroll volume, transaction counts, and commitment hashes.

---

## Problem Statement

Traditional Web2 payroll solutions rely on centralized human resource databases vulnerable to internal data leaks, hacks, and unauthorized surveillance. Conversely, deploying payroll on transparent Web3 blockchains (e.g. Ethereum or Cardano) exposes exact employee salaries, executive compensation, contractor rates, and tax deductions to competitors, team members, and malicious actors—violating privacy regulations (GDPR, CCPA) and destroying organizational confidentiality.

Organizations face a dilemma:
- **Centralized Systems:** Single point of failure, data corruption risk, lack of cryptographic verifiability.
- **Public Blockchains:** Complete loss of compensation privacy, employee poaching risks, public rate exposure.

---

## The Solution: Midnight Hybrid ZK Ledger

**Confidential Payroll Management** resolves this conflict by leveraging Midnight's dual-state architecture (Public Ledger + Private Local State + Compact ZK Circuits):

1. **Private Local Witness:** Compensation parameters (base salary, bonus, tax deduction, employee secret key, payroll nonce) remain stored strictly in local client state.
2. **Compact ZK Circuit Execution:** The client's proof server constructs a zero-knowledge proof verifying arithmetic invariants (`NetSalary = Base + Bonus - Tax` and `ExpectedSplit * 100 == Gross * SplitPercent`) without exposing any input inputs to the network.
3. **Public Ledger Verification:** The Midnight blockchain verifies the ZK proof and updates public aggregate metrics (`totalDisbursed`, `payrollCount`, `employeeCount`, `lastDisbursedHash`) using explicit `disclose()` directives.

---

## Why Midnight?

Midnight is uniquely suited for enterprise confidential payroll due to its native support for:
- **Selective Disclosure (`disclose()`):** Explicit, fine-grained control over which state variables are published on-chain vs. kept private.
- **Compact ZK Domain Specific Language:** Purpose-built smart contract language designed for zero-knowledge arithmetic and state transitions.
- **Midnight Lace Wallet Integration:** Seamless dApp interface enabling users to sign ZK transactions using shielded and unshielded keys.
- **Dual Indexing & Proof Server Architecture:** High-throughput client-side ZK proof generation combined with public graph indexing.

---

## Zero-Knowledge Circuit & Privacy Design

### 1. Private Witness Inputs
The application utilizes 5 distinct witness functions that remain hidden inside private local execution:
- `witness employeeSecret(): Bytes<32>`: Cryptographic key establishing employee identity.
- `witness salarySecret(): Bytes<32>`: Private seed concealing base compensation.
- `witness payrollNonce(): Bytes<32>`: Unique transaction nonce preventing replay attacks.
- `witness departmentSecret(): Bytes<32>`: Organizational unit hash.
- `witness verificationSecret(): Bytes<32>`: Verification token for credential issuance.

### 2. Public Ledger State (On-Chain Transparency)
Only aggregate statistics and public verification keys are disclosed on-chain:
- `adminPublicKey: Bytes<32>`: Administrator verification key.
- `totalDisbursed: Uint<64>`: Aggregate sum of all payouts disbursed.
- `payrollCount: Uint<64>`: Total count of processed payroll transactions.
- `employeeCount: Uint<64>`: Total count of registered employee commitments.
- `lastDisbursedHash: Bytes<32>`: Cryptographic SHA-256 hash of the latest payout.

### 3. Proven Invariants
The Compact circuits mathematically prove:
- **Net Salary Invariant:** `(baseSalary + bonus) >= taxDeduction` AND `calculatedNet == (baseSalary + bonus - taxDeduction)`.
- **Revenue Split Invariant:** `splitPercentNumerator <= 100` AND `(expectedSplit * 100) == (grossAmount * splitPercentNumerator)`.

---

## Business Impact & Use Cases

- **Web3 Enterprise Payroll:** Pay core contributors in native tokens without exposing individual salary tiers.
- **DAO Revenue Sharing:** Automatically distribute partner and contractor revenue shares confidentially.
- **Regulatory Compliance:** Maintain employee privacy under international labor and privacy laws while providing zero-knowledge audit proofs to tax authorities.
- **Executive Compensation:** Secure executive bonus structures from public observation.

---

## Future Roadmap

1. **Phase 1 (Current):** Compact 0.23 contract, witness inputs, local devnet deployment, Lace Wallet integration, React SPA frontend.
2. **Phase 2:** Multi-currency payment support (tNIGHT + stablecoins), recurring automated ZK subscriptions.
3. **Phase 3:** Preprod deployment integration with Midnight Lace testnet, decentralized ZK credential verification for employee income proofs.

---

## Hackathon Compliance & Category Justification

### Category: Level 3 — Private Payroll / Revenue Splits
- **Level 1 Compliance:** Compact contract (`contracts/payroll.compact`) with public state and private witness logic, clean compilation (`npm run compile`), CLI menu (`npm run cli`), local devnet deployment setup (`npm run setup`).
- **Level 2 Compliance:** React + Vite dApp frontend, real Midnight Lace Wallet integration, contract integration using environment variables (`VITE_NETWORK`, `VITE_CONTRACT_ADDRESS`, `VITE_PROOF_SERVER_URL`), Netlify SPA deployment configuration.
- **Level 3 Compliance:** 7 comprehensive native unit tests in `tests/payroll.test.ts`, automated GitHub Actions CI pipeline in `.github/workflows/ci.yml`, privacy specification, zero-knowledge witness inputs, and complete documentation.
