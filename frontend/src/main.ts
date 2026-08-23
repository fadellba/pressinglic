import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

/*
bootstrapApplication est le mécanisme qui démarre l'application Angular
@Component déclare et configure le composant App, 
tandis que bootstrapApplication utilise ce composant comme racine pour démarrer l'application Angular.
*/
bootstrapApplication(App, appConfig).catch((err) => console.error(err));