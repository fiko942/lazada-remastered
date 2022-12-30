export default function UniqueArray(data) {
  return data.filter((item, pos, self) => self.indexOf(item) == pos);
}
