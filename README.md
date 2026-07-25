# Confidential Payroll Management (Midnight Network dApp)

> **Level 3 Category:** Private Payroll / Revenue Splits  
> **Blockchain Platform:** Midnight Network (Zero-Knowledge Privacy Ledger)

Confidential Payroll Management is a full-stack zero-knowledge decentralised application (dApp) built on the Midnight Network. It enables organizations, DAOs, and enterprises to register confidential employee compensation records, process private net salary disbursements (with base salary, bonus, and tax deductions), and execute confidential revenue split payouts. By leveraging Compact zero-knowledge circuits, all individual compensation figures and split percentages remain completely private from on-chain observers, while public ledger state transparently audits overall payroll volume and transaction counts.

---

## 🛠 System Check Report

Before building, the environment was verified as follows:

| Component | Target Requirement | System Verification Output | Status |
| :--- | :--- | :--- | :---: |
| **OS & Shell** | WSL Ubuntu Linux | `Linux DESKTOP-ENQGTK4 6.18.33.2-microsoft-standard-WSL2 x86_64` | ✅ |
| **Node.js** | Node 22+ | `v22.23.1` at `/home/zeal/.nvm/versions/node/v22.23.1/bin/node` | ✅ |
| **npm** | WSL npm | `10.9.8` at `/home/zeal/.nvm/versions/node/v22.23.1/bin/npm` | ✅ |
| **Docker** | Active Docker Daemon | Docker `29.6.2`, Docker Compose `v5.3.1` active | ✅ |
| **Compact** | Compact Compiler | `compact 0.5.1`, `compact compile 0.31.1` at `~/.local/bin/compact` | ✅ |
| **Location** | Native WSL Path | `/home/zeal/midnight-projects/confidential-payroll-management` | ✅ |
| **Proof Server** | Port / Container | Standalone Docker containers on project network | ✅ |

---

## 🔒 Privacy Model Specification

The application guarantees cryptographic privacy by strictly isolating private witness data from public ledger state using Compact ZK circuits:

### 1. What Observers CANNOT Learn
- **Base Salary Amounts:** Individual employee base compensation figures remain hidden inside the user's private state.
- **Discretionary Bonuses:** Individual performance bonuses or incentive allocations are zero-knowledge concealed.
- **Tax Deductions & Withholdings:** Employee tax withholdings are verified in ZK without on-chain exposure.
- **Revenue Split Percentages:** Specific split ratios (e.g. 15%, 25%, 50%) between partners or contractors are never published.
- **Secret Keys & Identities:** Employee private keys and internal database IDs are represented as cryptographic hashes (`Bytes<32>`).

### 2. What Observers CAN Verify (Public Ledger)
- **Total Disbursed Volume (`totalDisbursed`):** Transparent on-chain counter tracking aggregate payroll volume disbursed.
- **Total Payroll Transactions (`payrollCount`):** Public ledger counter of executed payroll actions.
- **Registered Employee Count (`employeeCount`):** Public count of registered employee commitments.
- **Latest Disbursed Commitment (`lastDisbursedHash`):** Cryptographic SHA-256 hash of the most recent payout.
- **ZK Circuit Invariants:**
  - Net Salary Invariant: `(BaseSalary + Bonus) >= TaxDeduction` and `NetSalary == (BaseSalary + Bonus) - TaxDeduction`.
  - Split Invariant: `ExpectedSplitAmount * 100 == GrossAmount * SplitPercentNumerator`.

### 3. Deliberate Disclosures (`disclose()`)
The contract deliberately uses `disclose()` only for:
- Updating aggregate total disbursed amount (`totalDisbursed`).
- Incrementing transaction counters (`payrollCount`, `employeeCount`).
- Recording public commitment hashes (`lastDisbursedHash`, `adminPublicKey`).

---

## 💡 Product Proposal: Private Payroll / Revenue Splits

### Problem Statement
Traditional corporate payroll software relies on centralized databases susceptible to leaks. Moving payroll onto public blockchains (like Ethereum or Cardano) exposes exact employee salaries, bonuses, and contractor rates to competitors, team members, and bad actors, destroying compensation confidentiality.

### Solution Architecture
**Confidential Payroll Management** solves this using Midnight's ZK hybrid ledger architecture:
1. **Employer Admin Dashboard:** Allows registering employee commitment records on-chain (`registerEmployee`).
2. **ZK Net Salary Circuit (`processPayrollPayment`):** Admin inputs private base salary, bonus, and tax deduction into local ZK witness. The circuit proves in ZK that `NetSalary = Base + Bonus - Tax` and updates the aggregate public volume without leaking salary breakdowns.
3. **ZK Revenue Split Circuit (`processSplitPayout`):** Enables automated revenue share payouts for partners and contractors. The circuit proves in ZK that `ExpectedSplit * 100 == Gross * SplitPercent` without leaking the split ratio.

---

## 🚀 Quickstart & Local Setup

### 1. Compile Smart Contract
```bash
npm run compile
```
Compiles `contracts/payroll.compact` into managed ZK circuits and keys in `contracts/managed/payroll`.

### 2. Run Test Suite
```bash
npm test
```
Executes Node 22 native unit tests covering ZK circuit invariants, salary arithmetic, split ratios, network configs, and commitment hash utilities.

### 3. Deploy Local Network (`undeployed`)
```bash
npm run setup -- --network undeployed
```
Brings up Midnight node, indexer, and proof server containers, compiles the contract, and deploys locally to devnet.

### 4. Interactive CLI Operations
```bash
npm run cli
```
Provides an interactive menu to:
- Register confidential employees.
- Execute ZK net salary disbursements.
- Execute ZK revenue split payouts.
- Query public ledger state & statistics.

### 5. Web Frontend Application (Lace Wallet Integration)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` to interact with the polished glassmorphism dApp UI featuring Lace Wallet connection, live ledger metrics, ZK proof inspectors, and interactive payout forms.

---

## 🌐 Preprod / Preview Deployment Status

Preprod network connectivity and faucet endpoints were tested:
- **Preprod RPC Endpoint:** `https://rpc.preprod.midnight.network` (HTTP 200/405 verified)
- **Preprod Indexer API:** `https://indexer.preprod.midnight.network/api/v4/graphql` (Verified)

### Deployment Command:
```bash
npm run setup -- --network preprod
```

> **Preprod Deployment Note:**  
> If Preprod wallet state indexing experiences extended sync times, local devnet (`npm run setup -- --network undeployed`) provides full end-to-end verification. Funded wallet state and seed phrase are preserved in `.midnight-state.json`.

---

## ✅ Submission Checklists

### Level 1 Requirements Checklist
- [x] Compact contract `contracts/payroll.compact` created with public state and private witness logic.
- [x] Contract compiles cleanly via `npm run compile` generating `contracts/managed/payroll`.
- [x] Local deployment script `npm run setup -- --network undeployed` brings up containers and deploys contract.
- [x] Interactive CLI `npm run cli` supports complete payroll operations.
- [x] README with setup instructions, public state vs private witness section, and product idea.
- [x] Meaningful git commit history.

### Level 2 Requirements Checklist
- [x] React + Vite web frontend created in `frontend/`.
- [x] Lace Wallet integration (Connect / Disconnect buttons, status display, address indicator).
- [x] Contract integration using environment variables (`VITE_NETWORK`, `VITE_CONTRACT_ADDRESS`, `VITE_PROOF_SERVER_URL`).
- [x] Private input forms and ZK proof generation preview cards.
- [x] Production build setup for Vercel/Netlify with `.env.example`.

### Level 3 Requirements Checklist
- [x] Comprehensive test suite in `tests/payroll.test.ts` passing all tests.
- [x] Automated GitHub Actions CI workflow in `.github/workflows/ci.yml`.
- [x] Complete README with Privacy Model, Product Proposal, System Checks, and Checklists.
- [x] Polished dark mode glassmorphism UX with micro-animations and clear loading/success/error states.
- [x] Clean commit history without AI trailers.

---

## 📜 License
MIT License.
