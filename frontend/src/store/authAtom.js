import { atomWithLocalStorage } from './recoilPersist';

export const userAtom = atomWithLocalStorage('userAtom', {
  id: null,
  name: '',
  email: '',
  role: '',
  token: ''
});