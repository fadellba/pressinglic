import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  inject,
} from '@angular/core';

/**
 * Sélecteur CSS permettant de trouver les éléments
 * qui peuvent recevoir le focus au clavier.
 *
 * Exemples :
 * - liens
 * - boutons actifs
 * - champs de formulaire
 * - éléments possédant un tabindex valide
 */
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

@Directive({
  // La directive sera utilisée sous cette forme :
  // <div appFocusTrap>
  selector: '[appFocusTrap]',

  // Directive standalone : pas besoin de NgModule.
  standalone: true,
})
export class FocusTrapDirective implements AfterViewInit, OnDestroy {
  /**
   * Référence vers l'élément HTML sur lequel
   * la directive est appliquée.
   *
   * Exemple :
   * <div appFocusTrap>
   *
   * this.el.nativeElement représente cette <div>.
   */
  private readonly el: ElementRef<HTMLElement> = inject(ElementRef);

  /**
   * Élément qui possédait le focus avant l'ouverture
   * de la modale.
   *
   * Il servira à restaurer le focus lorsque la modale
   * sera fermée.
   */
  private lastFocused: HTMLElement | null = null;

  /**
   * Fonction appelée lorsqu'une touche du clavier
   * est pressée dans la zone surveillée.
   *
   * On délègue le traitement à handleKeydown().
   */
  private readonly onKeydown = (event: KeyboardEvent) =>
    this.handleKeydown(event);

  /**
   * Appelée après l'initialisation de la vue.
   *
   * Ici on :
   * 1. mémorise l'ancien élément ayant le focus ;
   * 2. écoute les événements clavier ;
   * 3. donne le focus au premier élément focusable.
   */
  ngAfterViewInit(): void {
    // Sauvegarde l'élément qui avait le focus avant la modale.
    this.lastFocused = document.activeElement as HTMLElement | null;

    // Écoute les touches du clavier sur l'élément de la directive.
    this.el.nativeElement.addEventListener('keydown', this.onKeydown);

    // Place le focus sur le premier élément focusable de la modale.
    this.focusFirst();
  }

  /**
   * Appelée lorsque la directive est détruite.
   *
   * Ici on :
   * 1. supprime l'écouteur clavier ;
   * 2. rend le focus à l'élément qui l'avait avant.
   */
  ngOnDestroy(): void {
    // Supprime l'écouteur pour éviter de garder
    // un événement actif après la destruction de la modale.
    this.el.nativeElement.removeEventListener('keydown', this.onKeydown);

    // Si un élément avait le focus avant la modale,
    // on lui rend le focus.
    this.lastFocused?.focus();
  }

  /**
   * Gère les touches du clavier.
   *
   * Le Focus Trap nous intéresse uniquement pour la touche Tab.
   */
  private handleKeydown(event: KeyboardEvent): void {
    // Si ce n'est pas la touche Tab, on ne fait rien.
    if (event.key !== 'Tab') {
      return;
    }

    // Récupère tous les éléments focusables visibles
    // à l'intérieur de la modale.
    const focusable = this.getFocusable();

    // S'il n'y a aucun élément focusable, on ne fait rien.
    if (focusable.length === 0) {
      return;
    }

    // Premier élément focusable.
    const first = focusable[0];

    // Dernier élément focusable.
    const last = focusable[focusable.length - 1];

    /**
     * Cas 1 :
     * L'utilisateur fait Shift + Tab
     * alors que le premier élément possède le focus.
     *
     * Sans intervention, le focus pourrait sortir de la modale.
     *
     * On bloque donc le comportement normal
     * et on envoie le focus sur le dernier élément.
     */
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();

    /**
     * Cas 2 :
     * L'utilisateur fait Tab
     * alors que le dernier élément possède le focus.
     *
     * Normalement le focus sortirait de la modale.
     *
     * On bloque ce comportement et on revient
     * au premier élément.
     */
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /**
   * Retourne les éléments focusables visibles
   * présents à l'intérieur de la modale.
   */
  private getFocusable(): HTMLElement[] {
    return Array.from(
      this.el.nativeElement.querySelectorAll<HTMLElement>(
        FOCUSABLE_SELECTOR,
      ),
    ).filter(
      // On conserve uniquement les éléments visibles.
      (element) => element.offsetParent !== null,
    );
  }

  /**
   * Place le focus sur le premier élément focusable.
   *
   * ?.focus() signifie :
   * "si le premier élément existe, donne-lui le focus".
   */
  private focusFirst(): void {
    this.getFocusable()[0]?.focus();
  }
}