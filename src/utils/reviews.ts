import type { CollectionEntry } from 'astro:content';
import * as OpenCC from 'opencc-js';

type ReviewData = CollectionEntry<'reviews'>['data'];

export const getReviewDisplayName = (review: ReviewData) =>
  review.name?.trim() || review.originalName?.trim() || '';

const stripMarkdownBlock = (value: string) => value
  .replace(/```[\s\S]*?```/g, ' ')
  .replace(/~~~[\s\S]*?~~~/g, ' ')
  .replace(/^#{1,6}\s+.*$/gm, ' ')
  .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/<[^>]+>/g, ' ')
  .replace(/^\s*(?:>|[-+*]|\d+[.)])\s+/gm, '')
  .replace(/[*_~`]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

export const getReviewBodyExcerpt = (body: string | undefined, maxLength = 150) => {
  const paragraphs = (body ?? '')
    .split(/(?:\r?\n){2,}/)
    .map(stripMarkdownBlock)
    .filter(Boolean);
  const excerpt = paragraphs[0] ?? '';
  return excerpt.length > maxLength ? `${excerpt.slice(0, maxLength).trimEnd()}…` : excerpt;
};

const simplifiedToTraditional = OpenCC.Converter({ from: 'cn', to: 'tw' });

export const toTraditionalReviewText = (value: string) => simplifiedToTraditional(value);

const chineseDigits = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const toChineseDigits = (value: number) => String(value).split('').map((digit) => chineseDigits[Number(digit)]).join('');
const toChineseNumber = (value: number) => {
  if (value < 10) return chineseDigits[value];
  if (value === 10) return '十';
  if (value < 20) return `十${chineseDigits[value % 10]}`;
  return `${chineseDigits[Math.floor(value / 10)]}十${value % 10 ? chineseDigits[value % 10] : ''}`;
};

export const formatFormalChineseDate = (date: Date) => ({
  year: `${toChineseDigits(date.getFullYear())}年`,
  monthDay: `${toChineseNumber(date.getMonth() + 1)}月${toChineseNumber(date.getDate())}日`,
});
