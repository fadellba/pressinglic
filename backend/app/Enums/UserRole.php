<?php

namespace App\Enums;

enum UserRole: string
{
    case GESTIONNAIRE = 'gestionnaire';
    case CLIENT = 'client';
}
