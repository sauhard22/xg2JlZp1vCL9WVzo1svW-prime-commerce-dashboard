import transactions from './transactions.json';
import useTransactions, { PAGE_SIZE } from './hooks/useTransactions.js';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import Header from './components/Header/Header.jsx';
import MetricCards from './components/MetricCards/MetricCards.jsx';
import TransactionFilters from './components/TransactionFilters/TransactionFilters.jsx';
import TransactionTable from './components/TransactionTable/TransactionTable.jsx';
import EmptyState from './components/EmptyState/EmptyState.jsx';
import Pagination from './components/Pagination/Pagination.jsx';
import filterOptions from '../data/filter_options.json';
import styles from './App.module.css';

export default function App() {
  const tx = useTransactions(transactions);

  return (
    <div className={styles.shell}>
      <a className="skip-link" href="#main">Skip to content</a>
      <Sidebar />
      <main id="main" className={styles.main} tabIndex={-1}>
        <Header rows={transactions} exportRows={tx.sorted} />
        <MetricCards metrics={tx.metrics} />
        <section className={styles.panel} aria-labelledby="transactions-title">
          <h2 id="transactions-title" className={styles.panelTitle}>Recent transactions</h2>
          <TransactionFilters
            filters={tx.filters}
            regions={filterOptions.regions}
            statuses={filterOptions.statuses}
            sort={tx.sort}
            onQueryChange={tx.setQuery}
            onRegionChange={tx.setRegion}
            onStatusChange={tx.setStatus}
            onSortChange={tx.setSortTo}
            onReset={tx.reset}
            canReset={tx.isFiltered}
          />
          {tx.sorted.length === 0 ? (
            <EmptyState
              onClear={() => {
                tx.reset();
                // The Clear button unmounts, so hand focus to the search box instead of losing it.
                document.getElementById('txn-search')?.focus();
              }}
            />
          ) : (
            <>
              <TransactionTable rows={tx.pageRows} sort={tx.sort} onSort={tx.toggleSort} />
              <Pagination
                page={tx.page}
                pageCount={tx.pageCount}
                pageSize={PAGE_SIZE}
                matched={tx.sorted.length}
                total={tx.total}
                onPageChange={tx.setPage}
              />
            </>
          )}
        </section>
      </main>
    </div>
  );
}
