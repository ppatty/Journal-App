const shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const formatDate = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return isoString
  const month = shortMonthNames[date.getMonth()]
  const day = String(date.getDate()).padStart(2, '0')
  return `${month} ${day}`
}

export const formatDateTime = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return isoString
  return `${formatDate(isoString)} · ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
}

export const formatRelativeDay = (isoString) => {
  if (!isoString) return ''
  const target = new Date(isoString)
  const today = new Date()
  const diffMs = today.setHours(0, 0, 0, 0) - target.setHours(0, 0, 0, 0)
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return formatDate(isoString)
}

export const sentimentToEmoji = (score) => {
  if (score >= 0.75) return '😄'
  if (score >= 0.5) return '🙂'
  if (score >= 0.25) return '😐'
  if (score > 0) return '☁️'
  return '🌧️'
}

export const formatSentiment = (score) => {
  if (typeof score !== 'number') return '—'
  const rounded = Math.round(score * 100)
  return `${rounded}% positive`
}
