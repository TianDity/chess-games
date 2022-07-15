import { useState, useEffect } from 'react'
import { isBrowser, off, on } from '../utils/tools';

const useWindowSize = () => {
  const [state, setState] = useState<{ width: number, height: number }>({
    width: 0,
    height: 0,
  });

  useEffect((): (() => void) | void => {
    if (isBrowser) {
      const handler = () => {
        setState({
          ...state,
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }

      handler();

      on(window, 'resize', handler);

      return () => {
        off(window, 'resize', handler);
      }
    }
  }, [])

  return state;
}

export default useWindowSize;
