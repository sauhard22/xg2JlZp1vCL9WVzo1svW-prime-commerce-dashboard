// Pure data helpers. No React here so the logic can be unit tested directly.

export const SEARCH_COLUMNS = ['transaction_id', 'product_name', 'customer_ref'];

export const SORT_KEYS = {
  transaction_id: (t) => t.transaction_id,
  order_date: (t) => t.order_date,
  net_amount_inr: (t) => t.net_amount_inr,
};

export const ALL = 'All';

/** Case-insensitive search across transaction ID, product name and customer reference,
 *  combined (AND) with exact region and status filters. */
export function filterTransactions(rows, { query = '', region = ALL, status = ALL } = {}) {
  const needle = query.trim().toLowerCase();
  return rows.filter((t) => {
    if (region !== ALL && t.region !== region) return false;
    if (status !== ALL && t.status !== status) return false;
    if (!needle) return true;
    return SEARCH_COLUMNS.some((col) => String(t[col]).toLowerCase().includes(needle));
  });
}

/** Returns a new array sorted by column/direction. Ties fall back to transaction ID so order is stable. */
export function sortTransactions(rows, { column = 'order_date', direction = 'desc' } = {}) {
  const getter = SORT_KEYS[column] ?? SORT_KEYS.order_date;
  const sign = direction === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const va = getter(a);
    const vb = getter(b);
    let cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb));
    if (cmp === 0) cmp = a.transaction_id.localeCompare(b.transaction_id);
    return cmp * sign;
  });
}

/** KPI definitions from DATA/metric_definitions.csv, applied to the filtered rows. */
export function computeMetrics(rows) {
  const completed = rows.filter((t) => t.status === 'Completed');
  const netRevenue = completed.reduce((sum, t) => sum + t.net_amount_inr, 0);
  const completedOrders = completed.length;
  const averageOrder = completedOrders === 0 ? 0 : netRevenue / completedOrders;
  const refunds = rows.filter((t) => t.status === 'Refunded').length;
  return { netRevenue, completedOrders, averageOrder, refunds };
}

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
const count = new Intl.NumberFormat('en-IN');

/** ₹ with Indian digit grouping, e.g. 248600 -> "₹ 2,48,600". */
export function formatINR(value) {
  return `₹ ${inr.format(Math.round(value))}`;
}

export function formatCount(value) {
  return count.format(value);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** ISO "2026-09-04" -> "04 Sep 2026". Parsed by hand so the result never shifts with the viewer's time zone. */
export function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${d} ${MONTHS[Number(m) - 1]} ${y}`;
}

/** Turns rows into CSV text for the "Export report" button. */
export function toCSV(rows) {
  if (rows.length === 0) return '';
  const cols = Object.keys(rows[0]);
  const esc = (v) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
}
