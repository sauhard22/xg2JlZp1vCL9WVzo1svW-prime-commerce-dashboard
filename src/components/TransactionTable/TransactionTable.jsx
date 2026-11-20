import { formatDate, formatINR } from '../../lib/transactions.js';
import styles from './TransactionTable.module.css';

const COLUMNS = [
  { key: 'transaction_id', label: 'Transaction', sortable: true },
  { key: 'product_name', label: 'Product' },
  { key: 'region', label: 'Region' },
  { key: 'net_amount_inr', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'order_date', label: 'Date', sortable: true },
];

const ARIA_SORT = { asc: 'ascending', desc: 'descending' };

function SortIcon({ direction }) {
  return (
    <svg className={styles.sortIcon} data-dir={direction ?? 'none'} viewBox="0 0 10 14" aria-hidden="true" focusable="false">
      <path className={styles.up} d="M5 1L9 6H1z" />
      <path className={styles.down} d="M5 13L1 8h8z" />
    </svg>
  );
}

/**
 * Transaction log for the current page of rows. Real <table> on tablet/desktop;
 * on narrow screens CSS turns each row into a card (explicit ARIA roles keep table semantics).
 * @param {object[]} rows   rows to render (already filtered, sorted, paged)
 * @param {{column:string, direction:'asc'|'desc'}} sort
 * @param {(column:string) => void} onSort  called with a column key when a sortable header is activated
 */
export default function TransactionTable({ rows, sort, onSort }) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table} role="table">
        <caption className="visually-hidden">
          Transactions, sorted by {COLUMNS.find((c) => c.key === sort.column)?.label} {ARIA_SORT[sort.direction]}
        </caption>
        <thead role="rowgroup">
          <tr role="row">
            {COLUMNS.map((col) => {
              const active = sort.column === col.key;
              return (
                <th
                  key={col.key}
                  scope="col"
                  role="columnheader"
                  className={styles[col.key]}
                  aria-sort={col.sortable ? (active ? ARIA_SORT[sort.direction] : 'none') : undefined}
                >
                  {col.sortable ? (
                    <button type="button" className={styles.sortButton} onClick={() => onSort(col.key)}>
                      {col.label}
                      <SortIcon direction={active ? sort.direction : undefined} />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {rows.map((t) => (
            <tr key={t.transaction_id} role="row">
              <td role="cell" className={styles.transaction_id} data-label="Transaction">{t.transaction_id}</td>
              <td role="cell" className={styles.product_name} data-label="Product">{t.product_name}</td>
              <td role="cell" className={styles.region} data-label="Region">{t.region}</td>
              <td role="cell" className={styles.net_amount_inr} data-label="Amount">{formatINR(t.net_amount_inr)}</td>
              <td role="cell" className={styles.status} data-label="Status">
                <span className={`${styles.badge} ${styles[`badge${t.status}`]}`}>{t.status}</span>
              </td>
              <td role="cell" className={styles.order_date} data-label="Date">
                <time dateTime={t.order_date}>{formatDate(t.order_date)}</time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
