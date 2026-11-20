import styles from './Pagination.module.css';

/**
 * "Showing 1–10 of 120 transactions" plus Previous/Next.
 * @param {number} page        current page (1-based)
 * @param {number} pageCount   total pages
 * @param {number} pageSize    rows per page
 * @param {number} matched     rows matching the current filters
 * @param {number} total       rows in the whole dataset
 * @param {(page:number) => void} onPageChange
 */
export default function Pagination({ page, pageCount, pageSize, matched, total, onPageChange }) {
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, matched);

  return (
    <div className={styles.bar}>
      <p className={styles.summary} aria-live="polite">
        Showing {from}–{to} of {matched} transactions
        {matched !== total && <span className={styles.ofTotal}> (filtered from {total})</span>}
      </p>
      {pageCount > 1 && (
        <nav className={styles.pager} aria-label="Transaction pages">
          <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {page} of {pageCount}
          </span>
          <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= pageCount}>
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
