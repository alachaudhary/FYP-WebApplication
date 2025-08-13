<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::get('/user', fn(Request $request) => $request->user());
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/user/update', [UserController::class, 'update']);

    // Analysis routes
    Route::post('/analyze-video', [VideoController::class, 'analyze']);
    Route::post('/videos/upload', [VideoController::class, 'storeVideo']);
    Route::post('/videos/save-results', [VideoController::class, 'saveResults']);
    
    // Result routes
    Route::get('/results', [ResultController::class, 'index']);
    Route::delete('/results/{result}', [ResultController::class, 'destroy']);
    Route::get('/results/{result}/download', [ResultController::class, 'download']);

    // Admin routes
    Route::prefix('admin')->middleware('admin')->group(function () {
        // Admin profile
        Route::get('/me', [AdminController::class, 'getCurrentAdmin']);

        // User management
        Route::get('/users', [AdminController::class, 'getAllUsers']);
        Route::get('/users/{user}', [AdminController::class, 'getUserDetails']);
        Route::patch('/users/{user}/role', [AdminController::class, 'updateUserRole']);
        Route::delete('/users/{user}', [AdminController::class, 'deleteUser']);

        // User analysis history
        Route::get('/users/{user}/history', [AdminController::class, 'getUserHistory']);
        Route::get('/users/{user}/results/{result}/download', [AdminController::class, 'downloadUserResult']);
    });
});