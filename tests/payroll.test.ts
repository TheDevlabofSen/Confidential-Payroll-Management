import { describe, it } from 'node:test';
import assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { createHash } from 'node:crypto';
import { resolveNetwork } from '../src/network.js';

// Helper hash function matching contract & CLI behavior
function hash32(input: string): Uint8Array {
  const hash = createHash('sha256').update(input).digest();
  return new Uint8Array(hash);
}

function computeNetSalary(baseSalary: bigint, bonus: bigint, taxDeduction: bigint): bigint {
  const gross = baseSalary + bonus;
  if (gross < taxDeduction) {
    throw new Error('Tax deduction exceeds gross salary');
  }
  return gross - taxDeduction;
}

function verifySplitInvariant(grossAmount: bigint, splitPercentNumerator: bigint, expectedSplit: bigint): boolean {
  if (splitPercentNumerator > 100n) {
    throw new Error('Split percentage numerator cannot exceed 100%');
  }
  const lhs = expectedSplit * 100n;
  const rhs = grossAmount * splitPercentNumerator;
  return lhs === rhs;
}

describe('Confidential Payroll Management Test Suite', () => {
  it('1. Verifies Compact compiler generated contract artifacts exist', () => {
    const managedDir = path.resolve(process.cwd(), 'contracts', 'managed', 'payroll');
    const contractJs = path.join(managedDir, 'contract', 'index.js');
    const contractDts = path.join(managedDir, 'contract', 'index.d.ts');

    assert.strictEqual(fs.existsSync(managedDir), true);
    assert.strictEqual(fs.existsSync(contractJs), true);
    assert.strictEqual(fs.existsSync(contractDts), true);
  });

  it('2. Verifies private net salary computation and invariants', () => {
    const baseSalary = 5000n;
    const bonus = 1000n;
    const taxDeduction = 800n;

    const netSalary = computeNetSalary(baseSalary, bonus, taxDeduction);
    assert.strictEqual(netSalary, 5200n);

    // Verify error throwing when tax exceeds gross
    assert.throws(
      () => computeNetSalary(2000n, 500n, 3000n),
      /Tax deduction exceeds gross salary/
    );
  });

  it('3. Verifies ZK revenue split mathematical invariants', () => {
    const grossAmount = 10000n;
    const splitNumerator = 25n; // 25%
    const expectedSplit = 2500n;

    const isValid = verifySplitInvariant(grossAmount, splitNumerator, expectedSplit);
    assert.strictEqual(isValid, true);

    // Mismatched expected split should return false
    const isInvalid = verifySplitInvariant(grossAmount, splitNumerator, 3000n);
    assert.strictEqual(isInvalid, false);

    // Split percentage > 100 should throw
    assert.throws(
      () => verifySplitInvariant(10000n, 120n, 12000n),
      /Split percentage numerator cannot exceed 100%/
    );
  });

  it('4. Verifies network configuration and resolver defaults', () => {
    const defaultNetworkConfig = resolveNetwork({});
    assert.strictEqual(defaultNetworkConfig.network, 'undeployed');
    assert.ok(defaultNetworkConfig.config.node);
    assert.ok(defaultNetworkConfig.config.indexer);
    assert.ok(defaultNetworkConfig.config.proofServer);
  });

  it('5. Verifies cryptographic commitment and hash utilities', () => {
    const empId = 'EMP-10023';
    const hash1 = hash32(empId);
    const hash2 = hash32(empId);

    assert.strictEqual(hash1.length, 32);
    assert.strictEqual(Buffer.from(hash1).toString('hex'), Buffer.from(hash2).toString('hex'));
  });
});
