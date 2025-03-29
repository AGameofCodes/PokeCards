const predefinedColors = [
  '#ff3300',
  '#ff9900',
  '#ffff00',
  '#99ff33',
  '#33ff33',
  '#00ff99',
  '#00ffff',
  '#0099ff',
  '#0033ff',
  '#3300ff',
  '#6600ff',
  '#9900ff',
  '#ff0099',
  '#ff0033',
];

export function findNewColor(usedColors: string[]): string {
  for (let color of predefinedColors) {
    if (!usedColors.some(e => e === color)) {
      return color;
    }
  }
  return '#' + Math.floor(Math.random() * 256 * 256 * 256).toString(16);
}

export function findForegroundColor(backgroundColor: string): string | undefined {
  const bg = parseColor(backgroundColor);
  if (!bg) {
    return undefined;
  }
  const brightnessSquared = bg[0] * bg[0] + bg[1] * bg[1] + bg[2] * bg[2];
  const maxBrightness = 255 * 255 * 3;
  return brightnessSquared < maxBrightness / 2 ? '#fff' : '#000';
}

function parseColor(input: string): [number, number, number] | undefined {
  const div = document.createElement('div');
  const regex = /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i;
  div.style.color = input;
  let m = getComputedStyle(div).color.match(regex);
  if (m)
    return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
  else {
    //firefox apparently converts the style prop automatically but does not set the computed style???
    m = div.style.color.match(regex);
    if (m)
      return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
    else
      return undefined;
  }
}