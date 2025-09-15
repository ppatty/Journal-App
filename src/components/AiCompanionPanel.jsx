import { formatRelativeDay } from '../utils/formatters.js'

const AiCompanionPanel = ({ entry, onStartNewEntry }) => {
  const fallback = {
    title: 'Capture a fresh reflection',
    aiFollowUp: 'What is one small win from today that you want to remember?',
    mood: 'Curious',
    createdAt: new Date().toISOString()
  }

  const activeEntry = entry ?? fallback

  const conversation = [
    {
      id: 'c1',
      role: 'assistant',
      content: `I noticed your entry "${activeEntry.title}" felt ${activeEntry.mood.toLowerCase()}. ${
        activeEntry.aiFollowUp || 'Would you like me to suggest a prompt?'
      }`
    },
    {
      id: 'c2',
      role: 'user',
      content: 'Yes, I want to go a little deeper into how the day unfolded.'
    },
    {
      id: 'c3',
      role: 'assistant',
      content:
        'What moment shifted your energy the most? I can set a reminder to revisit it or help draft a follow-up entry.'
    }
  ]

  const promptIdeas = [
    'Summarise today in three vivid sentences.',
    'Add a gratitude entry focused on relationships.',
    'Record a voice note while the details are fresh.'
  ]

  return (
    <section className="card compact" aria-label="AI companion follow-up">
      <p className="section-label">AI companion</p>
      <div className="companion-header">
        <div>
          <h3>{activeEntry.title}</h3>
          <span className="entry-meta">
            <span>{formatRelativeDay(activeEntry.createdAt)}</span>
            <span>•</span>
            <span>{activeEntry.mood}</span>
          </span>
        </div>
        <button type="button" className="button-secondary" onClick={onStartNewEntry}>
          ✨ Start follow-up
        </button>
      </div>

      <div className="companion-chat" role="log" aria-live="polite">
        {conversation.map((message) => (
          <div key={message.id} className={`companion-chat__bubble companion-chat__bubble--${message.role}`}>
            <span className="companion-chat__avatar" aria-hidden="true">
              {message.role === 'assistant' ? '🤖' : '🙂'}
            </span>
            <p>{message.content}</p>
          </div>
        ))}
      </div>

      <div className="companion-prompts">
        <span className="section-label">Suggested next steps</span>
        <div className="chip-list">
          {promptIdeas.map((prompt) => (
            <span key={prompt} className="tag strong">
              {prompt}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AiCompanionPanel
