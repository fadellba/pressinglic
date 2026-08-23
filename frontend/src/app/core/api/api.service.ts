/*http: permet d'utiliser les methode get,post,put,patch,delete
  inject: pour faire de l'injection de dependance sans passe par le constructuer
  injectable: pour dire qu'on peut l'appeler partout  
  map: permet de transformer une valeur.
  catchError: permet d'intercepter une erreur.
  throwError: permet de créer un Observable qui émet une erreur.
  RxJS: est une bibliothèque JavaScript utilisée par Angular pour gérer des données qui arrivent dans le temps, 
  notamment les réponses HTTP, les événements utilisateur et les flux de données.
*/
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core'; 
import { catchError, map, Observable, throwError } from 'rxjs';

import { APP_CONFIG } from '../config/config';
import { ApiError } from './api-error';


@Injectable({ providedIn: 'root' }) //Pour dire que c'est un service globale, instance dispo dans tout l'app
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = APP_CONFIG.apiUrl.replace(/\/+$/, ''); //replace: supprime les `/` situés à la fin.

  private path(path: string): string {
    return `${this.baseUrl}${path}`;
  } // pour eviter de repeter la concatenation

  /*
  T: pour dire que le type de retour est generique
  Record: est un type utilitaire de TypeScript qui permet de décrire un objet dont les clés et les valeurs ont des types précis.
  Observable: représente le résultat futur d'une requête HTTP.
  pipe: sert à enchaîner des traitements sur un Observable.
  catchError: intervient seulement si la requête provoque une erreur mais renvoie une erreur brute.
  fail: Son rôle est de transformer l'erreur HTTP en ApiError, puis de la renvoyer comme erreur RxJS.
  body: represente les donnees envoyees au serveur
  unknown: on ne connait pas le type mais TypeScript va verifier quand meme
  never: aucune valeur possible
  */



  //Elle prend la réponse HTTP telle qu'elle arrive et la retourne sans la transformer.
  get<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
    return this.http
      .get<T>(this.path(path), { params: params as never }/*On force le typage pour qu'angular accepte notre type TypeScript*/)
      .pipe(catchError((err) => this.fail(err)));
  }

  //Cette méthode sert lorsqu'on veut directement récupérer le tableau, sans avoir à manipuler l'enveloppe data
  getUnwrapped<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T[]> {
    return this.get<{ data: T[] } | T[]>(path, params).pipe(map((body) => (Array.isArray(body) ? body : body.data)));
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.path(path), body).pipe(catchError((err) => this.fail(err)));
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http.patch<T>(this.path(path), body).pipe(catchError((err) => this.fail(err)));
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(this.path(path), body).pipe(catchError((err) => this.fail(err)));
  }

  delete(path: string): Observable<void> {
    return this.http.delete<void>(this.path(path)).pipe(catchError((err) => this.fail(err)));
  }

  download(path: string): Observable<Blob> {
    return this.http.get(this.path(path), { responseType: 'blob' }).pipe(catchError((err) => this.fail(err)));
  }

  private fail(response: unknown): Observable<never>/*cet Observable ne donnera pas de valeur normale ; il terminera par une erreur*/ {
    return throwError(() => ApiError.fromHttp(response as never));
  }
}