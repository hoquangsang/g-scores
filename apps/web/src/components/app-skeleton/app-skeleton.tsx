'use client';

import { type ReactNode, useEffect, useSyncExternalStore } from 'react';

import { Sidebar } from './sidebar';
import {
  getCollapsedSnapshot,
  getServerCollapsedState,
  getServerTheme,
  getThemeSnapshot,
  setStoredCollapsedState,
  setStoredTheme,
  subscribeToAppSkeletonStorage,
} from './storage';
import { Topbar } from './topbar';

export function AppSkeleton({ children }: { readonly children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToAppSkeletonStorage,
    getThemeSnapshot,
    getServerTheme,
  );
  const isCollapsed = useSyncExternalStore(
    subscribeToAppSkeletonStorage,
    getCollapsedSnapshot,
    getServerCollapsedState,
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <main
      className={isCollapsed ? 'dashboard-shell dashboard-shell--collapsed' : 'dashboard-shell'}
    >
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapsed={() => setStoredCollapsedState(!isCollapsed)}
      />
      <section className="dashboard-main">
        <Topbar
          theme={theme}
          onToggleTheme={() => setStoredTheme(theme === 'dark' ? 'light' : 'dark')}
        />
        <div className="content-wrap">{children}</div>
      </section>
    </main>
  );
}
