import { useMemo } from 'react'
import EntryCard from './EntryCard.jsx'
import { entryTypes, moods } from '../utils/constants.js'

const moodEntries = Object.entries(moods)

const SearchAndFilter = ({
  entries,
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  onSelectEntry,
  selectedEntryId,
  availableTags
}) => {
  const toggleFilterValue = (field, value) => {
    const next = filters[field].includes(value)
      ? filters[field].filter((item) => item !== value)
      : [...filters[field], value]
    onFiltersChange({ ...filters, [field]: next })
  }

  const handleDateChange = (field, value) => {
    onFiltersChange({ ...filters, [field]: value })
  }

  const toggleHasMedia = () => {
    onFiltersChange({ ...filters, hasMedia: !filters.hasMedia })
  }

  const aiSuggestions = useMemo(() => {
    const suggestions = []

    if (!filters.types.includes('photo') && entries.some((entry) => entry.type === 'photo')) {
      suggestions.push({
        id: 'photos',
        label: 'Show photo memories',
        action: () => onFiltersChange({ ...filters, types: ['photo'] })
      })
    }

    if (!filters.moods.includes('Joyful') && entries.some((entry) => entry.mood === 'Joyful')) {
      suggestions.push({
        id: 'joyful',
        label: 'Find joyful entries',
        action: () => onFiltersChange({ ...filters, moods: ['Joyful'] })
      })
    }

    const firstTag = availableTags.find((tag) => !filters.tags.includes(tag))
    if (firstTag) {
      suggestions.push({
        id: 'tag',
        label: `Entries tagged #${firstTag}`,
        action: () => onFiltersChange({ ...filters, tags: [firstTag] })
      })
    }

    if (!filters.hasMedia && entries.some((entry) => entry.attachments?.audio || entry.attachments?.images?.length)) {
      suggestions.push({
        id: 'media',
        label: 'Entries with rich media',
        action: toggleHasMedia
      })
    }

    return suggestions.slice(0, 3)
  }, [availableTags, entries, filters, onFiltersChange, toggleHasMedia])

  return (
    <div className="card" aria-label="Search and filter entries">
      <div className="entry-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <p className="section-label" style={{ marginBottom: '0.35rem' }}>
            Search & filter
          </p>
          <h2 style={{ margin: 0 }}>Find the moments you need</h2>
        </div>
        <span className="badge">{entries.length} results</span>
      </div>

      <div className="surface-grid">
        <div className="search-bar">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by title, content, location, or tag"
          />
        </div>

        {aiSuggestions.length ? (
          <div className="ai-suggestion-panel">
            <span className="section-label">AI quick filters</span>
            <div className="chip-list">
              {aiSuggestions.map((suggestion) => (
                <button key={suggestion.id} type="button" className="filter-chip active" onClick={suggestion.action}>
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div>
          <span className="section-label">Entry type</span>
          <div className="chip-list">
            {entryTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                className={`filter-chip${filters.types.includes(type.value) ? ' active' : ''}`}
                onClick={() => toggleFilterValue('types', type.value)}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="section-label">Mood</span>
          <div className="chip-list">
            {moodEntries.map(([value, descriptor]) => (
              <button
                key={value}
                type="button"
                className={`filter-chip${filters.moods.includes(value) ? ' active' : ''}`}
                onClick={() => toggleFilterValue('moods', value)}
              >
                <span className="mood-pill" style={{ background: descriptor.accent }}>
                  {descriptor.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="section-label">Tags</span>
          <div className="chip-list">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`filter-chip${filters.tags.includes(tag) ? ' active' : ''}`}
                onClick={() => toggleFilterValue('tags', tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <div className="surface-grid columns-3">
          <label>
            <span className="section-label">From</span>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(event) => handleDateChange('dateFrom', event.target.value)}
            />
          </label>
          <label>
            <span className="section-label">To</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(event) => handleDateChange('dateTo', event.target.value)}
            />
          </label>
          <div>
            <span className="section-label">Media</span>
            <button
              type="button"
              className={`filter-chip${filters.hasMedia ? ' active' : ''}`}
              onClick={toggleHasMedia}
            >
              {filters.hasMedia ? 'Showing entries with media' : 'Include only entries with media'}
            </button>
          </div>
        </div>
      </div>

      <div className="divider" />

      {entries.length === 0 ? (
        <div className="empty-state">
          <strong>No results match these filters</strong>
          Try clearing some filters or adjusting the date range.
        </div>
      ) : (
        <div className="entry-list">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              isActive={selectedEntryId === entry.id}
              onSelect={onSelectEntry}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchAndFilter
