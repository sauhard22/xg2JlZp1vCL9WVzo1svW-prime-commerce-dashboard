import { describe, expect, it } from 'vitest';
import rows from '../transactions.json';
import {
  ALL,
  computeMetrics,
  filterTransactions,
  formatDate,
  formatINR,
  sortTransactions,
  toCSV,
} from './transactions.js';

// Expected figures were worked out independently from DATA/transactions.json with a Python script
// (see QA_REPORT.md), not copied from the design mock-ups.
describe('dataset', () => {
  it('loads all 120 supplied rows', () => {
    expect(rows).toHaveLength(120);
  });
});

describe('computeMetrics', () => {
  it('uses completed-only definitions on the full dataset', () => {
    const m = computeMetrics(rows);
    expect(m.netRevenue).toBe(110680);
    expect(m.completedOrders).toBe(60);
    expect(m.averageOrder).toBeCloseTo(110680 / 60, 6);
    expect(m.refunds).toBe(20);
  });

  it('returns zeros (not NaN) when nothing matches', () => {
    expect(computeMetrics([])).toEqual({ netRevenue: 0, completedOrders: 0, averageOrder: 0, refunds: 0 });
  });

  it('responds to filters', () => {
    const north = filterTransactions(rows, { region: 'North' });
    const m = computeMetrics(north);
    const completed = north.filter((t) => t.status === 'Completed');
    expect(m.completedOrders).toBe(completed.length);
    expect(m.netRevenue).toBe(completed.reduce((s, t) => s + t.net_amount_inr, 0));
    expect(m.refunds).toBe(north.filter((t) => t.status === 'Refunded').length);
  });
});

describe('filterTransactions', () => {
  it('searches transaction ID case-insensitively', () => {
    const upper = filterTransactions(rows, { query: 'TXN-25005' });
    const lower = filterTransactions(rows, { query: 'txn-25005' });
    expect(upper.map((t) => t.transaction_id)).toEqual(['TXN-25005']);
    expect(lower).toEqual(upper);
  });

  it('searches product name', () => {
    const res = filterTransactions(rows, { query: 'wireless mouse' });
    expect(res.length).toBeGreaterThan(0);
    expect(res.every((t) => t.product_name === 'Wireless Mouse')).toBe(true);
  });

  it('searches customer reference', () => {
    const res = filterTransactions(rows, { query: 'cust-1017' });
    expect(res.length).toBeGreaterThan(0);
    expect(res.every((t) => t.customer_ref === 'CUST-1017')).toBe(true);
  });

  it('ignores surrounding whitespace', () => {
    expect(filterTransactions(rows, { query: '  TXN-25005 ' })).toHaveLength(1);
  });

  it('filters by region and status, combined with search', () => {
    const res = filterTransactions(rows, { query: 'lamp', region: 'North', status: 'Completed' });
    expect(res.every((t) => t.region === 'North' && t.status === 'Completed' && /lamp/i.test(t.product_name))).toBe(true);
    const expected = rows.filter(
      (t) => t.region === 'North' && t.status === 'Completed' && t.product_name.toLowerCase().includes('lamp'),
    );
    expect(res).toEqual(expected);
  });

  it('returns everything with default filters', () => {
    expect(filterTransactions(rows, { query: '', region: ALL, status: ALL })).toHaveLength(120);
  });

  it('returns nothing for a query with no match', () => {
    expect(filterTransactions(rows, { query: 'zzz-no-such-thing' })).toHaveLength(0);
  });
});

describe('sortTransactions', () => {
  const amounts = (list) => list.map((t) => t.net_amount_inr);

  it('sorts amount ascending and descending', () => {
    const asc = amounts(sortTransactions(rows, { column: 'net_amount_inr', direction: 'asc' }));
    const desc = amounts(sortTransactions(rows, { column: 'net_amount_inr', direction: 'desc' }));
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
  });

  it('sorts date both ways', () => {
    const asc = sortTransactions(rows, { column: 'order_date', direction: 'asc' }).map((t) => t.order_date);
    const desc = sortTransactions(rows, { column: 'order_date', direction: 'desc' }).map((t) => t.order_date);
    expect(asc).toEqual([...asc].sort());
    expect(desc).toEqual([...asc].sort().reverse());
  });

  it('sorts transaction ID', () => {
    const ids = sortTransactions(rows, { column: 'transaction_id', direction: 'asc' }).map((t) => t.transaction_id);
    expect(ids[0]).toBe('TXN-25001');
    expect(ids[ids.length - 1]).toBe('TXN-25120');
  });

  it('does not mutate its input', () => {
    const copy = [...rows];
    sortTransactions(rows, { column: 'net_amount_inr', direction: 'asc' });
    expect(rows).toEqual(copy);
  });
});

describe('formatting', () => {
  it('formats INR with Indian grouping', () => {
    expect(formatINR(248600)).toBe('₹ 2,48,600');
    expect(formatINR(1844.67)).toBe('₹ 1,845');
    expect(formatINR(0)).toBe('₹ 0');
  });

  it('formats ISO dates as DD MMM YYYY', () => {
    expect(formatDate('2026-09-04')).toBe('04 Sep 2026');
    expect(formatDate('2026-11-12')).toBe('12 Nov 2026');
  });

  it('builds CSV with a header row', () => {
    const csv = toCSV(rows.slice(0, 2)).split('\n');
    expect(csv).toHaveLength(3);
    expect(csv[0].startsWith('transaction_id,order_date')).toBe(true);
  });
});
