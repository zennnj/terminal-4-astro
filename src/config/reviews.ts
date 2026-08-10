export const reviewTypeLabels = {
  game: 'GAME',
  movie: 'MOVIE',
  anime: 'ANI/COMIC',
  video: 'VIDEO',
  book: 'BOOK',
} as const;

export const reviewAccentColors = {
  game: 'var(--p4-coral)',
  anime: 'var(--p4-yellow)',
  movie: 'var(--p4-orange)',
  video: 'var(--p4-gray)',
  book: 'var(--p4-purple)',
} as const;

export type ReviewType = keyof typeof reviewTypeLabels;

export const getReviewTypeLabel = (type: string) =>
  reviewTypeLabels[type as ReviewType] ?? type.toUpperCase();

export const getReviewAccentColor = (type: string) =>
  reviewAccentColors[type as ReviewType] ?? 'var(--p4-coral)';
