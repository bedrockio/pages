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

export function moveElement(arr, oldIndex, newIndex) {
  arr = [...arr];
  const [el] = arr.splice(oldIndex, 1);
  arr.splice(newIndex, 0, el);
  return arr;
}
