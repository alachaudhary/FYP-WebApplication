<?php
use Laravel\Sanctum\Sanctum;


return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', '')),

    // Only needed for session/cookie auth — not used in token auth
    'guard' => [],

    'expiration' => null,
];

