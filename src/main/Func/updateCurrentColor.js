import fs from 'fs';

export default async function updateCurrentColor(global, currentColor) {
  return fs.writeFileSync(global.current_color, currentColor, 'utf-8');
}
