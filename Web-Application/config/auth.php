<?php
return [
    'defaults' => [
        'guard' => 'api', // Use Sanctum for API authentication
        'passwords' => 'users',
    ],

   // 'guards' => [
    //    'web' => [
    //        'driver' => 'session', // Use 'session' for web authentication
     //       'provider' => 'users',
     //   ],

       // 'sanctum' => [
       //     'driver' => 'sanctum', // Use 'sanctum' driver for API authentication
       //     'provider' => 'users',
       // ],
  //  ],
    'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],

    'api' => [
        'driver' => 'sanctum', // Sanctum works here
        'provider' => 'users',
             
    ],
],

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\User::class,
        ],
    ],

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => 'password_reset_tokens',
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => 10800,
];
