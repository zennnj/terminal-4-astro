export const reviewTypeLabels = {
  game: 'GAME',
  movie: 'MOVIE',
  anime: 'ANI/COMIC',
  video: 'VIDEO',
  book: 'BOOK',
} as const;

export const reviewTypeChineseLabels = {
  game: '游戏',
  movie: '电影',
  anime: '动漫',
  video: '视频',
  book: '书籍',
} as const;

export const reviewAccentColors = {
  game: '#e36397',
  movie: '#f6e27f',
  anime: '#44ccff',
  video: '#6e2594',
  book: '#169873',
} as const;

export type ReviewType = keyof typeof reviewTypeLabels;

export const getReviewTypeLabel = (type: string) =>
  reviewTypeLabels[type as ReviewType] ?? type.toUpperCase();

export const getReviewTypeChineseLabel = (type: string) =>
  reviewTypeChineseLabels[type as ReviewType] ?? type;

export const getReviewAccentColor = (type: string) =>
  reviewAccentColors[type as ReviewType] ?? '#e36397';
