const ignoredWords = new Set([
  'sa',
  's/a',
  'ltda',
  'holding',
  'holdings',
  'participacoes',
]);

export function getStockInitials(name: string) {
  const words = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s/]/gu, '')
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => !ignoredWords.has(word.toLowerCase()));

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return words[0]?.slice(0, 2).toUpperCase() ?? '--';
}