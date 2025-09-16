import { formatRelativeDay } from '../utils/formatters.js'

const MediaGalleryPanel = ({ items, onSelectEntry }) => {
  if (!items.length) {
    return null
  }

  return (
    <section className="card compact" aria-label="Media gallery">
      <p className="section-label">Media gallery</p>
      <div className="photo-gallery">
        {items.map((item) => (
          <button
            key={`${item.type}-${item.url}`}
            type="button"
            className="photo-gallery__item"
            onClick={() => onSelectEntry?.(item.entry)}
          >
            {item.type === 'video' ? (
              <video
                src={item.url}
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={`Linked video for ${item.entry.title}`}
              />
            ) : (
              <img src={item.url} alt={`Linked to ${item.entry.title}`} loading="lazy" />
            )}
            <span className="photo-gallery__overlay">
              <strong>{item.entry.title}</strong>
              <span>
                {formatRelativeDay(item.entry.createdAt)} · {item.entry.mood}
              </span>
            </span>
          </button>
        ))}
      </div>
      <p className="photo-gallery__hint">
        Tap any thumbnail to jump to the full journal entry and continue the story.
      </p>
    </section>
  )
}

export default MediaGalleryPanel
