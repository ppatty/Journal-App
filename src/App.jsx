import { useCallback, useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import DailyLogView from './components/DailyLogView.jsx'
import NewEntryForm from './components/NewEntryForm.jsx'
import SearchAndFilter from './components/SearchAndFilter.jsx'
import InsightsView from './components/InsightsView.jsx'
import ProfileView from './components/ProfileView.jsx'
import AppLayout from './components/AppLayout.jsx'
import { initialEntries } from './data/initialEntries.js'
import { smartReminders } from './data/smartReminders.js'
import { userProfile as initialProfile } from './data/userProfile.js'
import { defaultTags } from './utils/constants.js'
import { calculateStreak } from './utils/analytics.js'

const navItems = [
  { path: '/daily', label: 'Daily log', icon: '📅' },
  { path: '/entries/new', label: 'New entry', icon: '✨' },
  { path: '/search', label: 'Search', icon: '🔍' },
  { path: '/insights', label: 'Insights', icon: '📊' },
  { path: '/profile', label: 'Profile', icon: '👤' }
]

const emptyFilters = {
  types: [],
  moods: [],
  tags: [],
  dateFrom: '',
  dateTo: '',
  hasMedia: false
}

const AppRoutes = ({
  entries,
  reminders,
  selectedEntry,
  setSelectedEntryId,
  availableTags,
  onAddEntry,
  searchTerm,
  onSearchTermChange,
  filters,
  onFiltersChange,
  filteredEntries,
  profile,
  onTogglePreference,
  onUpdateProfile,
  scrollToTop
}) => {
  const navigate = useNavigate()

  const handleSelectEntry = useCallback(
    (entry) => {
      setSelectedEntryId(entry.id)
      navigate('/daily')
      scrollToTop()
    },
    [navigate, scrollToTop, setSelectedEntryId]
  )

  const handleStartNewEntry = useCallback(() => {
    navigate('/entries/new')
    scrollToTop()
  }, [navigate, scrollToTop])

  const handleOpenSearch = useCallback(() => {
    navigate('/search')
    scrollToTop()
  }, [navigate, scrollToTop])

  const handleSaveEntry = useCallback(
    (entry) => {
      onAddEntry(entry)
      navigate('/daily')
      scrollToTop()
    },
    [navigate, onAddEntry, scrollToTop]
  )

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/daily" replace />} />
      <Route
        path="/daily"
        element={
          <DailyLogView
            entries={entries}
            selectedEntry={selectedEntry}
            onSelectEntry={handleSelectEntry}
            onStartNewEntry={handleStartNewEntry}
            reminders={reminders}
            onOpenSearch={handleOpenSearch}
          />
        }
      />
      <Route
        path="/entries/new"
        element={<NewEntryForm onSave={handleSaveEntry} availableTags={availableTags} />}
      />
      <Route
        path="/search"
        element={
          <SearchAndFilter
            entries={filteredEntries}
            searchTerm={searchTerm}
            onSearchChange={onSearchTermChange}
            filters={filters}
            onFiltersChange={onFiltersChange}
            onSelectEntry={handleSelectEntry}
            selectedEntryId={selectedEntry?.id ?? null}
            availableTags={availableTags}
          />
        }
      />
      <Route path="/insights" element={<InsightsView entries={entries} />} />
      <Route
        path="/profile"
        element={
          <ProfileView
            user={profile}
            entries={entries}
            onTogglePreference={onTogglePreference}
            onUpdateProfile={onUpdateProfile}
          />
        }
      />
      <Route path="*" element={<Navigate to="/daily" replace />} />
    </Routes>
  )
}

const App = () => {
  const [entries, setEntries] = useState(initialEntries)
  const [selectedEntryId, setSelectedEntryId] = useState(initialEntries[0]?.id ?? null)
  const [reminders, setReminders] = useState(smartReminders)
  const [profile, setProfile] = useState(() => ({
    ...initialProfile,
    preferences: { ...initialProfile.preferences }
  }))
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
    const favoriteTags = profile.favoriteTags ?? []
    const tagSet = new Set([...defaultTags, ...favoriteTags])
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

      const hasMedia = Boolean(
        entry.attachments?.images?.length ||
          entry.attachments?.videos?.length ||
          entry.attachments?.audio
      )
      const matchesMedia = !filters.hasMedia || hasMedia

      return matchesSearch && matchesType && matchesMood && matchesTags && matchesFrom && matchesTo && matchesMedia
    })
  }, [entries, filters, searchTerm])

  const streak = useMemo(() => calculateStreak(entries), [entries])

  const handleAddEntry = useCallback((entry) => {
    setEntries((current) => [entry, ...current])
    setSelectedEntryId(entry.id)
    setReminders((current) => [
      {
        id: `reminder-${entry.id}`,
        title: `Reflect on ${entry.title}`,
        trigger: 'New entry created just now',
        dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        suggestedAction:
          'Check back tomorrow and add a follow-up note to see what evolved.',
        category: 'Reflection'
      },
      ...current
    ])
  }, [])

  const handleTogglePreference = useCallback((key) => {
    setProfile((current) => ({
      ...current,
      preferences: {
        ...current.preferences,
        [key]: !current.preferences[key]
      }
    }))
  }, [])

  const handleUpdateProfile = useCallback((updates) => {
    setProfile((current) => ({
      ...current,
      ...updates,
      contact: { ...current.contact, ...(updates.contact ?? {}) },
      favoriteTags: updates.favoriteTags ?? current.favoriteTags,
      preferences: { ...current.preferences }
    }))
  }, [])

  return (
    <BrowserRouter>
      <AppLayout navItems={navItems} streak={streak}>
        <AppRoutes
          entries={entries}
          reminders={reminders}
          selectedEntry={selectedEntry}
          setSelectedEntryId={setSelectedEntryId}
          availableTags={availableTags}
          onAddEntry={handleAddEntry}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          filters={filters}
          onFiltersChange={setFilters}
          filteredEntries={filteredEntries}
          profile={profile}
          onTogglePreference={handleTogglePreference}
          onUpdateProfile={handleUpdateProfile}
          scrollToTop={scrollToTop}
        />
      </AppLayout>
    </BrowserRouter>
  )
}

export default App
