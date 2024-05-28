import { useRef } from 'react';

import { onMount } from 'utils/hooks';

const FONT_MIN = 10;

export default function FitText(props) {
  const ref = useRef();

  onMount(() => {
    setupObserver();
    fitText(ref.current);
  });

  function setupObserver() {
    const observer = new MutationObserver(() => {
      fitText(ref.current);
    });
    observer.observe(ref.current, {
      subtree: true,
      childList: true,
      characterData: true,
    });
  }

  return <div ref={ref} style={{ opacity: 0, fontSize: '' }} {...props} />;
}

async function fitText(el) {
  await document.fonts.ready;

  // Need to manually set the styles here to allow
  // updates to happen synchronously and avoid flashes
  // of larger content as it is resizing.
  el.style.opacity = 0;
  el.style.fontSize = '';

  const parent = getOverflowingParent(el);
  if (parent) {
    let px = parseInt(window.getComputedStyle(el).fontSize);
    while (px > FONT_MIN && parent.scrollHeight > parent.clientHeight) {
      px -= 4;
      el.style.fontSize = `${px}px`;
    }
  }

  el.style.opacity = 1;
}

function getOverflowingParent(el) {
  const text = el.textContent;
  let node = el;
  while ((node = node.parentNode)) {
    if (node.textContent !== text) {
      break;
    }
    if (isOverflowing(node)) {
      return node;
    }
  }
}

function isOverflowing(el) {
  return el.scrollHeight > el.clientHeight;
}
