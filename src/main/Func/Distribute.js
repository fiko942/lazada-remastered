export default function Distribute(arrays, length) {
  const arrayBatch = Array.from(
    {
      length,
    },
    (v, i) => []
  );
  var i = 0;
  for (var array of arrays) {
    arrayBatch[i % length].push(array);
    i++;
  }
  return arrayBatch;
}
