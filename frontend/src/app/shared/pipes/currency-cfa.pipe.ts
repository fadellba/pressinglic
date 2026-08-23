import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe personnalisé permettant d'afficher
 * un montant au format français suivi de "FCFA".
 *
 * Exemple :
 * 15000 → 15 000 FCFA
 *
 * Utilisation dans un template :
 * {{ montant | cfa }}
 */
@Pipe({
  // Nom utilisé dans le template :
  // {{ montant | cfa }}
  name: 'cfa',

  // Pipe standalone : il peut être importé
  // directement dans un composant.
  standalone: true,
})
export class CfaCurrencyPipe implements PipeTransform {

  /**
   * Transforme une valeur numérique en montant FCFA.
   *
   * @param value
   * Le montant à formater.
   * Il peut être :
   * - un nombre
   * - undefined
   * - null
   *
   * @returns
   * Une chaîne de caractères au format :
   * "15 000 FCFA"
   */
  transform(value: number | undefined | null): string {

    // Si aucune valeur n'est fournie,
    // on affiche "0 FCFA".
    if (value === null || value === undefined) {
      return '0 FCFA';
    }

    // Intl.NumberFormat avec "fr-FR"
    // formate le nombre selon les conventions françaises.
    //
    // Exemple :
    // 15000 → "15 000"
    //
    // Ensuite on ajoute " FCFA".
    return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
  }
}