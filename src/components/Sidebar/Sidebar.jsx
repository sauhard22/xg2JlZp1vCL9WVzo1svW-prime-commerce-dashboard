import { useState } from 'react';
import styles from './Sidebar.module.css';

const NAV_ITEMS = ['Overview', 'Transactions', 'Catalog', 'Reports', 'Settings'];

/** Brand + primary navigation. Full sidebar on tablet/desktop, compact bar with a menu toggle on mobile. */
export default function Sidebar({ items = NAV_ITEMS, active = 'Overview' }) {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.sidebar}>
      <div className={styles.brandRow}>
        <span className={styles.brand}>
          <svg className={styles.mark} viewBox="0 0 54 54" aria-hidden="true" focusable="false">
            <rect width="54" height="54" rx="15" fill="#2563EB" />
            <path d="M14 36L25 22l8 7 10-15" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          prime commerce
        </span>
        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
          <span className={styles.burger} aria-hidden="true" />
        </button>
      </div>
      <nav id="primary-nav" aria-label="Main navigation" className={`${styles.nav} ${open ? styles.navOpen : ''}`}>
        <ul>
          {items.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className={item === active ? styles.active : undefined}
                aria-current={item === active ? 'page' : undefined}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
