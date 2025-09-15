export const calculateStreak = (entries) => {
  if (!entries.length) return 0
  const dates = Array.from(
    new Set(
      entries.map((entry) => {
        const date = new Date(entry.createdAt)
        date.setHours(0, 0, 0, 0)
        return date.getTime()
      })
    )
  )
    .sort((a, b) => b - a)
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let expected = today.getTime()

  for (const dateValue of dates) {
    if (dateValue === expected) {
      streak += 1
      expected -= 1000 * 60 * 60 * 24
    } else if (dateValue < expected) {
      break
    }
  }

  return streak
}

export const calculateAverageSentiment = (entries) => {
  if (!entries.length) return 0
  const sum = entries.reduce((acc, entry) => acc + (entry.sentiment ?? 0), 0)
  return Number((sum / entries.length).toFixed(2))
}

export const calculateMoodBreakdown = (entries) => {
  const totals = entries.reduce((acc, entry) => {
    const mood = entry.mood ?? 'Unknown'
    acc[mood] = (acc[mood] ?? 0) + 1
    return acc
  }, {})
  const sorted = Object.entries(totals).sort(([, a], [, b]) => b - a)
  return { totals, sorted }
}

export const calculateTagFrequency = (entries, top = 6) => {
  const counts = entries.reduce((acc, entry) => {
    entry.tags?.forEach((tag) => {
      acc[tag] = (acc[tag] ?? 0) + 1
    })
    return acc
  }, {})
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, top)
}

export const calculateMediaBreakdown = (entries) => {
  return entries.reduce(
    (acc, entry) => {
      const hasImages = Boolean(entry.attachments?.images?.length)
      const hasAudio = Boolean(entry.attachments?.audio)
      if (hasImages) acc.photos += 1
      if (hasAudio) acc.audio += 1
      if (!hasImages && !hasAudio) acc.textOnly += 1
      return acc
    },
    { photos: 0, audio: 0, textOnly: 0 }
  )
}

export const getLatestEntries = (entries, limit = 4) =>
  [...entries]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit)
