import { useRef, useCallback } from 'react';

const MAX_HISTORY = 50;

const useUndoRedo = (currentValue, setCurrentValue) => {
  const pastRef = useRef([]);
  const futureRef = useRef([]);

  const setValue = useCallback((updater) => {
    setCurrentValue(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      pastRef.current = [...pastRef.current.slice(-(MAX_HISTORY - 1)), prev];
      futureRef.current = [];
      return next;
    });
  }, [setCurrentValue]);

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;
    setCurrentValue(prev => {
      const previous = pastRef.current[pastRef.current.length - 1];
      pastRef.current = pastRef.current.slice(0, -1);
      futureRef.current = [...futureRef.current, prev];
      return previous;
    });
  }, [setCurrentValue]);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    setCurrentValue(prev => {
      const next = futureRef.current[futureRef.current.length - 1];
      futureRef.current = futureRef.current.slice(0, -1);
      pastRef.current = [...pastRef.current, prev];
      return next;
    });
  }, [setCurrentValue]);

  const canUndo = pastRef.current.length > 0;
  const canRedo = futureRef.current.length > 0;

  return { setValue, undo, redo, canUndo, canRedo };
};

export default useUndoRedo;
