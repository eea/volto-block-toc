//to be removed when upgrade to Volto 17

export function normalizeString(str) {
  return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}
