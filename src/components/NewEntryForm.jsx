import { useMemo, useState } from 'react'
import { defaultTags, entryTypes, moods } from '../utils/constants.js'

const moodKeys = Object.keys(moods)
const suggestedFollowUps = {
  text: 'What made this moment stand out today?',
  quote: 'How does this quote connect to something you are working on?',
  photo: 'What story does this image capture?',
  video: 'What does this video help you remember when you watch it again?',
  audio: 'What do you want future-you to remember from this note?',
  summary: 'What trend did you notice while looking back?'
}

const defaultSentimentByMood = {
  Joyful: 80,
  Inspired: 75,
  Thoughtful: 55,
  Curious: 60,
  Balanced: 50,
  Energized: 78,
  Motivated: 70,
  Creative: 72,
  Reflective: 58
}

const keywordTagMap = [
  { tags: ['Wellness', 'Personal'], keywords: ['run', 'yoga', 'wellness', 'health', 'meditation'] },
  { tags: ['Work', 'Ideas'], keywords: ['meeting', 'sprint', 'onboarding', 'research', 'pitch'] },
  { tags: ['Creativity', 'Photography'], keywords: ['sketch', 'design', 'photo', 'gallery', 'art'] },
  { tags: ['Family', 'Personal'], keywords: ['family', 'kids', 'parent', 'picnic'] },
  { tags: ['Travel'], keywords: ['travel', 'trip', 'museum', 'walk'] },
  { tags: ['Food'], keywords: ['cook', 'recipe', 'dinner', 'curry'] },
  { tags: ['Video', 'Creativity'], keywords: ['video', 'film', 'recording', 'clip', 'reel'] }
]

const entityStopWords = new Set(['The', 'And', 'Your', 'Today', 'Yesterday', 'Entry'])

const sanitizeUrls = (urls) =>
  urls
    .map((url) => url.trim())
    .filter((url, index, array) => url.length > 0 && array.indexOf(url) === index)

const initialFormState = (tagPool) => ({
  title: '',
  type: 'text',
  mood: 'Joyful',
  sentiment: defaultSentimentByMood.Joyful,
  tags: tagPool.slice(0, 2),
  content: '',
  quoteText: '',
  quoteAuthor: '',
  quoteContext: '',
  imageUrls: [''],
  videoUrls: [''],
  audioUrl: '',
  location: '',
  weather: '',
  aiFollowUp: '',
  date: new Date().toISOString().slice(0, 10)
})

const NewEntryForm = ({ onSave, availableTags = defaultTags }) => {
  const tagPool = useMemo(() => Array.from(new Set([...defaultTags, ...availableTags])), [availableTags])
  const [formData, setFormData] = useState(() => initialFormState(tagPool))
  const [customTag, setCustomTag] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [transcriptSegments, setTranscriptSegments] = useState([])
  const [imageUploads, setImageUploads] = useState([])
  const [videoUploads, setVideoUploads] = useState([])
  const [audioUpload, setAudioUpload] = useState(null)

  const tagSuggestions = useMemo(() => {
    const haystack = `${formData.title} ${formData.content} ${formData.quoteText}`.toLowerCase()
    const suggestions = new Set()

    keywordTagMap.forEach(({ tags, keywords }) => {
      if (keywords.some((keyword) => haystack.includes(keyword))) {
        tags.forEach((tag) => suggestions.add(tag))
      }
    })

    if (formData.type === 'audio') {
      suggestions.add('VoiceNote')
    }

    return Array.from(suggestions)
      .filter((tag) => !formData.tags.includes(tag))
      .slice(0, 5)
  }, [formData.content, formData.quoteText, formData.tags, formData.title, formData.type])

  const nlpEntities = useMemo(() => {
    const matches = formData.content.match(/\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\b/g) ?? []
    const unique = Array.from(new Set(matches)).filter((entity) => !entityStopWords.has(entity))
    return unique.slice(0, 6)
  }, [formData.content])

  const handleFieldChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  const toggleTag = (tag) => {
    setFormData((current) => {
      const exists = current.tags.includes(tag)
      return {
        ...current,
        tags: exists ? current.tags.filter((existing) => existing !== tag) : [...current.tags, tag]
      }
    })
  }

  const readFilesAsDataUrls = async (files, kind) => {
    const selections = Array.from(files ?? [])
    if (!selections.length) return []

    return Promise.all(
      selections.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () =>
              resolve({
                id: `${kind}-${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
                name: file.name,
                dataUrl: reader.result,
                kind
              })
            reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`))
            reader.readAsDataURL(file)
          })
      )
    )
  }

  const updateImageUrl = (index, value) => {
    setFormData((current) => {
      const next = [...current.imageUrls]
      next[index] = value
      return { ...current, imageUrls: next }
    })
  }

  const addImageField = () => {
    setFormData((current) => ({ ...current, imageUrls: [...current.imageUrls, ''] }))
  }

  const removeImageField = (index) => {
    setFormData((current) => ({
      ...current,
      imageUrls: current.imageUrls.filter((_, position) => position !== index)
    }))
  }

  const updateVideoUrl = (index, value) => {
    setFormData((current) => {
      const next = [...current.videoUrls]
      next[index] = value
      return { ...current, videoUrls: next }
    })
  }

  const addVideoField = () => {
    setFormData((current) => ({ ...current, videoUrls: [...current.videoUrls, ''] }))
  }

  const removeVideoField = (index) => {
    setFormData((current) => ({
      ...current,
      videoUrls: current.videoUrls.filter((_, position) => position !== index)
    }))
  }

  const handleImageUpload = async (event) => {
    try {
      const uploads = await readFilesAsDataUrls(event.target.files, 'image')
      if (uploads.length) {
        setImageUploads((current) => [...current, ...uploads])
      }
    } catch (error) {
      console.error(error)
      alert('There was an issue processing the selected images. Please try again.')
    } finally {
      if (event.target?.value) {
        event.target.value = ''
      }
    }
  }

  const handleVideoUpload = async (event) => {
    try {
      const uploads = await readFilesAsDataUrls(event.target.files, 'video')
      if (uploads.length) {
        setVideoUploads((current) => [...current, ...uploads])
      }
    } catch (error) {
      console.error(error)
      alert('There was an issue processing the selected videos. Please try again.')
    } finally {
      if (event.target?.value) {
        event.target.value = ''
      }
    }
  }

  const handleAudioUpload = async (event) => {
    try {
      const uploads = await readFilesAsDataUrls(event.target.files, 'audio')
      if (uploads.length) {
        setAudioUpload(uploads[0])
        handleFieldChange('audioUrl', '')
      }
    } catch (error) {
      console.error(error)
      alert('There was an issue processing the audio file. Please try again.')
    } finally {
      if (event.target?.value) {
        event.target.value = ''
      }
    }
  }

  const removeImageUpload = (id) => {
    setImageUploads((current) => current.filter((item) => item.id !== id))
  }

  const removeVideoUpload = (id) => {
    setVideoUploads((current) => current.filter((item) => item.id !== id))
  }

  const clearAudioUpload = () => {
    setAudioUpload(null)
  }

  const handleAddCustomTag = () => {
    const cleaned = customTag.trim()
    if (!cleaned) return
    toggleTag(cleaned)
    setCustomTag('')
  }

  const simulateVoiceCapture = () => {
    setIsRecording(true)
    window.setTimeout(() => {
      setFormData((current) => ({
        ...current,
        content:
          current.content.length > 0
            ? `${current.content}\nCaptured via voice: Noticed how energised I felt after sharing this story.`
            : 'Captured via voice: Noticed how energised I felt after sharing this story.'
      }))
      setTranscriptSegments((current) => [
        ...current,
        {
          id: `${Date.now()}`,
          text: 'Noticed how energised I felt after sharing this story.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
      setIsRecording(false)
    }, 1200)
  }

  const resetForm = () => {
    setFormData(initialFormState(tagPool))
    setCustomTag('')
    setIsRecording(false)
    setTranscriptSegments([])
    setImageUploads([])
    setVideoUploads([])
    setAudioUpload(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!formData.title.trim()) {
      alert('Please add a title before saving the entry.')
      return
    }

    const normalizedSentiment = Math.max(0, Math.min(100, Number(formData.sentiment))) / 100
    const wordCount = formData.content.trim().split(/\s+/).filter(Boolean).length
    const now = new Date()
    const timestamp = formData.date ? new Date(`${formData.date}T${now.toTimeString().slice(0, 8)}`) : now

    const manualImages = sanitizeUrls(formData.imageUrls)
    const manualVideos = sanitizeUrls(formData.videoUrls)
    const uploadedImages = imageUploads.map((upload) => upload.dataUrl).filter(Boolean)
    const uploadedVideos = videoUploads.map((upload) => upload.dataUrl).filter(Boolean)
    const images = Array.from(new Set([...manualImages, ...uploadedImages]))
    const videos = Array.from(new Set([...manualVideos, ...uploadedVideos]))
    const manualAudio = formData.audioUrl.trim()
    const audioSource = audioUpload?.dataUrl ?? (manualAudio.length ? manualAudio : null)

    const baseEntry = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      title: formData.title.trim(),
      type: formData.type,
      createdAt: timestamp.toISOString(),
      mood: formData.mood,
      sentiment: Number(normalizedSentiment.toFixed(2)),
      tags: formData.tags,
      summary: formData.content.slice(0, 160),
      content: formData.content.trim(),
      aiFollowUp: formData.aiFollowUp.trim() || suggestedFollowUps[formData.type],
      attachments: {
        images,
        videos,
        audio: audioSource
      },
      location: formData.location.trim() || undefined,
      weather: formData.weather.trim() || undefined,
      metrics: {
        wordCount,
        readingTime: `${Math.max(1, Math.round(wordCount / 180))} min`
      }
    }

    if (formData.type === 'quote') {
      baseEntry.quote = {
        text: formData.quoteText.trim(),
        author: formData.quoteAuthor.trim() || 'Unknown',
        context: formData.quoteContext.trim()
      }
    }

    onSave(baseEntry)
    resetForm()
  }

  const handleTypeChange = (value) => {
    handleFieldChange('type', value)
    if (formData.aiFollowUp.length === 0) {
      handleFieldChange('aiFollowUp', suggestedFollowUps[value])
    }
  }

  const handleMoodChange = (value) => {
    handleFieldChange('mood', value)
    handleFieldChange('sentiment', defaultSentimentByMood[value] ?? 60)
  }

  return (
    <form className="card" onSubmit={handleSubmit} aria-label="Create a new journal entry">
      <div className="entry-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <p className="section-label" style={{ marginBottom: '0.35rem' }}>
            New entry
          </p>
          <h2 style={{ margin: 0 }}>Capture a moment</h2>
          <p style={{ marginTop: '0.35rem', color: 'var(--text-secondary)' }}>
            Add text, quotes, audio, or media. Your companion will surface connections automatically.
          </p>
        </div>
        <button className="button-primary" type="submit">
          💾 Save entry
        </button>
      </div>

      <div className="surface-grid">
        <div className="surface-grid columns-2">
          <label>
            <span className="section-label">Title</span>
            <input
              type="text"
              value={formData.title}
              onChange={(event) => handleFieldChange('title', event.target.value)}
              placeholder="Give your entry a descriptive title"
              required
            />
          </label>

          <label>
            <span className="section-label">Date</span>
            <input
              type="date"
              value={formData.date}
              onChange={(event) => handleFieldChange('date', event.target.value)}
            />
          </label>
        </div>

        <div className="surface-grid columns-3">
          <label>
            <span className="section-label">Entry type</span>
            <select value={formData.type} onChange={(event) => handleTypeChange(event.target.value)}>
              {entryTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="section-label">Mood</span>
            <select value={formData.mood} onChange={(event) => handleMoodChange(event.target.value)}>
              {moodKeys.map((mood) => (
                <option key={mood} value={mood}>
                  {mood}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="section-label">Sentiment</span>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.sentiment}
                onChange={(event) => handleFieldChange('sentiment', Number(event.target.value))}
              />
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {formData.sentiment}% positive tone
              </span>
            </div>
          </label>
        </div>

        <div>
          <span className="section-label">Tags</span>
          <div className="chip-list">
            {tagPool.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`filter-chip${formData.tags.includes(tag) ? ' active' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={customTag}
              onChange={(event) => setCustomTag(event.target.value)}
              placeholder="Add a custom tag"
            />
            <button className="button-secondary" type="button" onClick={handleAddCustomTag}>
              ➕ Add tag
            </button>
          </div>
          {tagSuggestions.length ? (
            <div className="ai-suggestion-panel">
              <span className="section-label">AI tag suggestions</span>
              <div className="chip-list">
                {tagSuggestions.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="filter-chip active"
                    onClick={() => toggleTag(tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <label>
          <span className="section-label">Content</span>
          <textarea
            value={formData.content}
            onChange={(event) => handleFieldChange('content', event.target.value)}
            placeholder="Capture the full story or reflection"
          />
          <div className="entry-meta" style={{ marginTop: '0.5rem' }}>
            <span>{formData.content.trim().split(/\s+/).filter(Boolean).length} words</span>
            <span>•</span>
            <span>
              {Math.max(1, Math.round(formData.content.trim().split(/\s+/).filter(Boolean).length / 180))} min read
            </span>
          </div>
          {nlpEntities.length ? (
            <div className="nlp-entities">
              <span className="section-label">Detected highlights</span>
              <div className="chip-list">
                {nlpEntities.map((entity) => (
                  <span key={entity} className="tag strong">
                    {entity}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </label>

        {formData.type === 'quote' ? (
          <div className="surface-grid columns-3">
            <label>
              <span className="section-label">Quote text</span>
              <textarea
                value={formData.quoteText}
                onChange={(event) => handleFieldChange('quoteText', event.target.value)}
                placeholder="Enter the full quote"
                required
              />
            </label>
            <label>
              <span className="section-label">Author</span>
              <input
                type="text"
                value={formData.quoteAuthor}
                onChange={(event) => handleFieldChange('quoteAuthor', event.target.value)}
                placeholder="Who said it?"
              />
            </label>
            <label>
              <span className="section-label">Context</span>
              <textarea
                value={formData.quoteContext}
                onChange={(event) => handleFieldChange('quoteContext', event.target.value)}
                placeholder="Where or why this quote landed for you"
              />
            </label>
          </div>
        ) : null}

        <div className="surface-grid columns-2">
          <label>
            <span className="section-label">Location</span>
            <input
              type="text"
              value={formData.location}
              onChange={(event) => handleFieldChange('location', event.target.value)}
              placeholder="Optional · e.g. Brooklyn, NY"
            />
          </label>
          <label>
            <span className="section-label">Weather or context</span>
            <input
              type="text"
              value={formData.weather}
              onChange={(event) => handleFieldChange('weather', event.target.value)}
              placeholder="Optional · e.g. Sunny · 72°F"
            />
          </label>
        </div>

        <div className="surface-grid columns-2">
          <div>
            <span className="section-label">Images</span>
            <label className="media-upload-control">
              <span>📷 Upload images</span>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
            </label>
            {imageUploads.length ? (
              <div className="media-preview-grid">
                {imageUploads.map((upload) => (
                  <div key={upload.id} className="media-preview">
                    <img src={upload.dataUrl} alt={upload.name} loading="lazy" />
                    <div className="media-preview__meta">
                      <span>{upload.name}</span>
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={() => removeImageUpload(upload.id)}
                      >
                        ✖ Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="surface-grid">
              {formData.imageUrls.map((url, index) => (
                <div
                  key={`image-${index}`}
                  style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                >
                  <input
                    type="text"
                    value={url}
                    onChange={(event) => updateImageUrl(index, event.target.value)}
                    placeholder="Paste an image URL"
                  />
                  {formData.imageUrls.length > 1 ? (
                    <button
                      className="button-secondary"
                      type="button"
                      onClick={() => removeImageField(index)}
                      aria-label="Remove image URL"
                    >
                      ✖
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            <button
              className="button-secondary"
              type="button"
              style={{ marginTop: '0.75rem' }}
              onClick={addImageField}
            >
              ➕ Add another image link
            </button>
          </div>

          <div>
            <span className="section-label">Videos</span>
            <label className="media-upload-control">
              <span>🎬 Upload videos</span>
              <input type="file" accept="video/*" multiple onChange={handleVideoUpload} />
            </label>
            {videoUploads.length ? (
              <div className="media-preview-grid">
                {videoUploads.map((upload) => (
                  <div key={upload.id} className="media-preview">
                    <video src={upload.dataUrl} controls preload="metadata" />
                    <div className="media-preview__meta">
                      <span>{upload.name}</span>
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={() => removeVideoUpload(upload.id)}
                      >
                        ✖ Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="surface-grid">
              {formData.videoUrls.map((url, index) => (
                <div
                  key={`video-${index}`}
                  style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                >
                  <input
                    type="text"
                    value={url}
                    onChange={(event) => updateVideoUrl(index, event.target.value)}
                    placeholder="Paste a video URL (mp4, webm, etc)"
                  />
                  {formData.videoUrls.length > 1 ? (
                    <button
                      className="button-secondary"
                      type="button"
                      onClick={() => removeVideoField(index)}
                      aria-label="Remove video URL"
                    >
                      ✖
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            <button
              className="button-secondary"
              type="button"
              style={{ marginTop: '0.75rem' }}
              onClick={addVideoField}
            >
              ➕ Add another video link
            </button>
          </div>
        </div>

        <div>
          <span className="section-label">Audio</span>
          <label className="media-upload-control">
            <span>🎧 Upload audio</span>
            <input type="file" accept="audio/*" onChange={handleAudioUpload} />
          </label>
          {audioUpload ? (
            <div className="media-preview media-preview--audio">
              <audio controls src={audioUpload.dataUrl} aria-label="Uploaded audio preview" />
              <div className="media-preview__meta">
                <span>{audioUpload.name}</span>
                <button type="button" className="button-secondary" onClick={clearAudioUpload}>
                  ✖ Remove
                </button>
              </div>
            </div>
          ) : null}
          <div className="surface-grid">
            <input
              type="text"
              value={formData.audioUrl}
              onChange={(event) => handleFieldChange('audioUrl', event.target.value)}
              placeholder="Link to a hosted audio file"
              disabled={Boolean(audioUpload)}
            />
            <button
              type="button"
              className="button-secondary"
              onClick={simulateVoiceCapture}
              disabled={isRecording}
            >
              {isRecording ? 'Recording…' : '🎙️ Capture via voice'}
            </button>
          </div>
          {transcriptSegments.length ? (
            <div className="voice-transcript">
              <span className="section-label">Live transcription</span>
              <ul>
                {transcriptSegments.map((segment) => (
                  <li key={segment.id}>
                    <span>{segment.timestamp}</span>
                    <p>{segment.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <label>
          <span className="section-label">Companion follow-up</span>
          <textarea
            value={formData.aiFollowUp}
            onChange={(event) => handleFieldChange('aiFollowUp', event.target.value)}
            placeholder={suggestedFollowUps[formData.type]}
          />
        </label>
      </div>
    </form>
  )
}

export default NewEntryForm
