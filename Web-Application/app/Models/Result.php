<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'filename',
        'prediction',
        'confidence',
        'frames',
        'processing_time',
        'pdf_path',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

