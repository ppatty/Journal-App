import { formatRelativeDay, formatSentiment, sentimentToEmoji } from '../utils/formatters.js'
import { moods } from '../utils/constants.js'

const typeIcons = {
  text: '📝',
  quote: '💬',
  photo: '📷',
  video: '🎬',
  audio: '🎧',
  summary: '🧾'
}

const AttachmentPreview = ({ entry }) => {
  if (entry.type === 'quote' && entry.quote) {
    return (
      <div className="quote-block">
        “{entry.quote.text}”
        <div style={{ marginTop: '0.6rem', fontSize: '0.85rem', color: 'rgba(226, 232, 240, 0.75)' }}>
          — {entry.quote.author}
        </div>
      </div>
    )
  }

  if (entry.attachments?.images?.length) {
    return (
      <div className="gallery-grid" aria-label={`${entry.attachments.images.length} related photos`}>
        {entry.attachments.images.slice(0, 4).map((url) => (
          <img key={url} src={url} alt="Related entry visual" loading="lazy" />
        ))}
      </div>
    )
  }

  if (entry.attachments?.videos?.length) {
    return (
      <div className="gallery-grid" aria-label={`${entry.attachments.videos.length} related videos`}>
        {entry.attachments.videos.slice(0, 1).map((url) => (
          <video key={url} src={url} muted loop playsInline preload="metadata" />
        ))}
      </div>
    )
  }

  if (entry.attachments?.audio) {
    return (
      <div className="audio-preview">
        <span role="img" aria-label="audio note" style={{ fontSize: '1.5rem' }}>
          🎙️
        </span>
        <audio controls src={entry.attachments.audio} aria-label="Voice note playback" />
      </div>
    )
  }

  return null
}

const EntryCard = ({ entry, isActive = false, onSelect }) => {
  const moodAccent = moods[entry.mood]?.accent ?? 'rgba(59, 130, 246, 0.9)'

  return (
    <article
      className={`entry-card${isActive ? ' active' : ''}`}
      onClick={() => onSelect?.(entry)}
      tabIndex={0}
      role="button"
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect?.(entry)
        }
      }}
      aria-pressed={isActive}
    >
      <header className="entry-header">
        <div>
          <p className="entry-title">
            <span style={{ marginRight: '0.6rem' }}>{typeIcons[entry.type] ?? '📝'}</span>
            {entry.title}
          </p>
          <div className="entry-meta">
            <span>{formatRelativeDay(entry.createdAt)}</span>
            <span>•</span>
            <span>
              <span role="img" aria-hidden="true">
                {sentimentToEmoji(entry.sentiment)}
              </span>{' '}
              {entry.mood}
            </span>
            {entry.location ? (
              <>
                <span>•</span>
                <span>{entry.location}</span>
              </>
            ) : null}
          </div>
        </div>
        <div className="entry-actions">
          {entry.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      </header>

      <p className="entry-preview">{entry.summary ?? entry.content}</p>

      <AttachmentPreview entry={entry} />

      <footer className="entry-meta" aria-label="Entry metrics">
        {entry.metrics?.wordCount ? <span>{entry.metrics.wordCount} words</span> : null}
        {entry.sentiment != null ? <span>{formatSentiment(entry.sentiment)}</span> : null}
        {entry.weather ? <span>{entry.weather}</span> : null}
        <span className="mood-pill" style={{ background: moodAccent }}>
          {entry.mood}
        </span>
      </footer>
    </article>
  )
}

export default EntryCard
