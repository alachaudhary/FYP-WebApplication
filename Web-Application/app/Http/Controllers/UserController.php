<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    

public function update(Request $request)
{
    $user = Auth::user();

    $request->validate([
        'name' => 'nullable|string|max:255',
        'email' => 'nullable|email|max:255|unique:users,email,' . $user->id,
        'phone' => 'nullable|string|max:15',
        'location' => 'nullable|string|max:150',
        'bio' => 'nullable|string|max:200',
        'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    // ✅ Handle avatar upload
    if ($request->hasFile('avatar')) {
        $avatar = $request->file('avatar');
        $filename = time() . '.' . $avatar->getClientOriginalExtension();

        // Create folder if it doesn't exist
        $destinationPath = public_path('avatars');
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0775, true);
        }

        $avatar->move($destinationPath, $filename);
        $user->avatar = '/avatars/' . $filename;
    }

    // ✅ Update other fields
    $user->fill($request->only(['name', 'email', 'phone', 'location', 'bio']));
    $user->save();

    return response()->json([
        'message' => 'Profile updated successfully',
        'user' => $user
    ]);
}

}

