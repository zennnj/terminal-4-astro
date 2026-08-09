export const homeConfig = {
  brand: 'TERMINAL4',
  hero: {
    portrait: '/assets/home/hero/main-pic.png',
    stickers: '/assets/home/hero/stickers.png',
    spirit: '/assets/home/hero/omo.png',
    title: '/assets/home/hero/title.png',
  },
  contacts: [
    {
      name: 'GitHub',
      href: 'https://github.com/zennnj',
      icon: 'ri-github-fill',
    },
    {
      name: 'Email',
      href: 'mailto:limiese0zen@gmail.com',
      icon: 'ri-mail-line',
    },
    {
      name: 'RSS',
      href: '/rss.xml',
      icon: 'ri-rss-fill',
    },
  ],
  navigation: {
    heading: ['THE PAST IS NEVER DEAD.', 'IT IS NOT EVEN PAST.'],
    items: [
      {
        label: 'ARTICLES',
        href: '/blog/1',
        image: '/assets/home/navigation/image-1.png',
        mask: '/assets/home/navigation/column-1-background.png',
        outline: '/assets/home/navigation/column-1.png',
      },
      {
        label: 'MEMOS',
        href: '/memos',
        image: '/assets/home/navigation/image-2.png',
        mask: '/assets/home/navigation/column-2-background.png',
        outline: '/assets/home/navigation/column-2.png',
      },
      {
        label: 'REVIEWS',
        href: '/reviews',
        image: '/assets/home/navigation/image-3.png',
        mask: '/assets/home/navigation/column-3-background.png',
        outline: '/assets/home/navigation/column-3.png',
      },
      {
        label: 'GALLERY',
        href: '/gallery',
        image: '/assets/home/navigation/image-4.png',
        mask: '/assets/home/navigation/column-4-background.png',
        outline: '/assets/home/navigation/column-4.png',
      },
    ],
  },
  about: {
    title: 'ABOUT',
    paragraphs: [
      'Hi, I\u2019m zennnj. This is the small terminal where I collect things I have learned, made, watched, and almost forgotten.',
      'I write about backend development, systems, programming, art, and the ordinary details that make a day worth keeping.',
    ],
    href: '/about',
  },
  siteLog: {
    title: ['SITE', 'UPDATE', 'LOG'],
    entries: [
      { date: '2026-01-23', text: '进行备案并迁移到了 EdgeOne Pages，优化国内访问体验。' },
      { date: '2026-03-28', text: '更换图床，修复因 CORS 导致的图片加载问题。' },
      { date: '2026-03-29', text: '加入访问计数与友链功能，并开始维护友链申请说明。' },
      { date: '2026-05-30', text: '修复友链页面的浅色模式显示问题，并新增友链。' },
      { date: '2026-07-12', text: '接入 Umami Cloud，修复关于界面的 Substats 与 Tools 图标显示问题。' },
    ],
    href: '/site',
  },
  footer: {
    navigation: [
      { label: 'HOME', href: '/' },
      { label: 'ARTICLES', href: '/blog/1' },
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
