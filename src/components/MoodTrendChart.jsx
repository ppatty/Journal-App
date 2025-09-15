import { useMemo } from 'react'
import { formatDate } from '../utils/formatters.js'

const moodToScore = {
  Joyful: 88,
  Inspired: 80,
  Thoughtful: 60,
  Curious: 72,
  Balanced: 65,
  Energized: 85,
  Motivated: 82,
  Creative: 86,
  Reflective: 58
}

const buildPath = (points, width, height) => {
  if (points.length === 0) return ''

  const step = width / Math.max(points.length - 1, 1)

  const coords = points.map((point, index) => {
    const x = index * step
    const y = height - (point * height) / 100
    return [x, y]
  })

  if (coords.length === 1) {
    const [x, y] = coords[0]
    return `M0 ${height} L${x} ${y} L${width} ${height} Z`
  }

  const path = coords.reduce((acc, [x, y], index, array) => {
    if (index === 0) {
      return `M${x},${y}`
    }

    const [prevX, prevY] = array[index - 1]
    const controlX = prevX + step / 2
    const controlY = (prevY + y) / 2
    return `${acc} Q${controlX},${prevY} ${x},${y}`
  }, '')

  return `${path} L${width},${height} L0,${height} Z`
}

const MoodTrendChart = ({ entries, limit = 10 }) => {
  const { values, labels } = useMemo(() => {
    const timeline = [...entries]
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(-limit)
    const scores = timeline.map((entry) => moodToScore[entry.mood] ?? Math.round((entry.sentiment ?? 0.5) * 100))
    const formattedLabels = timeline.map((entry) => formatDate(entry.createdAt))
    return { values: scores, labels: formattedLabels }
  }, [entries, limit])

  const width = 320
  const height = 160
  const path = buildPath(values, width, height)

  return (
    <div className="mood-trend" aria-label="Mood trend chart">
      <svg width="100%" height="160" viewBox={`0 0 ${width} ${height}`} role="img" aria-hidden={false}>
        <defs>
          <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.55)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.05)" />
          </linearGradient>
        </defs>
        <path d={path} fill="url(#moodGradient)" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="2" />
      </svg>
      <div className="mood-trend__labels">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  )
}

export default MoodTrendChart
