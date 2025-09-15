const MobileNav = ({ activeView, onNavigate }) => {
  const items = [
    { id: 'daily', label: 'Daily Log', icon: '📅' },
    { id: 'create', label: 'New Entry', icon: '✨' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ]

  return (
    <nav className="mobile-nav" aria-label="Primary">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`mobile-nav__item${activeView === item.id ? ' mobile-nav__item--active' : ''}`}
          onClick={() => onNavigate(item.id)}
          aria-current={activeView === item.id ? 'page' : undefined}
        >
          <span aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default MobileNav
