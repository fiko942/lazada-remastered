import fs from 'fs';

export default function GetDefaultProfile(global) {
  const rumuses = JSON.parse(
    fs.readFileSync(global.files.pengaturan_rumus, 'utf-8')
  );
  const result = rumuses.filter((x) => x.default == true);
  if (result.length < 1) {
    return undefined;
  }
  return result;
}
