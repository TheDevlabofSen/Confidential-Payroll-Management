/**
 * CLI for interacting with confidential-payroll-management contract on Midnight Network
 */
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { WebSocket } from 'ws';
import { Buffer } from 'buffer';
import { createHash } from 'node:crypto';

// Midnight SDK imports
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { resolveNetwork, getOrCreateSeed, getDeployment } from './network';
import { createWallet, persistWalletState, unshieldedToken, type WalletContext } from './wallet';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';

// Enable WebSocket for GraphQL subscriptions
// @ts-expect-error Required for wallet sync
globalThis.WebSocket = WebSocket;

const PRIVATE_STATE_ID = 'payrollPrivateState';

const { network, config: networkConfig } = resolveNetwork();
const SEED = getOrCreateSeed(network);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const zkConfigPath = path.resolve(__dirname, '..', 'contracts', 'managed', 'payroll');

const contractPath = path.join(zkConfigPath, 'contract', 'index.js');

if (!fs.existsSync(contractPath)) {
  console.error('\n❌ Contract not compiled! Run: npm run compile\n');
  process.exit(1);
}

const Payroll = await import(pathToFileURL(contractPath).href);

const compiledContract = CompiledContract.make('payroll', Payroll.Contract).pipe(
  CompiledContract.withVacantWitnesses,
  CompiledContract.withCompiledFileAssets(zkConfigPath),
);

// Helper bytes function
function hash32(input: string): Uint8Array {
  const hash = createHash('sha256').update(input).digest();
  return new Uint8Array(hash);
}

function formatBytesHex(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('hex');
}

// ─── Providers ─────────────────────────────────────────────────────────────────

async function createProviders(walletCtx: WalletContext) {
  const privateStatePassword = process.env.PRIVATE_STATE_PASSWORD?.trim() || 'Local-Devnet-Development-Placeholder-1';

  const walletProvider = {
    getCoinPublicKey: () => walletCtx.shieldedSecretKeys.coinPublicKey,
    getEncryptionPublicKey: () => walletCtx.shieldedSecretKeys.encryptionPublicKey,
    async balanceTx(tx: any, ttl?: Date) {
      const recipe = await walletCtx.wallet.balanceUnboundTransaction(
        tx,
        { shieldedSecretKeys: walletCtx.shieldedSecretKeys, dustSecretKey: walletCtx.dustSecretKey },
        { ttl: ttl ?? new Date(Date.now() + 30 * 60 * 1000) },
      );
      return walletCtx.wallet.finalizeRecipe(recipe);
    },
    submitTx: (tx: any) => walletCtx.wallet.submitTransaction(tx) as any,
  };

  const zkConfigProvider = new NodeZkConfigProvider(zkConfigPath);
  const accountId = walletCtx.unshieldedKeystore.getBech32Address().toString();

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'payroll-state',
      accountId,
      privateStoragePasswordProvider: () => privateStatePassword,
    }),
    publicDataProvider: indexerPublicDataProvider(networkConfig.indexer, networkConfig.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(networkConfig.proofServer, zkConfigProvider),
    walletProvider,
    midnightProvider: walletProvider,
  };
}

// ─── Main CLI ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║            Confidential Payroll Management CLI              ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  const rl = createInterface({ input: stdin, output: stdout });

  const deployment = getDeployment(network);
  if (!deployment) {
    console.error(`No deploy on file for network ${network}. Run \`npm run setup -- --network ${network}\` first.`);
    process.exit(1);
  }
  console.log(`  Contract Address: ${deployment.address}`);
  console.log(`  Target Network:   ${network}\n`);

  try {
    const seed = SEED;

    console.log('  Connecting to wallet...');
    const walletCtx = await createWallet({ network, networkConfig, seed });
    const restoredCount = Object.values(walletCtx.restored).filter(Boolean).length;
    if (restoredCount > 0) {
      console.log(`  Restored ${restoredCount}/3 child wallets from .midnight-wallet-state.`);
    }

    console.log('  Syncing with network...');
    const syncStart = Date.now();
    const syncInterval = setInterval(() => {
      const elapsed = Math.round((Date.now() - syncStart) / 1000);
      process.stdout.write(`\r  ⏳ Syncing... (${elapsed}s elapsed)   `);
    }, 5000);
    const state = await walletCtx.wallet.waitForSyncedState();
    clearInterval(syncInterval);
    process.stdout.write('\r  ✓ Synced with network.                                      \n');

    await persistWalletState(network, walletCtx);
    const balance = state.unshielded.balances[unshieldedToken().raw] ?? 0n;
    console.log(`  Wallet Balance: ${balance.toLocaleString()} tNight\n`);

    console.log('  Connecting to contract...');
    const providers = await createProviders(walletCtx);

    const deployed: any = await findDeployedContract(providers, {
      compiledContract: compiledContract as any,
      contractAddress: deployment.address,
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: {},
    });

    console.log('  ✅ Connected to Payroll Contract!\n');

    let running = true;
    while (running) {
      console.log('─── Payroll Operations Menu ────────────────────────────────────');
      console.log('  1. Register Confidential Employee Record');
      console.log('  2. Process Confidential Net Salary Payment (ZK Payroll)');
      console.log('  3. Process Confidential Revenue Split Payout (ZK Split)');
      console.log('  4. Read Public Ledger State & Statistics');
      console.log('  5. Check Wallet & DUST Balance');
      console.log('  6. Exit\n');

      const choice = await rl.question('  Select option [1-6]: ');

      switch (choice.trim()) {
        case '1': {
          const empId = await rl.question('  Enter Employee ID or Email: ');
          const empHash = hash32(empId);
          const initialCommitment = hash32(`commitment-${empId}-${Date.now()}`);

          console.log('\n  Submitting ZK Employee Registration...');
          try {
            const tx = await deployed.callTx.registerEmployee(empHash, initialCommitment);
            console.log(`\n  ✅ Employee Registered standard commitment!`);
            console.log(`  Employee Hash: ${formatBytesHex(empHash)}`);
            console.log(`  Tx ID: ${tx.public.txId}`);
            console.log(`  Block Height: ${tx.public.blockHeight}\n`);
          } catch (error) {
            console.error('\n  ❌ Registration Failed:', error instanceof Error ? error.message : error);
          }
          break;
        }

        case '2': {
          const empId = await rl.question('  Employee ID: ');
          const baseStr = await rl.question('  Private Base Salary (e.g. 5000): ');
          const bonusStr = await rl.question('  Private Bonus (e.g. 1000): ');
          const taxStr = await rl.question('  Private Tax Deduction (e.g. 800): ');

          const baseSalary = BigInt(baseStr);
          const bonus = BigInt(bonusStr);
          const taxDeduction = BigInt(taxStr);
          const expectedNetSalary = baseSalary + bonus - taxDeduction;

          if (expectedNetSalary < 0n) {
            console.error('\n  ❌ Error: Net salary cannot be negative!\n');
            break;
          }

          const empHash = hash32(empId);
          const payoutCommitment = hash32(`payout-${empId}-${expectedNetSalary}-${Date.now()}`);

          console.log(`\n  Privately calculated ZK Net Salary: ${expectedNetSalary.toString()}`);
          console.log('  Generating ZK Proof & Submitting Transaction...');

          try {
            const tx = await deployed.callTx.processPayrollPayment(
              empHash,
              baseSalary,
              bonus,
              taxDeduction,
              expectedNetSalary,
              payoutCommitment,
            );
            console.log(`\n  ✅ Confidential Payroll Payment Verified and Executed!`);
            console.log(`  Payout Hash: ${formatBytesHex(payoutCommitment)}`);
            console.log(`  Tx ID: ${tx.public.txId}`);
            console.log(`  Block Height: ${tx.public.blockHeight}\n`);
          } catch (error) {
            console.error('\n  ❌ ZK Payroll Payment Failed:', error instanceof Error ? error.message : error);
          }
          break;
        }

        case '3': {
          const empId = await rl.question('  Employee ID / Partner ID: ');
          const grossStr = await rl.question('  Gross Revenue Amount (e.g. 10000): ');
          const splitPercentStr = await rl.question('  Split Percentage Numerator (0-100, e.g. 25): ');

          const grossAmount = BigInt(grossStr);
          const splitPercentNumerator = BigInt(splitPercentStr);
          const expectedSplitAmount = (grossAmount * splitPercentNumerator) / 100n;

          const empHash = hash32(empId);

          console.log(`\n  Privately calculated ZK Split Amount: ${expectedSplitAmount.toString()}`);
          console.log('  Generating ZK Proof & Submitting Split Transaction...');

          try {
            const tx = await deployed.callTx.processSplitPayout(
              empHash,
              grossAmount,
              splitPercentNumerator,
              expectedSplitAmount,
            );
            console.log(`\n  ✅ Confidential Revenue Split Verified and Executed!`);
            console.log(`  Split Amount Added to Public Disbursed Total: ${expectedSplitAmount.toString()}`);
            console.log(`  Tx ID: ${tx.public.txId}`);
            console.log(`  Block Height: ${tx.public.blockHeight}\n`);
          } catch (error) {
            console.error('\n  ❌ ZK Split Payout Failed:', error instanceof Error ? error.message : error);
          }
          break;
        }

        case '4': {
          console.log('\n  Fetching Public Ledger State from Midnight Indexer...');
          try {
            const contractState = await providers.publicDataProvider.queryContractState(deployment.address);
            if (contractState) {
              const ledgerState = Payroll.ledger(contractState.data);
              console.log('\n  📊 PUBLIC LEDGER STATE:');
              console.log(`  • Registered Employees Count: ${ledgerState.employeeCount}`);
              console.log(`  • Total Payroll Disbursed:    ${ledgerState.totalDisbursed}`);
              console.log(`  • Processed Payroll Count:    ${ledgerState.payrollCount}`);
              console.log(`  • Last Commitment Hash:       ${formatBytesHex(ledgerState.lastDisbursedHash)}`);
              console.log(`  • Admin Public Key:           ${formatBytesHex(ledgerState.adminPublicKey)}\n`);
            } else {
              console.log('\n  📊 Contract ledger state is currently empty.\n');
            }
          } catch (error) {
            console.error('\n  ❌ Failed to query ledger state:', error instanceof Error ? error.message : error);
          }
          break;
        }

        case '5': {
          console.log('\n  Checking Wallet Balances...');
          const currentState = await walletCtx.wallet.waitForSyncedState();
          const currentBalance = currentState.unshielded.balances[unshieldedToken().raw] ?? 0n;
          const dustBalance = currentState.dust.balance(new Date());
          console.log(`\n  tNight Balance: ${currentBalance.toLocaleString()}`);
          console.log(`  DUST Balance:   ${dustBalance.toLocaleString()}\n`);
          break;
        }

        case '6':
          running = false;
          console.log('\n  👋 Exiting Confidential Payroll CLI. Goodbye!\n');
          break;

        default:
          console.log('\n  ❌ Invalid selection. Choose option 1 to 6.\n');
      }
    }

    await persistWalletState(network, walletCtx);
    await walletCtx.wallet.stop();
  } catch (error) {
    console.error('\n❌ CLI Error:', error instanceof Error ? error.message : error);
  } finally {
    rl.close();
  }
}

main().catch(console.error);
