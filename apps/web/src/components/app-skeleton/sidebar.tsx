import { Award, ChevronLeft, ChevronRight, LayoutDashboard, Search, Trophy } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Tổng quan', icon: LayoutDashboard },
  { href: '/scores', label: 'Tra cứu điểm', icon: Search },
  { href: '/rankings', label: 'Xếp hạng', icon: Trophy },
];

export function Sidebar({
  isCollapsed,
  onToggleCollapsed,
}: {
  readonly isCollapsed: boolean;
  readonly onToggleCollapsed: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link className="brand-block" href="/">
        <span className="brand-mark">
          <Award size={20} aria-hidden="true" />
        </span>
        <div>
          <strong>G-Scores</strong>
          <span>Admin</span>
        </div>
      </Link>

      <button
        className="sidebar-collapse"
        type="button"
        onClick={onToggleCollapsed}
        aria-label="Thu gọn sidebar"
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      <nav className="side-nav" aria-label="Điều hướng chính">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

          return (
            <Link
              className={isActive ? 'side-link side-link--active' : 'side-link'}
              href={item.href}
              key={item.href}
              title={item.label}
            >
              <Icon size={20} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <span className="avatar">GS</span>
        <div>
          <strong>G-Scores</strong>
          <span>Kỳ thi THPT 2024</span>
        </div>
      </div>
    </aside>
  );
}
