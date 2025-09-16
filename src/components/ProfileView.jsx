import { useEffect, useMemo, useRef, useState } from 'react'
import { calculateStreak } from '../utils/analytics.js'
import { formatDate } from '../utils/formatters.js'

const preferencesCopy = {
  aiSuggestions: {
    title: 'AI Companion prompts',
    description: 'Receive contextual questions and follow-up reflections after each entry.'
  },
  dailyReminders: {
    title: 'Daily reminder',
    description: 'A gentle nudge to capture a moment or mood check-in every evening.'
  },
  weeklySummary: {
    title: 'Weekly digest',
    description: 'A curated recap with trends, wins, and suggestions delivered every Sunday.'
  },
  voiceToText: {
    title: 'Voice-to-text capture',
    description: 'Keep the microphone widget visible for one-tap recording on mobile.'
  }
}

const privacyControls = [
  {
    id: 'lock',
    title: 'Entry lock',
    description: 'Require Face ID or a passcode to open the app on this device.'
  },
  {
    id: 'mask',
    title: 'Blur sensitive content',
    description: 'Hide preview text in notifications until you authenticate.'
  },
  {
    id: 'export',
    title: 'Auto-export',
    description: 'Send a weekly encrypted backup to your cloud storage.'
  }
]

const companionModes = [
  {
    id: 'reflective',
    title: 'Reflective',
    description: 'Gentle prompts that encourage slowing down and noticing the details.'
  },
  {
    id: 'celebratory',
    title: 'Celebratory',
    description: 'Energy-boosting notes that spotlight wins and gratitude.'
  },
  {
    id: 'direct',
    title: 'Direct',
    description: 'Action-oriented nudges that help you close loops quickly.'
  }
]

const buildFormState = (user) => ({
  name: user.name ?? '',
  role: user.role ?? '',
  location: user.location ?? '',
  pronouns: user.pronouns ?? '',
  avatar: user.avatar ?? '',
  bio: user.bio ?? '',
  favoriteTags: [...(user.favoriteTags ?? [])],
  contact: {
    email: user.contact?.email ?? '',
    phone: user.contact?.phone ?? '',
    website: user.contact?.website ?? ''
  },
  birthday: user.birthday ?? '',
  timezone: user.timezone ?? ''
})

const ProfileView = ({ user, entries, onTogglePreference, onUpdateProfile }) => {
  const [formState, setFormState] = useState(() => buildFormState(user))
  const [newTag, setNewTag] = useState('')
  const [status, setStatus] = useState(null)
  const saveTimeoutRef = useRef(null)

  useEffect(() => {
    setFormState(buildFormState(user))
    setStatus(null)
  }, [user])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current && typeof window !== 'undefined') {
        window.clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const streak = useMemo(() => calculateStreak(entries), [entries])
  const lastEntry = useMemo(() => {
    if (!entries.length) return null
    return [...entries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
  }, [entries])

  const handleChange = (field, value) => {
    setFormState((current) => ({ ...current, [field]: value }))
  }

  const handleContactChange = (field, value) => {
    setFormState((current) => ({
      ...current,
      contact: { ...current.contact, [field]: value }
    }))
  }

  const handleAddTag = () => {
    const cleaned = newTag.trim()
    if (!cleaned) return
    setFormState((current) => {
      if (current.favoriteTags.includes(cleaned)) {
        return current
      }
      return { ...current, favoriteTags: [...current.favoriteTags, cleaned] }
    })
    setNewTag('')
  }

  const handleRemoveTag = (tag) => {
    setFormState((current) => ({
      ...current,
      favoriteTags: current.favoriteTags.filter((existing) => existing !== tag)
    }))
  }

  const handleTagKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const favoriteTags = Array.from(
      new Set(formState.favoriteTags.map((tag) => tag.trim()).filter(Boolean))
    )

    onUpdateProfile({
      name: formState.name.trim(),
      role: formState.role.trim(),
      location: formState.location.trim(),
      pronouns: formState.pronouns.trim(),
      avatar: formState.avatar.trim(),
      bio: formState.bio.trim(),
      favoriteTags,
      contact: {
        email: formState.contact.email.trim(),
        phone: formState.contact.phone.trim(),
        website: formState.contact.website.trim()
      },
      birthday: formState.birthday,
      timezone: formState.timezone.trim()
    })

    setStatus('saved')
    if (typeof window !== 'undefined') {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current)
      }
      saveTimeoutRef.current = window.setTimeout(() => setStatus(null), 3000)
    }
  }

  const avatarPreview = formState.avatar || user.avatar
  const favoriteTagSummary = formState.favoriteTags.length
    ? formState.favoriteTags.join(', ')
    : 'Add your favourite themes to personalise suggestions.'

  return (
    <section className="card" aria-label="Profile and settings">
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="entry-header" style={{ marginBottom: '1.5rem', alignItems: 'stretch' }}>
          <div className="profile-form__header">
            <div className="profile-form__avatar">
              <img
                src={avatarPreview}
                alt="Profile avatar"
                width="96"
                height="96"
                style={{ borderRadius: '50%', border: '2px solid rgba(148, 163, 184, 0.35)' }}
              />
              <label>
                <span className="section-label">Avatar URL</span>
                <input
                  type="url"
                  value={formState.avatar}
                  onChange={(event) => handleChange('avatar', event.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
              </label>
            </div>
            <div className="surface-grid columns-2 profile-form__identity">
              <label>
                <span className="section-label">Full name</span>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  placeholder="How should we address you?"
                  required
                />
              </label>
              <label>
                <span className="section-label">Pronouns</span>
                <input
                  type="text"
                  value={formState.pronouns}
                  onChange={(event) => handleChange('pronouns', event.target.value)}
                  placeholder="e.g. they/them"
                />
              </label>
              <label>
                <span className="section-label">Role</span>
                <input
                  type="text"
                  value={formState.role}
                  onChange={(event) => handleChange('role', event.target.value)}
                  placeholder="What do you do?"
                />
              </label>
              <label>
                <span className="section-label">Location</span>
                <input
                  type="text"
                  value={formState.location}
                  onChange={(event) => handleChange('location', event.target.value)}
                  placeholder="Where are you journaling from?"
                />
              </label>
            </div>
          </div>
          <div className="profile-form__summary">
            <div className="chip-list">
              <span className="tag strong">{streak}-day streak</span>
              <span className="tag">{entries.length} entries</span>
            </div>
            <span className="badge">Favorite tags: {favoriteTagSummary}</span>
          </div>
        </div>

        <div className="surface-grid columns-2">
          <label>
            <span className="section-label">Birthday</span>
            <input
              type="date"
              value={formState.birthday}
              onChange={(event) => handleChange('birthday', event.target.value)}
            />
          </label>
          <label>
            <span className="section-label">Timezone</span>
            <input
              type="text"
              value={formState.timezone}
              onChange={(event) => handleChange('timezone', event.target.value)}
              placeholder="e.g. America/New_York"
            />
          </label>
        </div>

        <div className="surface-grid columns-3">
          <label>
            <span className="section-label">Email</span>
            <input
              type="email"
              value={formState.contact.email}
              onChange={(event) => handleContactChange('email', event.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <label>
            <span className="section-label">Phone</span>
            <input
              type="tel"
              value={formState.contact.phone}
              onChange={(event) => handleContactChange('phone', event.target.value)}
              placeholder="Optional contact number"
            />
          </label>
          <label>
            <span className="section-label">Website</span>
            <input
              type="url"
              value={formState.contact.website}
              onChange={(event) => handleContactChange('website', event.target.value)}
              placeholder="https://your-site.com"
            />
          </label>
        </div>

        <label>
          <span className="section-label">Bio</span>
          <textarea
            value={formState.bio}
            onChange={(event) => handleChange('bio', event.target.value)}
            placeholder="Share a short note about you and what you are reflecting on."
          />
        </label>

        <div className="favorite-tags-editor">
          <span className="section-label">Favorite tags</span>
          <div className="chip-list">
            {formState.favoriteTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className="filter-chip active"
                onClick={() => handleRemoveTag(tag)}
              >
                #{tag} ✖
              </button>
            ))}
            {formState.favoriteTags.length === 0 ? (
              <span style={{ color: 'var(--text-secondary)' }}>
                No tags yet — add a few that describe your interests.
              </span>
            ) : null}
          </div>
          <div className="favorite-tags-editor__input">
            <input
              type="text"
              value={newTag}
              onChange={(event) => setNewTag(event.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add a tag and press enter"
            />
            <button type="button" className="button-secondary" onClick={handleAddTag}>
              ➕ Add tag
            </button>
          </div>
        </div>

        <div className="profile-form__actions">
          <button className="button-primary" type="submit">
            💾 Save profile
          </button>
          {status === 'saved' ? (
            <span className="profile-form__status">Profile updated</span>
          ) : null}
        </div>
      </form>

      <div className="surface-grid columns-2">
        <div className="summary-callout">
          <strong>Last reflection</strong>
          {lastEntry ? (
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              {lastEntry.title} on {formatDate(lastEntry.createdAt)}
            </p>
          ) : (
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              Add your first entry to start a streak.
            </p>
          )}
        </div>
        <div className="summary-callout">
          <strong>Focus areas</strong>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            You have been leaning into creativity and wellness lately.
          </p>
        </div>
      </div>

      <div className="divider" />

      <div>
        <span className="section-label">Preferences</span>
        <div className="preference-list">
          {Object.entries(preferencesCopy).map(([key, copy]) => (
            <div key={key} className="preference-item">
              <div>
                <strong>{copy.title}</strong>
                <p style={{ margin: '0.35rem 0 0', color: 'var(--text-secondary)' }}>{copy.description}</p>
              </div>
              <label className={`toggle${user.preferences[key] ? ' active' : ''}`}>
                <input
                  type="checkbox"
                  checked={Boolean(user.preferences[key])}
                  onChange={() => onTogglePreference(key)}
                />
                <span />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      <div className="surface-grid columns-2">
        <div className="summary-callout">
          <strong>Privacy controls</strong>
          <ul className="profile-list">
            {privacyControls.map((control) => (
              <li key={control.id}>
                <span className="tag">{control.title}</span>
                <p>{control.description}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="summary-callout">
          <strong>Companion mode</strong>
          <p style={{ margin: '0 0 0.5rem', color: 'var(--text-secondary)' }}>
            You are currently using the <strong>Reflective</strong> tone. Explore other modes to match your energy.
          </p>
          <div className="profile-mode-grid">
            {companionModes.map((mode) => (
              <span key={mode.id} className="profile-mode-card">
                <strong>{mode.title}</strong>
                <span>{mode.description}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="surface-grid columns-2" style={{ marginTop: '1.5rem' }}>
        <div className="summary-callout">
          <strong>Backup cadence</strong>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            Encrypted backups run hourly and sync to your private drive overnight.
          </p>
        </div>
        <div className="summary-callout">
          <strong>Notification schedule</strong>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            Evening reflection at 8:00 PM · Weekly highlight on Sundays · Smart nudges based on mood dips.
          </p>
        </div>
      </div>
    </section>
  )
}

export default ProfileView
