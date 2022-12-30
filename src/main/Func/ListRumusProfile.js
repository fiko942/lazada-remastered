import fs from 'fs';
export default function ListRumusProfile(global) {
  const rumus = JSON.parse(
    fs.readFileSync(global.files.pengaturan_rumus, 'utf-8')
  );
  return rumus.map((x) => x.profileName);
}
