export function replaceElement(arr, index, el) {
  arr = [...arr];
  arr.splice(index, 1, el);
  return arr;
}

export function removeElement(arr, index) {
  arr = [...arr];
  arr.splice(index, 1);
  return arr;
}
