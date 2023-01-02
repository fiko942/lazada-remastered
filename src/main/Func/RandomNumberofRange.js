export default function RandomNumberofRange(min, max) {
  const difference = max - min;
  var rand = Math.random();
  rand = Math.floor(rand * difference);
  rand = rand + min;
  return rand;
}
