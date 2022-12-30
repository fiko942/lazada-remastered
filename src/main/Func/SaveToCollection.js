import moment from 'moment-timezone';
import 'moment/locale/id';
import fs from 'fs';

export default async function SaveToCollection({
  results,
  keywords,
  global,
  cdn,
}) {
  if (typeof cdn == 'undefined') cdn = false;
  const MAIN_NAME =
    keywords.length > 1
      ? `${keywords[0]} & ${keywords.length - 1} other`
      : keywords[0];
  const CURRENT_EPOCH = moment().tz('Asia/Jakarta').unix();

  const COLLECTION_TARGET_PATH =
    global.dirs.collection + CURRENT_EPOCH + '.json';
  // save the collection result
  await fs.writeFileSync(
    COLLECTION_TARGET_PATH,
    JSON.stringify(results),
    'utf-8'
  );
  // save to the collection list
  var LIST = JSON.parse(
    await fs.readFileSync(global.files.collection_list, 'utf-8')
  );
  LIST.push({
    name: MAIN_NAME,
    created: CURRENT_EPOCH,
    len: results.length,
    keywords: keywords,
    path: COLLECTION_TARGET_PATH,
    cdn,
  });
  return fs.writeFileSync(
    global.files.collection_list,
    JSON.stringify(LIST),
    'utf-8'
  );
}
