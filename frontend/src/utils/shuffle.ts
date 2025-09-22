// src/utils/shuffle.ts
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array]; // 원본 불변 유지
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
