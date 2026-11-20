import { useMemo } from 'react';
import { toCSV } from '../../lib/transactions.js';
import styles from './Header.module.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "Sep–Nov 2026" built from the earliest and latest order dates in the data. */
function periodLabel(rows) {
  if (rows.length === 0) return '';
  const dates = rows.map((r) => r.order_date).sort();
  const [y1, m1] = dates[0].split('-');
  const [y2, m2] = dates[dates.length - 1].split('-');
  const a = MONTHS[Number(m1) - 1];
  const b = MONTHS[Number(m2) - 1];
  if (y1 !== y2) return `${a} ${y1}–${b} ${y2}`;
  return a === b ? `${a} ${y1}` : `${a}–${b} ${y1}`;
}

/**
 * Page title, data period and CSV export.
 * @param {object[]} rows        full dataset (used for the period label)
 * @param {object[]} exportRows  rows to download: the current filtered + sorted view
 */
export default function Header({ rows, exportRows }) {
  const period = useMemo(() => periodLabel(rows), [rows]);

  const handleExport = () => {
    const blob = new Blob([toCSV(exportRows)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'prime-commerce-transactions.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>Sales overview</h1>
        <p className={styles.subtitle}>Transaction performance · {period}</p>
      </div>
      <button type="button" className={styles.export} onClick={handleExport} disabled={exportRows.length === 0}>
        Export report
      </button>
    </header>
  );
}
