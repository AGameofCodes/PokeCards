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