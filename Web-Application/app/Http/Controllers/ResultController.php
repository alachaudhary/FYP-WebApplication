<?php

namespace App\Http\Controllers;

use App\Models\Result;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ResultController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        return response()->json(
            Result::where('user_id', $user->id)
                ->latest()
                ->get()
        );
    }

    public function destroy($id)
    {
        try {
            $result = Result::where('user_id', request()->user()->id)
                          ->findOrFail($id);

            Log::info('Deleting result', [
                'result_id' => $id,
                'pdf_path' => $result->pdf_path,
                'user_id' => request()->user()->id
            ]);

            // Delete PDF from storage if exists (using 'public' disk like VideoController)
            if ($result->pdf_path && Storage::disk('public')->exists($result->pdf_path)) {
                $deleted = Storage::disk('public')->delete($result->pdf_path);
                Log::info('PDF deletion result', ['success' => $deleted, 'path' => $result->pdf_path]);
                
                if (!$deleted) {
                    Log::error('PDF deletion failed', ['path' => $result->pdf_path]);
                    throw new \Exception('Failed to delete PDF file');
                }
            }

            // Delete database record
            $result->delete();

            return response()->json([
                'success' => true,
                'message' => 'Report and PDF deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Delete operation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete report: ' . $e->getMessage()
            ], 500);
        }
    }

public function download($id)
{
    try {
        $result = Result::where('user_id', auth()->id())->findOrFail($id);

        if (empty($result->pdf_path)) {
            throw new \Exception('No report exists for this analysis');
        }

        if (!Storage::disk('public')->exists($result->pdf_path)) {
            throw new \Exception('File not found in storage');
        }

        $filePath = storage_path('app/public/' . $result->pdf_path);
        return response()->download($filePath, "report_{$id}.pdf", [
            'Content-Type' => 'application/pdf',
        ]);

    } catch (\Exception $e) {
        Log::error('Download failed: '.$e->getMessage());
        abort(500, 'Failed to download PDF');
    }
}

}
