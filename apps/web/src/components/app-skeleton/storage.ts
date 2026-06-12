export type Theme = 'light' | 'dark';

const themeStorageKey = 'g-scores-theme';
const sidebarStorageKey = 'g-scores-sidebar-collapsed';
const appSkeletonStorageEvent = 'g-scores-app-skeleton-storage';

export function getThemeSnapshot(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const savedTheme = window.localStorage.getItem(themeStorageKey);
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getServerTheme(): Theme {
  return 'light';
}

export function getCollapsedSnapshot(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(sidebarStorageKey) === 'true';
}

export function getServerCollapsedState(): boolean {
  return false;
}

export function setStoredTheme(theme: Theme) {
  window.localStorage.setItem(themeStorageKey, theme);
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new Event(appSkeletonStorageEvent));
}

export function setStoredCollapsedState(isCollapsed: boolean) {
  window.localStorage.setItem(sidebarStorageKey, String(isCollapsed));
  window.dispatchEvent(new Event(appSkeletonStorageEvent));
}

export function subscribeToAppSkeletonStorage(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(appSkeletonStorageEvent, onStoreChange);

  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(appSkeletonStorageEvent, onStoreChange);
  };
}
