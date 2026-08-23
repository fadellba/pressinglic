<?php

namespace App\Enums;

enum PaymentMode: string
{
    case ESPECES = 'especes';
    case CARTE = 'carte';
}
