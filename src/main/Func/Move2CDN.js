import fs from 'fs';
import axios from 'axios';
import Distribute from './Distribute';
import SaveToCollection from './SaveToCollection';

var result = [];

export default async function Move2CDN({
  global,
  onProgress,
  onComplete,
  collections,
}) {
  var totalData = 0;
  var processed = 0;
  // * Penggabungan collection
  var merged_collection = [];
  var keywords = [];
  for (var collection of collections) {
    const data = JSON.parse(fs.readFileSync(collection.path, 'utf-8'));
    merged_collection.push(...data);
    keywords.push(collection.keywords);
  }
  totalData = merged_collection.length;

  // * Distributed
  const distributed_data = Distribute(merged_collection, 50);

  // * Initial progress state
  onProgress(processed, merged_collection.length);

  for (var ds of distributed_data) {
    var tasks = [];
    for (let i = 0; i < ds.length; i++) {
      tasks.push(
        ChangeUrlSingleCore(ds[i].images, (cdn) => {
          var d = ds[i];
          d.images = cdn;
          result.push(d);
          processed++;
          return onProgress(processed, totalData);
        })
      );
    }

    await Promise.all(tasks);
  }

  SaveToCollection({
    results: result,
    keywords: keywords,
    global,
    cdn: true,
  });
  result = [];
  return onComplete();
}

async function ChangeUrlSingleCore(images, callback) {
  var LOOP = true;
  do {
    try {
      const res = await axios.get(
        'https://cdn.rencangdahar.com/upload?files=' + JSON.stringify(images)
      );
      callback(res.data);
      LOOP = false;
    } catch (err) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(err.message);
    }
  } while (LOOP);
  return 1;
}
