<?php

return [

    'paths' => ['api/*', 'login', 'logout', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // IMPORTANT: React runs at localhost:5173 — allow that explicitly
    'allowed_origins' => ['http://localhost:5173', 'http://127.0.0.1:5173'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    // Keep this to expose token header if needed (optional)
    'exposed_headers' => ['Authorization', 'Content-Type'],

    'max_age' => 0,

    // For token-based API (like you're using): keep this FALSE
    'supports_credentials' => false,
];
