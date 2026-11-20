import MetricCard from '../MetricCard/MetricCard.jsx';
import { formatCount, formatINR } from '../../lib/transactions.js';
import styles from './MetricCards.module.css';

/**
 * The four KPI cards. Values come from computeMetrics() on the currently filtered rows.
 * @param {{netRevenue:number, completedOrders:number, averageOrder:number, refunds:number}} metrics
 */
export default function MetricCards({ metrics }) {
  const cards = [
    { label: 'Net revenue', value: formatINR(metrics.netRevenue), note: 'Completed orders, after discount' },
    { label: 'Completed orders', value: formatCount(metrics.completedOrders), note: 'Status: Completed' },
    { label: 'Average order', value: formatINR(metrics.averageOrder), note: 'Net revenue ÷ completed orders' },
    { label: 'Refunds', value: formatCount(metrics.refunds), note: 'Status: Refunded' },
  ];

  return (
    <section aria-label="Sales metrics" className={styles.cards}>
      {cards.map((card) => (
        <MetricCard key={card.label} {...card} />
      ))}
    </section>
  );
}
