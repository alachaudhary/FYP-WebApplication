<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use App\Models\Result;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;

class VideoController extends Controller
{
    public function storeVideo(Request $request)
    {
        $request->validate([
            'video' => 'required|file|mimes:mp4,mov,avi,jpg,jpeg, jfif|max:102400',
        ]);

        $user = $request->user();
        
        // Store video in Laravel storage
        $folder = "uploads/{$user->id}";
        $count = count(Storage::disk('public')->files($folder)) + 1;
        $filename = Str::slug($user->name) . '_' . str_pad($count, 3, '0', STR_PAD_LEFT) . '.' . $request->file('video')->extension();
        $path = $request->file('video')->storeAs($folder, $filename, 'public');

        return response()->json([
            'filename' => $filename,
            'path' => $path,
            'url' => Storage::url($path)
        ]);
    }

    public function saveResults(Request $request)
    {
        $request->validate([
            'filename' => 'required|string',
            'prediction' => 'required|string|in:REAL,FAKE',
            'confidence' => 'required|numeric|between:0,1',
            'frames' => 'required|integer|min:1',
            'processing_time' => 'required|numeric|min:0',
            'lime_image' => 'nullable|string'
        ]);

        $user = $request->user();

        // Generate PDF
        $pdf = Pdf::loadView('pdf.result', [
            'user' => $user,
            'filename' => $request->filename,
            'prediction' => $request->prediction,
            'confidence' => $request->confidence,
            'frames' => $request->frames,
            'processing_time' => $request->processing_time,
        ]);

        $pdfPath = "pdfs/{$user->id}/" . pathinfo($request->filename, PATHINFO_FILENAME) . '.pdf';
        Storage::disk('public')->put($pdfPath, $pdf->output());

        // Save to database
        $result = Result::create([
            'user_id' => $user->id,
            'filename' => $request->filename,
            'prediction' => $request->prediction,
            'confidence' => $request->confidence,
            'frames' => $request->frames,
            'processing_time' => $request->processing_time,
            'pdf_path' => $pdfPath,
            'lime_image' => $request->lime_image,
        ]);

        return response()->json([
            'success' => true,
            'result' => $result,
            'pdf_url' => Storage::url($pdfPath)
        ]);
    }
}