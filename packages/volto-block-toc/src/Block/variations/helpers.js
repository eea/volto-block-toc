/**
 * This function should be removed when upgrading to Volto 17.
 * Replace with Volto's normalizeString from @plone/volto/helpers.
 */

export function normalizeString(str) {
  return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}
