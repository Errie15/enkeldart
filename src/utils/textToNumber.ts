// Omvandla svenska talord till siffror (0-100+)
const baseNumbers: Record<string, number> = {
  'noll': 0, 'ett': 1, 'en': 1, 'två': 2, 'tre': 3, 'fyra': 4, 'fem': 5, 'sex': 6, 'sju': 7, 'åtta': 8, 'nio': 9,
  'tio': 10, 'elva': 11, 'tolv': 12, 'tretton': 13, 'fjorton': 14, 'femton': 15, 'sexton': 16, 'sjutton': 17, 'arton': 18, 'nitton': 19, 'tjugo': 20,
  'trettio': 30, 'fyrtio': 40, 'femtio': 50, 'sextio': 60, 'sjuttio': 70, 'åttio': 80, 'nittio': 90, 'hundra': 100
};

export function textToNumber(input: string): number | string {
  const normalized = input.toLowerCase().replace(/[^a-zåäö0-9]/gi, '');
  if (baseNumbers[normalized] !== undefined) return baseNumbers[normalized];

  // Kombinerade tal: t.ex. "tjugoett", "fyrtiotvå", "hundraåtta"
  // Först, hundra + (t.ex. "åtta")
  if (normalized.startsWith('hundra')) {
    const rest = normalized.slice('hundra'.length);
    if (!rest) return 100;
    if (baseNumbers[rest] !== undefined) return 100 + baseNumbers[rest];
    // t.ex. "hundratjugotvå"
    for (const [key, value] of Object.entries(baseNumbers)) {
      if (rest.startsWith(key)) {
        const rest2 = rest.slice(key.length);
        if (baseNumbers[rest2] !== undefined) return 100 + value + baseNumbers[rest2];
      }
    }
  }

  // Tiotal + ental, t.ex. "fyrtiotvå"
  for (const [tio, tval] of Object.entries(baseNumbers)) {
    if (tval % 10 === 0 && tval > 0 && normalized.startsWith(tio)) {
      const rest = normalized.slice(tio.length);
      if (!rest) return tval;
      if (baseNumbers[rest] !== undefined) return tval + baseNumbers[rest];
    }
  }

  // Om det är en siffra redan
  if (/^\d+$/.test(input)) return parseInt(input, 10);

  return input;
} 