import fs from 'fs';

export default function ProfileData(global, profileName, callback) {
  const profilePath = global.files.pengaturan_rumus;
  const profile = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));
  const i = profile.findIndex((x) => x.profileName == profileName);
  if (i < 0) {
    return callback(undefined);
  } else {
    return callback(profile[i]);
  }
}
