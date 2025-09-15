import { moods } from '../utils/constants.js'
import {
  calculateAverageSentiment,
  calculateMediaBreakdown,
  calculateMoodBreakdown,
  calculateStreak,
  calculateTagFrequency,
  getLatestEntries
} from '../utils/analytics.js'
import { formatDate } from '../utils/formatters.js'
import MoodTrendChart from './MoodTrendChart.jsx'

const InsightsView = ({ entries }) => {
  const totalEntries = entries.length
  const averageSentiment = calculateAverageSentiment(entries)
  const moodBreakdown = calculateMoodBreakdown(entries)
  const topTags = calculateTagFrequency(entries)
  const mediaBreakdown = calculateMediaBreakdown(entries)
  const streak = calculateStreak(entries)
  const latestEntries = getLatestEntries(entries, 4)
  const totalWordCount = entries.reduce((sum, entry) => sum + (entry.metrics?.wordCount ?? 0), 0)
  const positiveEntries = entries.filter((entry) => entry.sentiment >= 0.7).length

  const moodLeaders = moodBreakdown.sorted.slice(0, 3)

  return (
    <div className="surface-grid">
      <section className="card" aria-label="Weekly summary">
        <div className="entry-header" style={{ marginBottom: '1.5rem' }}>
          <div>
            <p className="section-label" style={{ marginBottom: '0.35rem' }}>
              Personalized insights
            </p>
            <h2 style={{ margin: 0 }}>This week in your journal</h2>
          </div>
        </div>

        <div className="insight-grid">
          <div className="stat-tile">
            <span className="section-label" style={{ marginBottom: '0.25rem' }}>
              Entries captured
            </span>
            <span className="stat-value">{totalEntries}</span>
            <span className="stat-subtext">{positiveEntries} felt uplifting</span>
          </div>

          <div className="stat-tile">
            <span className="section-label" style={{ marginBottom: '0.25rem' }}>
              Mood streak
            </span>
            <span className="stat-value">{streak} days</span>
            <span className="stat-subtext">Keep the momentum going!</span>
          </div>

          <div className="stat-tile">
            <span className="section-label" style={{ marginBottom: '0.25rem' }}>
              Avg. sentiment
            </span>
            <span className="stat-value">{Math.round(averageSentiment * 100)}%</span>
            <span className="stat-subtext">Consistent positive tone</span>
          </div>

          <div className="stat-tile">
            <span className="section-label" style={{ marginBottom: '0.25rem' }}>
              Words written
            </span>
            <span className="stat-value">{totalWordCount}</span>
            <span className="stat-subtext">≈ {Math.max(1, Math.round(totalWordCount / 180))} min of reflection</span>
          </div>
        </div>

        <div className="divider" />

        <div className="mood-sentiment">
          <div>
            <span className="section-label">Sentiment & mood trend</span>
            <MoodTrendChart entries={entries} />
            <p className="mood-sentiment__copy">
              Your emotional tone has been steadily {averageSentiment >= 0.6 ? 'uplifting' : 'balanced'} this week. The companion keeps an eye on sudden dips and will nudge you when a reflective check-in could help.
            </p>
          </div>

          <div className="surface-grid">
            <div>
              <span className="section-label">Mood highlights</span>
              <div className="surface-grid">
                {moodLeaders.map(([mood, count]) => (
                  <div
                    key={mood}
                    className="summary-callout"
                    style={{ borderColor: `${moods[mood]?.accent ?? 'rgba(59,130,246,0.3)'}` }}
                  >
                    <strong>{mood}</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>{count} entries</span>
                    <div className="progress-bar">
                      <span style={{ width: totalEntries ? `${(count / totalEntries) * 100}%` : '0%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="section-label">Top tags</span>
              <div className="surface-grid">
                {topTags.map(([tag, count]) => (
                  <div key={tag} className="summary-callout">
                    <strong>#{tag}</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>{count} mentions</span>
                  </div>
                ))}
                {topTags.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>Tags will appear once you add entries.</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="divider" />

        <div className="surface-grid columns-3">
          <div className="summary-callout">
            <strong>Media mix</strong>
            <span style={{ color: 'var(--text-secondary)' }}>
              {mediaBreakdown.photos} photo entries · {mediaBreakdown.audio} audio · {mediaBreakdown.textOnly} text only
            </span>
          </div>
          <div className="summary-callout">
            <strong>Positive reflections</strong>
            <span style={{ color: 'var(--text-secondary)' }}>{positiveEntries} entries scored above 70%</span>
          </div>
          <div className="summary-callout">
            <strong>Story connections</strong>
            <span style={{ color: 'var(--text-secondary)' }}>
              {entries.filter((entry) => entry.connectedTo?.length).length} entries linked to others
            </span>
          </div>
        </div>
      </section>

      <section className="card" aria-label="Recent highlights timeline">
        <div className="entry-header" style={{ marginBottom: '1.5rem' }}>
          <div>
            <p className="section-label" style={{ marginBottom: '0.35rem' }}>
              Highlights timeline
            </p>
            <h2 style={{ margin: 0 }}>Recent story beats</h2>
          </div>
        </div>

        {latestEntries.length === 0 ? (
          <div className="empty-state">
            <strong>No recent entries yet</strong>
            Once you add a few moments you will see them highlighted here.
          </div>
        ) : (
          <div className="timeline">
            {latestEntries.map((entry) => (
              <div key={entry.id} className="timeline-item">
                <h4>{entry.title}</h4>
                <span>
                  {formatDate(entry.createdAt)} · {entry.mood}
                </span>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem' }}>{entry.summary ?? entry.content}</p>
              </div>
            ))}
          </div>
        )}

        <div className="personalised-summary">
          <span className="section-label">AI-crafted summary</span>
          <p>
            Your creativity and wellness themes kept resurfacing. The companion suggests planning another energising morning routine and packaging your museum sketches with the latest photo walk for a cohesive story arc.
          </p>
        </div>
      </section>
    </div>
  )
}

export default InsightsView
