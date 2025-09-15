import { useCallback, useEffect, useMemo, useState } from 'react'
import DailyLogView from './components/DailyLogView.jsx'
import NewEntryForm from './components/NewEntryForm.jsx'
import SearchAndFilter from './components/SearchAndFilter.jsx'
import InsightsView from './components/InsightsView.jsx'
import ProfileView from './components/ProfileView.jsx'
import MobileNav from './components/MobileNav.jsx'
import { initialEntries } from './data/initialEntries.js'
import { smartReminders } from './data/smartReminders.js'
import { userProfile as initialProfile } from './data/userProfile.js'
import { defaultTags } from './utils/constants.js'
import { calculateStreak } from './utils/analytics.js'

const tabs = [
  { id: 'daily', label: 'Daily log', icon: '📅' },
  { id: 'create', label: 'New entry', icon: '✨' },
  { id: 'search', label: 'Search', icon: '🔍' },
  { id: 'insights', label: 'Insights', icon: '📊' },
  { id: 'profile', label: 'Profile', icon: '👤' }
]

const emptyFilters = {
  types: [],
  moods: [],
  tags: [],
  dateFrom: '',
  dateTo: '',
  hasMedia: false
}

const App = () => {
  const [entries, setEntries] = useState(initialEntries)
  const [activeView, setActiveView] = useState('daily')
  const [selectedEntryId, setSelectedEntryId] = useState(initialEntries[0]?.id ?? null)
  const [reminders, setReminders] = useState(smartReminders)
  const [profile, setProfile] = useState(() => ({ ...initialProfile, preferences: { ...initialProfile.preferences } }))
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState(emptyFilters)

  useEffect(() => {
    if (!entries.length) {
      setSelectedEntryId(null)
      return
    }

    if (!entries.some((entry) => entry.id === selectedEntryId)) {
      setSelectedEntryId(entries[0].id)
    }
  }, [entries, selectedEntryId])

  const scrollToTop = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  const availableTags = useMemo(() => {
    const tagSet = new Set([...defaultTags, ...profile.favoriteTags])
    entries.forEach((entry) => entry.tags?.forEach((tag) => tagSet.add(tag)))
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b))
  }, [entries, profile.favoriteTags])

  const selectedEntry = useMemo(
    () => entries.find((entry) => entry.id === selectedEntryId) ?? entries[0] ?? null,
    [entries, selectedEntryId]
  )

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const haystack = [
        entry.title,
        entry.content,
        entry.summary,
        entry.location,
        entry.tags?.join(' ')
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      const needle = searchTerm.trim().toLowerCase()
      const matchesSearch = needle.length === 0 || haystack.includes(needle)

      const matchesType = !filters.types.length || filters.types.includes(entry.type)
      const matchesMood = !filters.moods.length || filters.moods.includes(entry.mood)
      const matchesTags =
        !filters.tags.length || entry.tags?.some((tag) => filters.tags.includes(tag))

      const createdAt = new Date(entry.createdAt)
      const matchesFrom = !filters.dateFrom || createdAt >= new Date(filters.dateFrom)
      const matchesTo = !filters.dateTo || createdAt <= new Date(`${filters.dateTo}T23:59:59`)

      const hasMedia = Boolean(entry.attachments?.images?.length || entry.attachments?.audio)
      const matchesMedia = !filters.hasMedia || hasMedia

      return matchesSearch && matchesType && matchesMood && matchesTags && matchesFrom && matchesTo && matchesMedia
    })
  }, [entries, filters, searchTerm])

  const streak = useMemo(() => calculateStreak(entries), [entries])

  const handleSelectEntry = (entry) => {
    setSelectedEntryId(entry.id)
    if (activeView !== 'daily') {
      setActiveView('daily')
    }
    scrollToTop()
  }

  const handleAddEntry = (entry) => {
    setEntries((current) => [entry, ...current])
    setSelectedEntryId(entry.id)
    setActiveView('daily')
    setReminders((current) => [
      {
        id: `reminder-${entry.id}`,
        title: `Reflect on ${entry.title}`,
        trigger: 'New entry created just now',
        dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        suggestedAction: 'Check back tomorrow and add a follow-up note to see what evolved.',
        category: 'Reflection'
      },
      ...current
    ])
    scrollToTop()
  }

  const handleTogglePreference = (key) => {
    setProfile((current) => ({
      ...current,
      preferences: {
        ...current.preferences,
        [key]: !current.preferences[key]
      }
    }))
  }

  const handleStartNewEntry = () => {
    setActiveView('create')
    scrollToTop()
  }

  const handleOpenSearch = () => {
    setActiveView('search')
    scrollToTop()
  }

  const handleNavigate = useCallback(
    (view) => {
      setActiveView(view)
      if (view === 'daily' && selectedEntryId == null && entries[0]) {
        setSelectedEntryId(entries[0].id)
      }
      scrollToTop()
    },
    [entries, scrollToTop, selectedEntryId]
  )

  const renderView = () => {
    switch (activeView) {
      case 'daily':
        return (
          <DailyLogView
            entries={entries}
            selectedEntry={selectedEntry}
            onSelectEntry={handleSelectEntry}
            onStartNewEntry={handleStartNewEntry}
            reminders={reminders}
            onOpenSearch={handleOpenSearch}
          />
        )
      case 'create':
        return <NewEntryForm onSave={handleAddEntry} availableTags={availableTags} />
      case 'search':
        return (
          <SearchAndFilter
            entries={filteredEntries}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFiltersChange={setFilters}
            onSelectEntry={handleSelectEntry}
            selectedEntryId={selectedEntry?.id ?? null}
            availableTags={availableTags}
          />
        )
      case 'insights':
        return <InsightsView entries={entries} />
      case 'profile':
        return <ProfileView user={profile} entries={entries} onTogglePreference={handleTogglePreference} />
      default:
        return null
    }
  }

  return (
    <div className="app-shell">
      <main className="app-content">
        <header className="top-bar" style={{ alignItems: 'flex-end' }}>
          <div>
            <h1>Journal Companion</h1>
            <p style={{ marginTop: '0.35rem', color: 'var(--text-secondary)' }}>
              Capture memories, surface insights, and stay connected to what matters most.
            </p>
          </div>
          <div className="top-bar-actions">
            <nav className="tab-bar" aria-label="Primary views">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`tab-button${activeView === tab.id ? ' active' : ''}`}
                  onClick={() => handleNavigate(tab.id)}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
            <span className="badge">🔥 {streak}-day streak</span>
          </div>
        </header>

        {renderView()}
      </main>

      <MobileNav activeView={activeView} onNavigate={handleNavigate} />
    </div>
  )
}

export default App
