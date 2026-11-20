import { useMemo, useState } from 'react';
import { ALL, computeMetrics, filterTransactions, sortTransactions } from '../lib/transactions.js';

export const PAGE_SIZE = 10;
const DEFAULT_SORT = { column: 'order_date', direction: 'desc' };

/** Shared dashboard state: filters, sort and paging, plus everything derived from them.
 *  Metric cards and the table both read from the same filtered rows. */
export default function useTransactions(rows) {
  const [query, setQueryRaw] = useState('');
  const [region, setRegionRaw] = useState(ALL);
  const [status, setStatusRaw] = useState(ALL);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [page, setPage] = useState(1);

  // Any filter change goes back to page 1.
  const setQuery = (v) => { setQueryRaw(v); setPage(1); };
  const setRegion = (v) => { setRegionRaw(v); setPage(1); };
  const setStatus = (v) => { setStatusRaw(v); setPage(1); };

  const filtered = useMemo(
    () => filterTransactions(rows, { query, region, status }),
    [rows, query, region, status],
  );
  const sorted = useMemo(() => sortTransactions(filtered, sort), [filtered, sort]);
  const metrics = useMemo(() => computeMetrics(filtered), [filtered]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const toggleSort = (column) => {
    setSort((prev) =>
      prev.column === column
        ? { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { column, direction: column === 'order_date' ? 'desc' : 'asc' },
    );
    setPage(1);
  };

  const setSortTo = (next) => { setSort(next); setPage(1); };

  const reset = () => {
    setQueryRaw('');
    setRegionRaw(ALL);
    setStatusRaw(ALL);
    setSort(DEFAULT_SORT);
    setPage(1);
  };

  const isFiltered = query.trim() !== '' || region !== ALL || status !== ALL;

  return {
    filters: { query, region, status },
    setQuery, setRegion, setStatus, reset, isFiltered,
    sort, toggleSort, setSortTo,
    filtered, sorted, metrics,
    page: currentPage, pageCount, setPage, pageRows,
    total: rows.length,
  };
}
