export const initialEntries = [
  {
    id: '1',
    title: 'Family Fun in the Park',
    type: 'text',
    createdAt: '2025-02-18T17:45:00Z',
    mood: 'Joyful',
    sentiment: 0.82,
    tags: ['Personal', 'Family', 'Outdoor'],
    summary: 'Sunny afternoon picnic with frisbee games and laughing with the kids.',
    content:
      'Spent the afternoon at Prospect Park with the whole family. We packed sandwiches, played frisbee, and the kids built a fort with fallen branches. Everyone unplugged and leaned into being silly together.',
    aiFollowUp: 'What was the funniest thing that happened while you were playing in the park?',
    attachments: {
      images: [
        'https://images.unsplash.com/photo-1521459467264-802e2ef3141f?auto=format&fit=crop&w=800&q=80'
      ],
      videos: [],
      audio: null
    },
    location: 'Prospect Park, Brooklyn',
    weather: 'Sunny · 74°F',
    metrics: {
      wordCount: 58,
      readingTime: '1 min'
    },
    connectedTo: ['4', '6']
  },
  {
    id: '2',
    title: 'Quote of the Day',
    type: 'quote',
    createdAt: '2025-02-17T08:20:00Z',
    mood: 'Inspired',
    sentiment: 0.71,
    tags: ['Reflection', 'Work'],
    summary: 'A quote that helped reframe a tough sprint planning session.',
    content:
      '“The best way to predict the future is to create it.” — Peter Drucker. Reading this before sprint planning reminded me to bring optimism into the discussion.',
    quote: {
      text: 'The best way to predict the future is to create it.',
      author: 'Peter Drucker',
      context: 'Shared during this morning\'s product sync before sprint planning.'
    },
    aiFollowUp: 'How can you bring this sense of ownership into tomorrow\'s meeting?',
    attachments: {
      images: [],
      videos: [],
      audio: null
    },
    location: 'Home Office',
    weather: 'Cloudy · 61°F',
    metrics: {
      wordCount: 44,
      readingTime: '1 min'
    },
    connectedTo: ['5']
  },
  {
    id: '3',
    title: 'Voice Note from the Commute',
    type: 'audio',
    createdAt: '2025-02-16T23:15:00Z',
    mood: 'Thoughtful',
    sentiment: 0.45,
    tags: ['Work', 'Ideas'],
    summary: 'Captured a late-night idea about onboarding improvements.',
    content:
      'Recorded a quick voice memo about simplifying onboarding. Thinking about contextual tooltips triggered by the first three actions a new user takes.',
    aiFollowUp: 'Want to turn this idea into a reminder for tomorrow\'s stand-up?',
    attachments: {
      images: [],
      videos: [],
      audio: 'https://cdn.pixabay.com/download/audio/2023/09/26/audio_c7784fd9da.mp3?filename=calm-ambient-155795.mp3'
    },
    location: 'Q Train',
    weather: 'Rainy · 48°F',
    metrics: {
      wordCount: 39,
      readingTime: '1 min'
    },
    connectedTo: ['7']
  },
  {
    id: '4',
    title: 'Art Museum Reflections',
    type: 'text',
    createdAt: '2025-02-15T20:05:00Z',
    mood: 'Curious',
    sentiment: 0.64,
    tags: ['Travel', 'Personal', 'Creativity'],
    summary: 'Evening wandering through the modern art wing and sketching shapes.',
    content:
      'Visited the modern art museum downtown. The bold colors and layered textures sparked ideas for the dashboard redesign. Sketched geometric layouts while sipping coffee at the museum cafe.',
    aiFollowUp: 'Which part of the museum sparked the dashboard idea the most?',
    attachments: {
      images: [
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80'
      ],
      videos: [],
      audio: null
    },
    location: 'Downtown Art Museum',
    weather: 'Clear · 66°F',
    metrics: {
      wordCount: 54,
      readingTime: '1 min'
    },
    connectedTo: ['1', '8']
  },
  {
    id: '5',
    title: 'Weekly Summary & Mood Snapshot',
    type: 'summary',
    createdAt: '2025-02-14T09:30:00Z',
    mood: 'Balanced',
    sentiment: 0.55,
    tags: ['Reflection', 'Wellness'],
    summary: 'Reviewed the week, noted energy dips mid-week and highs on family day.',
    content:
      'Energy dipped on Wednesday, but Thursday\'s coworking session and Saturday\'s park day lifted it. Mood average sat at 6.8/10. Intention for next week: protect creative blocks in the morning.',
    aiFollowUp: 'Would you like to schedule focus blocks for the mornings you mentioned?',
    attachments: {
      images: [],
      videos: [],
      audio: null
    },
    location: 'Kitchen Table',
    weather: 'Overcast · 58°F',
    metrics: {
      wordCount: 46,
      readingTime: '1 min'
    },
    connectedTo: ['2']
  },
  {
    id: '6',
    title: 'Kitchen Experiment: Thai Curry',
    type: 'photo',
    createdAt: '2025-02-13T19:10:00Z',
    mood: 'Energized',
    sentiment: 0.77,
    tags: ['Personal', 'Food', 'Creativity'],
    summary: 'Tried a new red curry recipe with basil and lime. It worked!',
    content:
      'Cooked a spicy Thai red curry for dinner using coconut milk, kaffir lime leaves, and fresh basil. The balance of heat and sweetness was spot on.',
    aiFollowUp: 'Add this recipe to your favorites so it is easy to find next time?',
    attachments: {
      images: [
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
      ],
      videos: [],
      audio: null
    },
    location: 'Home Kitchen',
    weather: 'Breezy · 63°F',
    metrics: {
      wordCount: 38,
      readingTime: '1 min'
    },
    connectedTo: ['1']
  },
  {
    id: '7',
    title: 'Morning Run & Mood Tracking',
    type: 'text',
    createdAt: '2025-02-12T06:45:00Z',
    mood: 'Motivated',
    sentiment: 0.69,
    tags: ['Wellness', 'Personal'],
    summary: 'Tracked pace and mood after a sunrise run by the river.',
    content:
      'Logged a 4-mile sunrise run. Pace averaged 9:10, mood boosted from 5 to 8 afterwards. Noticed that podcasts keep me steady, but running with music pushes the pace.',
    aiFollowUp: 'Want a reminder to plan another sunrise run this weekend?',
    attachments: {
      images: [
        'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?auto=format&fit=crop&w=800&q=80'
      ],
      videos: [],
      audio: null
    },
    location: 'Hudson River Park',
    weather: 'Cool · 52°F',
    metrics: {
      wordCount: 51,
      readingTime: '1 min'
    },
    connectedTo: ['3']
  },
  {
    id: '8',
    title: 'Photo Gallery: Street Photography Walk',
    type: 'photo',
    createdAt: '2025-02-11T15:20:00Z',
    mood: 'Creative',
    sentiment: 0.73,
    tags: ['Creativity', 'Travel', 'Photography'],
    summary: 'Captured reflections and symmetry on a photo walk through downtown.',
    content:
      'Focused on reflections in windows and pops of neon color. Tested the new 35mm lens and loved the shallow depth for portraits.',
    aiFollowUp: 'Should I create an album pairing these photos with the museum sketches?',
    attachments: {
      images: [
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80'
      ],
      videos: [],
      audio: null
    },
    location: 'Downtown',
    weather: 'Partly Cloudy · 68°F',
    metrics: {
      wordCount: 43,
      readingTime: '1 min'
    },
    connectedTo: ['4']
  },
  {
    id: '9',
    title: 'Studio Lighting Test Footage',
    type: 'video',
    createdAt: '2025-02-10T18:40:00Z',
    mood: 'Creative',
    sentiment: 0.68,
    tags: ['Creativity', 'Video', 'Work'],
    summary: 'Captured a quick lighting test for the upcoming brand film.',
    content:
      'Recorded a short clip while experimenting with the new softbox and edge light setup. The cooler gel created the cinematic contrast I was chasing for next week\'s brand film.',
    aiFollowUp: 'Which shots felt closest to the mood you want to capture next week?',
    attachments: {
      images: [],
      videos: ['https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'],
      audio: null
    },
    location: 'Studio Loft',
    weather: 'Indoors · Controlled lighting',
    metrics: {
      wordCount: 38,
      readingTime: '1 min'
    },
    connectedTo: ['8']
  }
]
