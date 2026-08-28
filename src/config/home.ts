export const homeConfig = {
  brand: 'TERMINAL4',
  hero: {
    loader: {
      frames: [
        '/assets/home/hero/timeline-loading/display_0000.png',
        '/assets/home/hero/timeline-loading/display_0003.png',
        '/assets/home/hero/timeline-loading/display_0006.png',
      ],
    },
    portrait: '/assets/home/hero/main-pic.png',
    stickers: '/assets/home/hero/stickers.png',
    stars: {
      frames: [
        '/assets/home/hero/timeline-stars/stars_0000.png',
        '/assets/home/hero/timeline-stars/stars_0003.png',
        '/assets/home/hero/timeline-stars/stars_0006.png',
      ],
    },
    spirit: {
      normalFrames: [
        '/assets/home/hero/timeline-omo1/display_0000.png',
        '/assets/home/hero/timeline-omo1/display_0003.png',
        '/assets/home/hero/timeline-omo1/display_0006.png',
      ],
      blinkFrames: [
        '/assets/home/hero/timeline-omo2/display_0000.png',
        '/assets/home/hero/timeline-omo2/display_0003.png',
        '/assets/home/hero/timeline-omo2/display_0006.png',
      ],
      normalCyclesPerBlink: 4,
    },
    title: '/assets/home/hero/title.png',
  },
  contacts: [
    { name: 'GitHub', href: 'https://github.com/zennnj', icon: 'ri-github-fill' },
    { name: 'Email', href: 'mailto:limiese0zen@gmail.com', icon: 'ri-mail-line' },
    { name: 'RSS', href: '/rss.xml', icon: 'ri-rss-fill' },
  ],
  navigation: {
    heading: ['THE PAST IS NEVER DEAD.', 'IT IS NOT EVEN PAST.'],
    items: [
      { label: 'ARTICLES', href: '/articles', image: '/assets/home/navigation/image-1.png', mask: '/assets/home/navigation/column-1-background.png', outline: '/assets/home/navigation/column-1.png' },
      { label: 'MEMOS', href: '/memos', image: '/assets/home/navigation/image-2.png', mask: '/assets/home/navigation/column-2-background.png', outline: '/assets/home/navigation/column-2.png' },
      { label: 'REVIEWS', href: '/reviews', image: '/assets/home/navigation/image-3.png', mask: '/assets/home/navigation/column-3-background.png', outline: '/assets/home/navigation/column-3.png' },
      { label: 'GALLERY', href: '/gallery', image: '/assets/home/navigation/image-4.png', mask: '/assets/home/navigation/column-4-background.png', outline: '/assets/home/navigation/column-4.png' },
    ],
  },
  about: {
    title: 'ABOUT',
    paragraphs: [
      'Hi, I’m async. This is the small terminal where I collect things I have learned, made, watched, and almost forgotten.',
      'I write about backend development, systems, programming, art, and the ordinary details that make a day worth keeping.',
    ],
    href: '/about',
  },
  footer: {
    navigation: [
      { label: 'HOME', href: '/' },
      { label: 'ARTICLES', href: '/articles' },
      { label: 'MEMOS', href: '/memos' },
      { label: 'REVIEWS', href: '/reviews' },
      { label: 'GALLERY', href: '/gallery' },
      { label: 'ABOUT', href: '/about' },
      { label: 'ABOUT SITE', href: '/site' },
    ],
    email: 'limiese0zen@gmail.com',
  },
} as const;

export type HomeNavigationItem = (typeof homeConfig.navigation.items)[number];
