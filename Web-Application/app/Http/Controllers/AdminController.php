<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Result;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminController extends Controller
{
    /**
     * Get current admin profile
     */
    public function getCurrentAdmin()
    {
        $admin = Auth::user();
        
        return response()->json([
            'id' => $admin->id,
            'name' => $admin->name,
            'email' => $admin->email,
            'role' => $admin->role,
            'avatar' => $admin->avatar_url,
            'created_at' => $admin->created_at
        ]);
    }

    /**
     * Get paginated list of users
     */
    public function getAllUsers(Request $request)
    {
        $request->validate([
            'per_page' => 'sometimes|integer|min:1|max:100',
            'search' => 'sometimes|string|max:255'
        ]);

        $query = User::where('id', '!=', Auth::id())
            ->withCount('results');

        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
            });
        }
        
        return response()->json(
            $query->orderBy('created_at', 'desc')
                 ->paginate($request->input('per_page', 15))
        );
    }

    /**
     * Get single user details with statistics
     */
    public function getUserDetails(User $user)
    {
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar' => $user->avatar_url,
                'created_at' => $user->created_at,
                'stats' => [
                    'total_analysis' => $user->results()->count(),
                    'last_analysis' => $user->results()->latest()->first()?->created_at
                ]
            ]
        ]);
    }

    /**
     * Update user role
     */
    public function updateUserRole(Request $request, User $user)
    {
        if ($user->id === Auth::id()) {
            return response()->json(['message' => 'Cannot modify your own role'], 403);
        }

        $validated = $request->validate([
            'role' => ['required', Rule::in(['admin', 'user'])]
        ]);

        $user->update(['role' => $validated['role']]);
        
        return response()->json([
            'message' => 'Role updated successfully',
            'user' => $user->only(['id', 'name', 'email', 'role'])
        ]);
    }

    /**
     * Delete user and associated data
     */
    public function deleteUser(User $user)
    {
        if ($user->id === Auth::id()) {
            return response()->json(['message' => 'Cannot delete yourself'], 403);
        }

        $user->results()->each(function (Result $result) {
            if ($result->pdf_path && Storage::disk('public')->exists($result->pdf_path)) {
                Storage::disk('public')->delete($result->pdf_path);
            }
        });

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    /**
     * Get user analysis history
     */
    public function getUserHistory(User $user)
    {
        $history = $user->results()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function (Result $result) {
                return $result->only([
                    'id',
                    'filename',
                    'prediction',
                    'confidence',
                    'frames',
                    'processing_time',
                    'created_at',
                    'pdf_path'
                ]);
            });

        return response()->json([
            'user' => $user->only(['id', 'name', 'email', 'role']),
            'history' => $history
        ]);
    }

    /**
     * Download analysis result PDF
     */
    public function downloadUserResult(User $user, $resultId): StreamedResponse
    {
        $result = Result::where('user_id', $user->id)
            ->findOrFail($resultId);

        if (empty($result->pdf_path)) {
            abort(404, 'No report exists for this analysis');
        }

        if (!Storage::disk('public')->exists($result->pdf_path)) {
            abort(404, 'File not found in storage');
        }

        return Storage::disk('public')->download(
            $result->pdf_path,
            "report_{$result->filename}.pdf",
            ['Content-Type' => 'application/pdf']
        );
    }
}