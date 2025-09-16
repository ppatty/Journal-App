import { formatDateTime } from '../utils/formatters.js'
import { moods } from '../utils/constants.js'

const EntryDetail = ({ entry }) => {
  if (!entry) {
    return (
      <div className="empty-state">
        <strong>Select an entry to view the full story</strong>
        Choose any card from the list to see its complete context, media, and smart suggestions.
      </div>
    )
  }

  const moodAccent = moods[entry.mood]?.accent ?? 'rgba(59, 130, 246, 0.9)'

  return (
    <section className="entry-detail" aria-labelledby={`entry-${entry.id}-heading`}>
      <header>
        <span className="badge">
          {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
        </span>
        <h2 id={`entry-${entry.id}-heading`}>{entry.title}</h2>
        <p className="entry-meta" style={{ marginBottom: '1rem' }}>
          <span>{formatDateTime(entry.createdAt)}</span>
          <span>•</span>
          <span className="mood-pill" style={{ background: moodAccent }}>
            {entry.mood}
          </span>
        </p>
      </header>

      {entry.quote ? (
        <blockquote className="quote-block" style={{ marginBottom: '1.25rem' }}>
          “{entry.quote.text}”
          <footer style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span>— {entry.quote.author}</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{entry.quote.context}</span>
          </footer>
        </blockquote>
      ) : null}

      <p>{entry.content}</p>

      {entry.attachments?.images?.length ? (
        <div style={{ marginTop: '1.5rem' }}>
          <p className="section-label">Media</p>
          <div className="gallery-grid">
            {entry.attachments.images.map((url) => (
              <img key={url} src={url} alt="Entry visual" loading="lazy" />
            ))}
          </div>
        </div>
      ) : null}

      {entry.attachments?.videos?.length ? (
        <div style={{ marginTop: '1.5rem' }}>
          <p className="section-label">Video</p>
          <div className="gallery-grid">
            {entry.attachments.videos.map((url) => (
              <video key={url} src={url} controls preload="metadata" />
            ))}
          </div>
        </div>
      ) : null}

      {entry.attachments?.audio ? (
        <div style={{ marginTop: '1.5rem' }}>
          <p className="section-label">Voice Note</p>
          <div className="audio-preview">
            <span role="img" aria-label="audio note" style={{ fontSize: '1.5rem' }}>
              🎙️
            </span>
            <audio controls src={entry.attachments.audio} aria-label="Voice note playback" />
          </div>
        </div>
      ) : null}

      <footer>
        {entry.tags?.map((tag) => (
          <span key={tag} className="tag strong">
            #{tag}
          </span>
        ))}
        {entry.location ? <span className="tag">📍 {entry.location}</span> : null}
        {entry.weather ? <span className="tag">☁️ {entry.weather}</span> : null}
        {entry.metrics?.wordCount ? <span className="tag">{entry.metrics.wordCount} words</span> : null}
      </footer>

      {entry.aiFollowUp ? (
        <div className="summary-callout" style={{ marginTop: '1.5rem' }}>
          <span className="section-label" style={{ marginBottom: '0.3rem' }}>
            Companion follow-up
          </span>
          <strong>{entry.aiFollowUp}</strong>
          <p style={{ color: 'var(--text-secondary)' }}>
            Turn this into a reminder, add it to your plan, or start a new entry using the prompt.
          </p>
        </div>
      ) : null}
    </section>
  )
}

export default EntryDetail
