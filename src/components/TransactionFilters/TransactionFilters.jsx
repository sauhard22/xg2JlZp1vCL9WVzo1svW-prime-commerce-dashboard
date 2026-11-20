import { ALL } from '../../lib/transactions.js';
import styles from './TransactionFilters.module.css';

const SORT_OPTIONS = [
  { value: 'order_date:desc', label: 'Newest first' },
  { value: 'order_date:asc', label: 'Oldest first' },
  { value: 'net_amount_inr:desc', label: 'Highest amount' },
  { value: 'net_amount_inr:asc', label: 'Lowest amount' },
  { value: 'transaction_id:asc', label: 'ID: A–Z' },
  { value: 'transaction_id:desc', label: 'ID: Z–A' },
];

/**
 * Search box, Region and Status dropdowns, Reset, and a sort dropdown that only shows on
 * narrow screens (where the sortable column headers are replaced by row cards).
 * All state lives in useTransactions; this component only reports changes.
 */
export default function TransactionFilters({
  filters,
  regions,
  statuses,
  sort,
  onQueryChange,
  onRegionChange,
  onStatusChange,
  onSortChange,
  onReset,
  canReset,
}) {
  const sortValue = `${sort.column}:${sort.direction}`;

  const handleSortSelect = (e) => {
    const [column, direction] = e.target.value.split(':');
    onSortChange({ column, direction });
  };

  return (
    <form className={styles.filters} role="search" aria-label="Filter transactions" onSubmit={(e) => e.preventDefault()}>
      <div className={styles.search}>
        <label htmlFor="txn-search" className="visually-hidden">
          Search by transaction ID, product or customer reference
        </label>
        <input
          id="txn-search"
          type="search"
          className={styles.field}
          placeholder="Search ID, product or customer"
          value={filters.query}
          onChange={(e) => onQueryChange(e.target.value)}
          autoComplete="off"
        />
      </div>

      <div className={styles.selects}>
        <label htmlFor="region-filter" className="visually-hidden">Region</label>
        <select
          id="region-filter"
          className={styles.field}
          value={filters.region}
          onChange={(e) => onRegionChange(e.target.value)}
        >
          <option value={ALL}>All regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <label htmlFor="status-filter" className="visually-hidden">Status</label>
        <select
          id="status-filter"
          className={styles.field}
          value={filters.status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value={ALL}>All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <label htmlFor="sort-select" className={`visually-hidden ${styles.sortLabel}`}>Sort by</label>
        <select id="sort-select" className={`${styles.field} ${styles.sortSelect}`} value={sortValue} onChange={handleSortSelect}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <button type="button" className={styles.reset} onClick={onReset} disabled={!canReset}>
          Reset
        </button>
      </div>
    </form>
  );
}
