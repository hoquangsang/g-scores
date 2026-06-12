import { Bell, Moon, Search, Sun, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';

import type { Theme } from './storage';

export function Topbar({
  theme,
  onToggleTheme,
}: {
  readonly theme: Theme;
  readonly onToggleTheme: () => void;
}) {
  const router = useRouter();
  const [quickSearch, setQuickSearch] = useState('');

  function handleQuickSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const registrationNumber = quickSearch.trim();

    if (!registrationNumber) {
      return;
    }

    router.push(`/scores?registrationNumber=${encodeURIComponent(registrationNumber)}`);
  }

  return (
    <header className="topbar">
      <form className="global-search" onSubmit={handleQuickSearch}>
        <Search size={19} aria-hidden="true" />
        <input
          aria-label="Tra cứu nhanh số báo danh"
          inputMode="numeric"
          placeholder="Tra cứu nhanh SBD..."
          value={quickSearch}
          onChange={(event) => setQuickSearch(event.target.value)}
        />
      </form>

      <div className="topbar-actions">
        <button
          className="icon-button"
          type="button"
          onClick={onToggleTheme}
          aria-label="Đổi giao diện"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="icon-button icon-button--notice" type="button" aria-label="Thông báo">
          <Bell size={20} />
        </button>
        <button className="profile-button" type="button" aria-label="Tài khoản">
          <User size={19} />
        </button>
      </div>
    </header>
  );
}
