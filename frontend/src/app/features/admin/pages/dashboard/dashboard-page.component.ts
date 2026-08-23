// ============================================================
// IMPORTS ANGULAR
// ============================================================

import {
  ChangeDetectionStrategy,
  Component,
  AfterViewInit,
  DestroyRef,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';

// Permet de terminer automatiquement les subscriptions
// lorsque le composant est détruit.
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Modules Angular utilisés dans le template.
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// ============================================================
// SERVICES ET MODELES DE L'APPLICATION
// ============================================================

import { StatService } from '../../services/stat.service';
import { StatMetrics } from '../../../../core/models/stat.model';

// Pipe personnalisé pour afficher les montants en FCFA.
import { CfaCurrencyPipe } from '../../../../shared/pipes/currency-cfa.pipe';

// ============================================================
// CHART.JS
// ============================================================

import { Chart, registerables } from 'chart.js';

// Enregistre tous les composants Chart.js nécessaires.
// Sans cet enregistrement, certains types de graphiques
// peuvent ne pas fonctionner.
Chart.register(...registerables);


// ============================================================
// CONSTANTES
// ============================================================

// Labels utilisés pour représenter les 12 mois de l'année.
const MONTH_LABELS = [
  'Jan',
  'Fév',
  'Mar',
  'Avr',
  'Mai',
  'Juin',
  'Juil',
  'Août',
  'Sep',
  'Oct',
  'Nov',
  'Déc',
];

// Transforme les labels précédents en options utilisables
// dans un select ou un filtre.
// Exemple :
// { value: 1, label: 'Jan' }
// { value: 2, label: 'Fév' }
// ...
const MONTH_OPTIONS = MONTH_LABELS.map((label, index) => ({
  value: index + 1,
  label,
}));


// ============================================================
// INTERFACE LOCALE
// ============================================================

// Structure simplifiée utilisée pour construire
// les données du graphique de revenus.
interface RevenueData {
  labels: string[];
  values: number[];
}


// ============================================================
// COMPOSANT ANGULAR
// ============================================================

@Component({
  selector: 'app-dashboard',

  // Composant standalone :
  // pas besoin de le déclarer dans un NgModule.
  standalone: true,

  // Angular vérifie les changements de manière plus ciblée.
  changeDetection: ChangeDetectionStrategy.OnPush,

  // Fonctionnalités disponibles dans le template.
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CfaCurrencyPipe,
  ],

  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent
  implements OnInit, AfterViewInit, OnDestroy {

  // ==========================================================
  // INJECTION DES DEPENDANCES
  // ==========================================================

  // Service chargé de récupérer les statistiques.
  private statService = inject(StatService);

  // Router utilisé pour naviguer vers d'autres pages.
  private router = inject(Router);

  // Permet de gérer automatiquement la destruction
  // des subscriptions liées au composant.
  private destroyRef = inject(DestroyRef);


  // ==========================================================
  // ETAT REACTIF DU DASHBOARD
  // ==========================================================

  // Contient les statistiques récupérées depuis l'API.
  //
  // Valeur initiale :
  // null = aucune statistique encore disponible.
  stats = signal<StatMetrics | null>(null);

  // Indique si les statistiques sont encore en cours
  // de chargement.
  //
  // true au démarrage.
  isLoading = signal(true);

  // Mois actuellement sélectionné.
  //
  // 'all' = tous les mois.
  // number = un mois précis (1 = janvier, 2 = février, etc.).
  selectedMonth = signal<number | 'all'>('all');

  // Options disponibles pour sélectionner un mois.
  monthOptions = MONTH_OPTIONS;


  // ==========================================================
  // VALEURS CALCULEES
  // ==========================================================

  // Indique s'il existe des données concernant
  // le nombre de tickets par mois.
  //
  // stats() récupère la valeur actuelle du signal stats.
  hasMonthlyData = computed(
    () => !!this.stats()?.tickets_per_month?.length
  );

  // Indique s'il existe des données de revenus
  // par service.
  hasRevenueData = computed(
    () => !!this.stats()?.revenue_by_service?.length
  );


  // ==========================================================
  // REFERENCES VERS LES ELEMENTS HTML
  // ==========================================================

  // Récupère le canvas qui servira au graphique
  // du nombre de tickets par mois.
  //
  // #monthlyChart sera défini dans le HTML.
  @ViewChild('monthlyChart')
  monthlyChartRef!: ElementRef<HTMLCanvasElement>;

  // Récupère le canvas qui servira au graphique
  // des revenus par service.
  @ViewChild('revenueChart')
  revenueChartRef!: ElementRef<HTMLCanvasElement>;


  // ==========================================================
  // INSTANCES CHART.JS
  // ==========================================================

  // Premier graphique :
  // nombre de tickets par mois.
  chart1?: Chart;

  // Deuxième graphique :
  // revenus par service.
  chart2?: Chart;

  // Indique si Angular a terminé l'initialisation de la vue.
  //
  // Important car les canvas référencés avec ViewChild
  // n'existent pas encore dans ngOnInit().
  private viewReady = false;


  // ==========================================================
  // NGONINIT
  // ==========================================================

  ngOnInit() {

    // Demande les statistiques au backend.
    this.statService
      .getStats()

      // Lorsque le composant sera détruit,
      // la subscription sera automatiquement terminée.
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )

      // On s'abonne au résultat.
      .subscribe({

        // Exécuté lorsque les données sont reçues.
        next: (data) => {

          // Stocke les statistiques dans le signal.
          this.stats.set(data);

          // Le chargement est terminé.
          this.isLoading.set(false);

          // Si la vue HTML est déjà disponible,
          // on peut immédiatement construire les graphiques.
          //
          // On ne peut pas toujours le faire dans ngOnInit()
          // car les @ViewChild peuvent ne pas encore être disponibles.
          if (this.viewReady) {
            this.renderCharts(data);
          }
        },
      });
  }


  // ==========================================================
  // AFTERVIEWINIT
  // ==========================================================

  ngAfterViewInit() {

    // À partir de ce moment, les éléments référencés
    // avec @ViewChild sont disponibles.
    this.viewReady = true;

    // Si les statistiques avaient déjà été reçues
    // avant la fin de l'initialisation de la vue,
    // on peut maintenant construire les graphiques.
    if (this.stats()) {
      this.renderCharts(this.stats()!);
    }
  }


  // ==========================================================
  // ONDESTROY
  // ==========================================================

  ngOnDestroy() {

    // Détruit le premier graphique s'il existe.
    //
    // Important pour éviter de laisser une instance Chart.js
    // attachée au canvas après la destruction du composant.
    this.chart1?.destroy();

    // Détruit le deuxième graphique s'il existe.
    this.chart2?.destroy();
  }


  // ==========================================================
  // NAVIGATION
  // ==========================================================

  navigateToTickets() {

    // Navigue vers la page d'administration des tickets.
    this.router.navigate(['/admin/tickets']);
  }


  // ==========================================================
  // CHANGEMENT DU MOIS
  // ==========================================================

  setSelectedMonth(month: number | 'all') {

    // Met à jour le signal selectedMonth.
    this.selectedMonth.set(month);

    // Si les statistiques existent et que le canvas
    // du graphique des revenus existe,
    // on reconstruit le graphique.
    if (this.stats() && this.revenueChartRef) {
      this.renderRevenueChart(this.stats()!);
    }
  }


  // ==========================================================
  // PREPARATION DES DONNEES DU GRAPHIQUE DES REVENUS
  // ==========================================================

  revenueData(data: StatMetrics): RevenueData {

    // Récupère les revenus par service.
    //
    // Si la propriété n'existe pas,
    // on utilise un tableau vide.
    const byService = data.revenue_by_service ?? [];


    // ----------------------------------------------------------
    // CAS 1 : tous les mois
    // ----------------------------------------------------------

    if (this.selectedMonth() === 'all') {

      return {

        // Les labels du graphique sont les noms des services.
        //
        // Exemple :
        // ['Lavage', 'Repassage', 'Séchage']
        labels: byService.map((s) => s.service),

        // Les valeurs correspondent au revenu total
        // de chaque service.
        //
        // Exemple :
        // [100000, 50000, 75000]
        values: byService.map((s) => s.total),
      };
    }


    // ----------------------------------------------------------
    // CAS 2 : un mois précis
    // ----------------------------------------------------------

    const month = this.selectedMonth();

    // Pour chaque service, on cherche les données
    // correspondant au mois sélectionné.
    const entries = byService

      .map((s) => {

        // Cherche dans revenue_by_month l'entrée
        // correspondant au mois demandé.
        const monthData = s.revenue_by_month?.find(
          (m) => m.month === month
        );

        return {
          service: s.service,

          // Si aucune donnée n'est trouvée,
          // on considère que le revenu vaut 0.
          revenue: monthData?.revenue ?? 0,
        };
      })

      // On ne garde que les services qui ont réellement
      // généré un revenu pour ce mois.
      .filter((e) => e.revenue > 0);


    return {

      // Noms des services.
      labels: entries.map((e) => e.service),

      // Revenus correspondants.
      values: entries.map((e) => e.revenue),
    };
  }


  // ==========================================================
  // CREATION / RECREATION DES GRAPHIQUES
  // ==========================================================

  renderCharts(data: StatMetrics) {

    // ----------------------------------------------------------
    // GRAPHIQUE 1 : TICKETS PAR MOIS
    // ----------------------------------------------------------

    // On ne crée le graphique que si :
    // 1. le canvas existe ;
    // 2. les données existent.
    if (
      this.monthlyChartRef &&
      data.tickets_per_month?.length
    ) {

      // Si un ancien graphique existe,
      // on le détruit avant d'en créer un nouveau.
      this.chart1?.destroy();


      // Création du graphique Chart.js.
      this.chart1 = new Chart(
        this.monthlyChartRef.nativeElement,
        {
          // Type du graphique :
          // barres verticales.
          type: 'bar',

          data: {

            // Labels horizontaux.
            //
            // Le backend donne probablement un numéro de mois.
            // Exemple :
            // 1 → Jan
            // 2 → Fév
            labels: data.tickets_per_month.map(
              (m) =>
                MONTH_LABELS[(m.month - 1) % 12] ?? m.month
            ),

            datasets: [
              {
                // Texte associé au dataset.
                label: 'Nombre de tickets',

                // Données affichées.
                data: data.tickets_per_month.map(
                  (m) => m.count
                ),

                // Couleur des barres.
                backgroundColor: '#10B981',

                // Arrondit les coins des barres.
                borderRadius: 8,
              },
            ],
          },


          // ----------------------------------------------------
          // OPTIONS DU GRAPHIQUE
          // ----------------------------------------------------

          options: {

            // Le graphique s'adapte à la largeur
            // de son conteneur.
            responsive: true,

            // Permet de contrôler plus facilement
            // la hauteur du graphique via le conteneur.
            maintainAspectRatio: false,

            plugins: {

              legend: {

                // Cache la légende car un seul dataset
                // est utilisé.
                display: false,
              },
            },

            scales: {

              x: {

                // Style des textes sur l'axe X.
                ticks: {
                  color: '#94A3B8',
                },

                // Pas de grille verticale.
                grid: {
                  display: false,
                },
              },

              y: {

                // Style des nombres sur l'axe Y.
                ticks: {
                  color: '#94A3B8',
                },

                // Couleur de la grille horizontale.
                grid: {
                  color: '#1E293B',
                },
              },
            },
          },
        }
      );
    }


    // ----------------------------------------------------------
    // GRAPHIQUE 2
    // ----------------------------------------------------------

    // Construit également le graphique des revenus.
    this.renderRevenueChart(data);
  }


  // ==========================================================
  // GRAPHIQUE DES REVENUS
  // ==========================================================

  renderRevenueChart(data: StatMetrics) {

    // Si le canvas n'existe pas ou s'il n'y a
    // aucune donnée de revenu, on ne fait rien.
    if (
      !this.revenueChartRef ||
      !data.revenue_by_service?.length
    ) {
      return;
    }


    // Prépare les labels et les valeurs
    // selon le mois sélectionné.
    const revenue = this.revenueData(data);


    // Détruit l'ancien graphique avant d'en créer un nouveau.
    this.chart2?.destroy();


    // Création du graphique.
    this.chart2 = new Chart(
      this.revenueChartRef.nativeElement,
      {
        // Graphique en anneau.
        type: 'doughnut',

        data: {

          // Noms des services.
          labels: revenue.labels,

          datasets: [
            {
              // Montants associés aux services.
              data: revenue.values,

              // Une couleur par portion du graphique.
              backgroundColor: [
                '#10B981',
                '#06B6D4',
                '#6366F1',
                '#F59E0B',
                '#EC4899',
              ],

              // Supprime la bordure autour des portions.
              borderWidth: 0,
            },
          ],
        },


        // ------------------------------------------------------
        // OPTIONS
        // ------------------------------------------------------

        options: {

          // Le graphique s'adapte au conteneur.
          responsive: true,

          // Hauteur contrôlée par le conteneur.
          maintainAspectRatio: false,

          plugins: {

            legend: {

              // Position de la légende.
              position: 'bottom',

              labels: {

                // Couleur du texte de la légende.
                color: '#CBD5E1',

                // Taille du texte.
                font: {
                  size: 11,
                },
              },
            },
          },
        },
      }
    );
  }
}