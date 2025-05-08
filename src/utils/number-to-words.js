// utils/number-to-words.js

// Convertit un nombre entier en mots (version basique pour français)
const UNITS = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"];
const TEENS = ["dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
const TENS = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante", "quatre-vingt", "quatre-vingt"];

/**
 * Convertit un entier (0 <= n < 1_000_000_000) en mots français.
 */
export function numberToWords(n) {
  if (n < 0) return 'moins ' + numberToWords(-n);
  if (n < 10) return UNITS[n];
  if (n < 20) return TEENS[n - 10];
  if (n < 100) {
    const ten = Math.floor(n / 10);
    const unit = n % 10;
    let sep = unit === 1 && (ten === 1 || ten === 7 || ten === 9) ? ' et ' : '-';
    if (ten === 7 || ten === 9) {
      // soixante-dix, quatre-vingt-dix
      const baseTen = TENS[ten];
      return baseTen + (unit ? sep + TEENS[unit] : (ten === 8 ? 's' : ''));
    }
    const base = TENS[ten];
    return base + (unit ? sep + UNITS[unit] : '');
  }
  if (n < 1000) {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    const hText = hundred > 1 ? UNITS[hundred] + ' cents' : 'cent';
    return rest ? hText + ' ' + numberToWords(rest) : hText;
  }
  if (n < 1_000_000) {
    const thousands = Math.floor(n / 1000);
    const rest = n % 1000;
    const tText = thousands > 1 ? numberToWords(thousands) + ' mille' : 'mille';
    return rest ? tText + ' ' + numberToWords(rest) : tText;
  }
  if (n < 1_000_000_000) {
    const millions = Math.floor(n / 1_000_000);
    const rest = n % 1_000_000;
    const mText = millions > 1 ? numberToWords(millions) + ' millions' : 'un million';
    return rest ? mText + ' ' + numberToWords(rest) : mText;
  }
  return String(n);
}

/**
 * Convertit un montant numérique en texte, avec partie décimale et suffixe de devise.
 * @param {number} amount Montant à convertir (ex: 1234.56)
 * @param {'GNF'|'USD'|'EUR'} devise
 * @returns {string}
 */
export function amountToWords(amount, devise) {
  const integerPart = Math.floor(amount);
  const fraction = Math.round((amount - integerPart) * 100);
  let words = numberToWords(integerPart);
  if (fraction) {
    words += ' et ' + numberToWords(fraction) + ' centimes';
  }
  switch (devise) {
    case 'USD':
      return words + ' dollars';
    case 'EUR':
      return words + ' euros';
    default:
      return words + ' francs guinéens';
  }
}
