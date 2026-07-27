'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Menu, X } from 'lucide-react';
import styles from './TopNav.module.css';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/' },
  { label: 'Home Runs', href: '/home-runs' },
  { label: 'Baby Tracker', href: '/babytracker' },
];

export function TopNav() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <nav className={styles.topNav}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}></div>
            <span className={styles.wordmark}>Ryne Carnes</span>
          </Link>
        </div>

        <div className={styles.center}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(styles.navLink, isActive && styles.active)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className={styles.right}>
          <button className={styles.iconButton}>
            <User size={20} />
          </button>
          <button 
            className={styles.mobileMenuBtn}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div className={styles.mobileMenu}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(styles.mobileNavLink, isActive && styles.active)}
                onClick={() => setIsMobileOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
