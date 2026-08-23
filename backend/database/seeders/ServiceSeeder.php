<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'libelle' => 'Lavage au kilo',
                'description' => 'Lavage basique en machine pour vêtements courants (au kg).',
                'prix_unitaire' => 1500.00,
                'est_actif' => true,
            ],
            [
                'libelle' => 'Repassage pantalon',
                'description' => 'Repassage professionnel pour pantalons et jeans.',
                'prix_unitaire' => 500.00,
                'est_actif' => true,
            ],
            [
                'libelle' => 'Repassage chemise',
                'description' => 'Repassage soigné sur cintre ou plié.',
                'prix_unitaire' => 600.00,
                'est_actif' => true,
            ],
            [
                'libelle' => 'Nettoyage à sec costume',
                'description' => 'Nettoyage complet veste et pantalon de costume.',
                'prix_unitaire' => 3500.00,
                'est_actif' => true,
            ],
            [
                'libelle' => 'Nettoyage couette grand format',
                'description' => 'Lavage et séchage haute capacité pour couettes et couvertures.',
                'prix_unitaire' => 4000.00,
                'est_actif' => true,
            ],
            [
                'libelle' => 'Teinture vêtement (Archivé)',
                'description' => 'Service de teinture temporairement indisponible.',
                'prix_unitaire' => 2500.00,
                'est_actif' => false,
            ],
        ];

        foreach ($services as $service) {
            Service::firstOrCreate(
                ['libelle' => $service['libelle']],
                $service
            );
        }
    }
}
