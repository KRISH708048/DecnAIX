import { atom, useRecoilState } from 'recoil';
import { useEffect } from 'react';

export function atomWithLocalStorage(key, defaultValue) {
  const savedValue = typeof window !== 'undefined' 
    ? localStorage.getItem(key)
    : null;
  const initialValue = savedValue !== null 
    ? JSON.parse(savedValue) 
    : defaultValue;

  const newAtom = atom({
    key: key,
    default: initialValue,
  });

  return newAtom;
}

export function usePersistedRecoilState(recoilState) {
  const [state, setState] = useRecoilState(recoilState);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(recoilState.key, JSON.stringify(state));
    }
  }, [state, recoilState.key]);

  return [state, setState];
}