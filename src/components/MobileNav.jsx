import { NavLink } from 'react-router-dom'

const MobileNav = ({ items }) => {
  if (!items?.length) {
    return null
  }

  return (
    <nav className="mobile-nav" aria-label="Primary">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `mobile-nav__item${isActive ? ' mobile-nav__item--active' : ''}`}
        >
          <span aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default MobileNav
