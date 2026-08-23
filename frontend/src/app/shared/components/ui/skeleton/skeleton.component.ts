/*
QUOI ?
SkeletonComponent sert à afficher visuellement qu'un contenu est en train de charger.
Il ne récupère aucune donnée.
Il ne fait aucun appel HTTP.
Il ne connaît pas les services, les tickets, les paiements, etc.
C'est simplement un composant d'interface.
POURQUOI ?
Pour une interactivite avec l'utilisateur
techiniquement, ex si trois pages de l'application ont besoin d'afficher un chargement.
Sans composant partagé, on pourrais écrire trois fois le même HTML
*/

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './skeleton.component.html',
})
export class SkeletonComponent {
  /*
   ceci veux dire:
   l'SkeletonComponent possède :
   - un nombre de lignes
   - une option avatar
   @Input() signifie essentiellement :
   Cette donnée peut être fournie par le composant parent.
  */
  @Input() lines = 3;
  @Input() avatar = false;
}