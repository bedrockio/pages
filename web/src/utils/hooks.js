import { useState, useEffect } from 'react';

export function onMount(fn) {
  useEffect(fn, []);
}

export function onUnmount(fn) {
  useEffect(() => fn, []);
}

export function onChange(fn, deps = []) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) {
      fn();
    } else {
      setMounted(true);
    }
  }, deps);
}

export function useMergedState(initial = {}) {
  const [state, setState] = useState(initial);

  function setMergedState(updated) {
    setState({
      ...state,
      ...updated,
    });
  }

  return [state, setMergedState];
}
