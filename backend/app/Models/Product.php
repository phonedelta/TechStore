<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'discount_percent',
        'stock',
        'rating',
        'image',
        'images',
        'is_featured',
        'is_active',
        'free_shipping',
        'shipping_cost',
        'tax_percent',
    ];

    protected $appends = ['final_price', 'image_url', 'gallery_urls'];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'discount_percent' => 'decimal:2',
            'rating' => 'decimal:2',
            'shipping_cost' => 'decimal:2',
            'tax_percent' => 'decimal:2',
            'images' => 'array',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'free_shipping' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function getFinalPriceAttribute(): float
    {
        $price = (float) $this->price;
        $discount = (float) $this->discount_percent;

        if ($discount > 0) {
            return round($price * (1 - $discount / 100), 2);
        }

        return $price;
    }

    public function resolveImagePath(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (str_starts_with($path, 'http')) {
            return $path;
        }

        return url(Storage::url($path));
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->resolveImagePath($this->image);
    }

    public function getGalleryUrlsAttribute(): array
    {
        $paths = $this->images;

        if (empty($paths) || ! is_array($paths)) {
            $paths = $this->image ? [$this->image] : [];
        }

        return array_values(array_filter(array_map(
            fn ($path) => $this->resolveImagePath($path),
            $paths
        )));
    }

    public function deleteStoredImages(?array $paths = null): void
    {
        $paths ??= $this->images ?? ($this->image ? [$this->image] : []);

        foreach ($paths as $path) {
            if ($path && ! str_starts_with($path, 'http')) {
                Storage::disk('public')->delete($path);
            }
        }
    }
}
