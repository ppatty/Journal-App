import { formatRelativeDay } from '../utils/formatters.js'

const PhotoGalleryPanel = ({ entries, onSelectEntry }) => {
  if (!entries.length) {
    return null
  }

  return (
    <section className="card compact" aria-label="Photo gallery">
      <p className="section-label">Photo gallery</p>
      <div className="photo-gallery">
        {entries.map((item) => (
          <button
            key={item.url}
            type="button"
            className="photo-gallery__item"
            onClick={() => onSelectEntry?.(item.entry)}
          >
            <img src={item.url} alt={`Linked to ${item.entry.title}`} loading="lazy" />
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
        Tap a photo to jump to the full journal entry and continue the story.
      </p>
    </section>
  )
}

export default PhotoGalleryPanel
