import { formatDate } from '../utils/formatters.js'

const QuoteSpotlight = ({ quoteEntry, onOpenEntry, relatedEntries = [] }) => {
  if (!quoteEntry) {
    return (
      <section className="card compact" aria-label="Quote spotlight">
        <p className="section-label">Quote spotlight</p>
        <div className="empty-state" style={{ margin: 0 }}>
          <strong>No quotes yet</strong>
          Capture a quote entry to see it highlighted with its full context.
        </div>
      </section>
    )
  }

  return (
    <section className="card compact" aria-label="Quote spotlight">
      <p className="section-label">Quote spotlight</p>
      <blockquote className="quote-block" style={{ marginBottom: '1rem' }}>
        “{quoteEntry.quote?.text ?? quoteEntry.content}”
        <footer style={{ marginTop: '0.75rem', display: 'grid', gap: '0.25rem' }}>
          <span>— {quoteEntry.quote?.author ?? 'Unknown'}</span>
          {quoteEntry.quote?.context ? (
            <span style={{ color: 'var(--text-secondary)' }}>{quoteEntry.quote.context}</span>
          ) : null}
        </footer>
      </blockquote>

      <div className="quote-spotlight__meta">
        <span className="tag strong">Logged {formatDate(quoteEntry.createdAt)}</span>
        <span className="tag">Mood · {quoteEntry.mood}</span>
        <button type="button" className="inline-link" onClick={() => onOpenEntry?.(quoteEntry)}>
          Open full entry
        </button>
      </div>

      {relatedEntries.length ? (
        <div className="quote-spotlight__related">
          <span className="section-label">Related reflections</span>
          <ul>
            {relatedEntries.map((entry) => (
              <li key={entry.id}>
                <button type="button" onClick={() => onOpenEntry?.(entry)}>
                  <span className="tag">{formatDate(entry.createdAt)}</span>
                  <span>{entry.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}

export default QuoteSpotlight
