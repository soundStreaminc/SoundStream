import { useEffect, useRef } from 'react';

// Custom hook to trigger logic after the first mount
export function useFirstRenderEffect(callback, deps){
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    callback();
  }, deps); // Trigger effect only after first mount
};

