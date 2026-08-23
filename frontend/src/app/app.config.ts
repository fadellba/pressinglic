import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { LocalStorageProvider, STORAGE_PROVIDER } from './core/storage/storage-provider';

/*
Cette configuration définit les fournisseurs de services (providers) globaux de l'application,
il va injecte toutes les dependances qu'on aura besoin pour le demarage de l'application
*/

/*On exporte une constante nommee appConfig de type ApplicationConfig.  */
export const appConfig: ApplicationConfig = {
  /* C'est le tableau qui liste tous les services, 
  configurations et fonctionnalités qui doivent être disponibles dans toute l'application. */
  providers: [
    /*
    Active le nouveau mode Zoneless (sans Zone.js) introduit dans Angular moderne.
    Angular ne surveille plus automatiquement chaque clic ou événement pour mettre à jour l'interface. 
    Cela améliore considérablement les performances de rendu. 
    L'application se base désormais sur les Signals pour savoir précisément quand et quoi mettre à jour.
    */
    provideZonelessChangeDetection(),
    /*Configure le système de navigation (le routage) de votre application.
    routes : Le tableau contenant la liste de nos pages (URL et composants associés).
    withViewTransitions() : Active l'API native View Transitions du navigateur. 
    Cela crée automatiquement des animations fluides et professionnelles lors des changements de pages.*/
    provideRouter(routes, withViewTransitions()),
    /*
    Active le module pour effectuer des requêtes HTTP (liens avec votre API / Backend).
    withInterceptors([...]) : Ajoute des "douaniers" (interceptors) 
    qui vont intercepter toutes les requêtes ou réponses HTTP sortantes et rentrantes.
    authInterceptor : Sert généralement à ajouter automatiquement un jeton de sécurité (Token JWT) 
    dans l'en-tête de chaque requête.
    errorInterceptor : Sert à centraliser la gestion des erreurs 
    (ex: si l'API renvoie une erreur 401 ou 500, elle est gérée ici pour afficher un message). */
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    /*Ici on dit à Angular : 
    "Chaque fois qu'un composant demande à utiliser STORAGE_PROVIDER, 
    donne-lui une instance de la classe LocalStorageProvider". 
    Cela permet de changer facilement de système de stockage (ex: passer à du SessionStorage) 
    dans le futur sans modifier nos composants. */
    { provide: STORAGE_PROVIDER, useClass: LocalStorageProvider },
  ],
};