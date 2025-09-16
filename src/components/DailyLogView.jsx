import { useMemo } from 'react'
import EntryCard from './EntryCard.jsx'
import EntryDetail from './EntryDetail.jsx'
import AiCompanionPanel from './AiCompanionPanel.jsx'
import QuoteSpotlight from './QuoteSpotlight.jsx'
import MediaGalleryPanel from './MediaGalleryPanel.jsx'
import { formatDate, formatRelativeDay } from '../utils/formatters.js'

const DailyLogView = ({
  entries,
  selectedEntry,
  onSelectEntry,
  onStartNewEntry,
  reminders,
  onOpenSearch
}) => {
  const galleryItems = useMemo(
    () =>
      entries
        .flatMap((entry) => {
          const images = (entry.attachments?.images ?? []).map((url) => ({ url, entry, type: 'image' }))
          const videos = (entry.attachments?.videos ?? []).map((url) => ({ url, entry, type: 'video' }))
          return [...images, ...videos]
        })
        .slice(0, 8),
    [entries]
  )

  const relatedEntries = useMemo(
    () =>
      selectedEntry?.connectedTo
        ?.map((id) => entries.find((entry) => entry.id === id))
        .filter(Boolean) ?? [],
    [entries, selectedEntry]
  )

  const quoteEntry = useMemo(
    () => entries.find((entry) => entry.type === 'quote'),
    [entries]
  )

  const quoteConnections = useMemo(() => {
    if (!quoteEntry?.connectedTo?.length) return []
    return quoteEntry.connectedTo
      .map((id) => entries.find((entry) => entry.id === id))
      .filter(Boolean)
  }, [entries, quoteEntry])

  return (
    <div className="daily-main">
      <section className="card" aria-label="Companion summary and quick actions">
        <div className="companion-summary">
          <div>
            <p className="section-label">Daily companion</p>
            <h1>Welcome back, Avery 👋</h1>
            <p className="companion-summary__copy">
              {selectedEntry?.aiFollowUp ??
                'Capture a highlight from today or reflect on one of your recent moments. Your AI companion is ready with prompts, summaries, and reminders when you are.'}
            </p>
            <div className="companion-summary__hints">
              <span className="voice-hint">🎙️ Voice-to-text is ready for quick capture</span>
              <span className="voice-hint">🤖 Ask follow-up questions about any entry</span>
            </div>
          </div>
          <div className="companion-summary__actions">
            <button className="button-secondary" type="button" onClick={onOpenSearch}>
              🔍 Search & filter
            </button>
            <button className="button-primary" type="button" onClick={onStartNewEntry}>
              ✨ New entry
            </button>
          </div>
        </div>
      </section>

      <div className={`daily-layout${entries.length < 3 ? ' narrow' : ''}`}>
        <div className="daily-main">
          <section className="card" aria-label="Recent entries">
            <div className="entry-header" style={{ marginBottom: '1.25rem' }}>
              <div>
                <p className="section-label" style={{ marginBottom: '0.35rem' }}>
                  Daily log
                </p>
                <h2 style={{ margin: 0 }}>Recent entries</h2>
              </div>
              <div className="entry-meta">
                <span>{entries.length} saved moments</span>
              </div>
            </div>

            {entries.length === 0 ? (
              <div className="empty-state">
                <strong>No entries yet</strong>
                Start by logging a new moment. You can attach audio, images, or quotes and they will sync across the app.
              </div>
            ) : (
              <div className="entry-list">
                {entries.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    isActive={selectedEntry?.id === entry.id}
                    onSelect={onSelectEntry}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="daily-side" aria-label="Entry detail and companion insights">
          <EntryDetail entry={selectedEntry} />

          <AiCompanionPanel entry={selectedEntry} onStartNewEntry={onStartNewEntry} />

          {reminders?.length ? (
            <section className="card compact" aria-label="Smart reminders">
              <p className="section-label">Context-aware reminders</p>
              <div className="connection-list">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className="reminder-card">
                    <strong>{reminder.title}</strong>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{reminder.trigger}</span>
                    <span className="tag">Due {formatDate(reminder.dueAt)}</span>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{reminder.suggestedAction}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {relatedEntries.length ? (
            <section className="card compact" aria-label="Connected moments">
              <p className="section-label">Cross-referenced moments</p>
              <div className="connection-list">
                {relatedEntries.map((entry) => (
                  <div key={entry.id} className="connection-card">
                    <h4>{entry.title}</h4>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {formatRelativeDay(entry.createdAt)} · {entry.mood}
                    </span>
                    <div className="chip-list" style={{ marginTop: '0.5rem' }}>
                      {entry.tags?.map((tag) => (
                        <span key={tag} className="tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <QuoteSpotlight quoteEntry={quoteEntry} relatedEntries={quoteConnections} onOpenEntry={onSelectEntry} />

          <MediaGalleryPanel items={galleryItems} onSelectEntry={onSelectEntry} />
        </aside>
      </div>
    </div>
  )
}

export default DailyLogView
