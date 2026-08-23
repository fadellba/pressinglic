//InjectionToken: le service qui sait stocker des clés/valeurs
import { InjectionToken } from '@angular/core';

export interface KeyValueStorage {//c'est le contrat qui dit tout objet qui prétend être un KeyValueStorage doit savoir faire trois choses.
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

//service de stockage angular (token) cle valeur
export const STORAGE_PROVIDER = new InjectionToken<KeyValueStorage>('STORAGE_PROVIDER');


export class LocalStorageProvider implements KeyValueStorage {

  //localStorage: stockage du navigateur

  get(key: string): string | null {
    return localStorage.getItem(key);
  }

  set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}