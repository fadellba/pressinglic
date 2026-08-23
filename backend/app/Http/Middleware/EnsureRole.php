<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

//EnsureRole sert à vérifier que l'utilisateur connecté possède un rôle autorisé avant de laisser passer la requête.

final class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {

        /*
            $request : la requête HTTP actuelle.
            $next : la fonction qui permet de continuer vers l'étape suivante, généralement le contrôleur.
            $roles : les rôles autorisés.
         
         */

        $user = $request->user();//Récupérer l'utilisateur

        if ($user === null || ! in_array($user->role->value, $roles, true)) {//Vérification du rôle
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        return $next($request);//Si le rôle est correct, la requête peut alors atteindre le middleware suivant ou le contrôleur.
    }
}
