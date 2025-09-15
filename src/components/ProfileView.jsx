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

const ProfileView = ({ user, entries, onTogglePreference }) => {
  const streak = calculateStreak(entries)
  const lastEntry = [...entries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]

  return (
    <section className="card" aria-label="Profile and settings">
      <div className="entry-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            src={user.avatar}
            alt="Profile avatar"
            width="72"
            height="72"
            style={{ borderRadius: '50%', border: '2px solid rgba(148, 163, 184, 0.35)' }}
          />
          <div>
            <h2 style={{ margin: 0 }}>{user.name}</h2>
            <p style={{ margin: '0.35rem 0', color: 'var(--text-secondary)' }}>
              {user.role} · {user.location}
            </p>
            <div className="chip-list">
              <span className="tag strong">{streak}-day streak</span>
              <span className="tag">{entries.length} entries</span>
            </div>
          </div>
        </div>
        <span className="badge">Favorite tags: {user.favoriteTags.join(', ')}</span>
      </div>

      <div className="surface-grid columns-2">
        <div className="summary-callout">
          <strong>Last reflection</strong>
          {lastEntry ? (
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              {lastEntry.title} on {formatDate(lastEntry.createdAt)}
            </p>
          ) : (
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Add your first entry to start a streak.</p>
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
