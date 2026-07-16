<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')->where('is_active', true);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($category = $request->query('category')) {
            $query->whereHas('category', function ($q) use ($category) {
                $q->where('slug', $category)->orWhere('id', $category);
            });
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $sort = $request->query('sort', 'newest');
        match ($sort) {
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'rating' => $query->orderBy('rating', 'desc'),
            'name' => $query->orderBy('name', 'asc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        $perPage = min((int) $request->query('per_page', 12), 48);
        $products = $query->paginate($perPage);

        return response()->json($products);
    }

    public function adminIndex(Request $request)
    {
        $query = Product::with('category');

        if ($search = $request->query('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        $products = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($products);
    }

    public function show(Product $product)
    {
        if (! $product->is_active && ! request()->user()?->is_admin) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        return response()->json($product->load('category'));
    }

    public function store(Request $request)
    {
        $request->merge([
            'is_featured' => $request->boolean('is_featured'),
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : true,
            'free_shipping' => $request->boolean('free_shipping'),
        ]);

        $data = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'stock' => ['required', 'integer', 'min:0'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'is_featured' => ['boolean'],
            'is_active' => ['boolean'],
            'free_shipping' => ['boolean'],
            'shipping_cost' => ['nullable', 'numeric', 'min:0', 'required_if:free_shipping,false,0'],
            'tax_percent' => ['required', 'numeric', 'min:0', 'max:100'],
            'image' => ['nullable', 'image', 'max:4096'],
            'images' => ['nullable', 'array', 'max:8'],
            'images.*' => ['image', 'max:4096'],
            'image_url' => ['nullable', 'url'],
        ]);

        $slug = Str::slug($data['name']);
        $originalSlug = $slug;
        $counter = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = $originalSlug.'-'.$counter++;
        }

        $gallery = $this->collectUploadedImages($request);

        if (empty($gallery) && ! empty($data['image_url'])) {
            $gallery = [$data['image_url']];
        }

        $freeShipping = (bool) ($data['free_shipping'] ?? false);

        $product = Product::create([
            'category_id' => $data['category_id'],
            'name' => $data['name'],
            'slug' => $slug,
            'description' => $data['description'],
            'price' => $data['price'],
            'discount_percent' => $data['discount_percent'] ?? 0,
            'stock' => $data['stock'],
            'rating' => $data['rating'] ?? 4.5,
            'image' => $gallery[0] ?? null,
            'images' => $gallery,
            'is_featured' => $data['is_featured'] ?? false,
            'is_active' => $data['is_active'] ?? true,
            'free_shipping' => $freeShipping,
            'shipping_cost' => $freeShipping ? 0 : ($data['shipping_cost'] ?? 0),
            'tax_percent' => $data['tax_percent'] ?? 0,
        ]);

        return response()->json($product->load('category'), 201);
    }

    public function update(Request $request, Product $product)
    {
        $request->merge([
            'is_featured' => $request->has('is_featured') ? $request->boolean('is_featured') : $product->is_featured,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : $product->is_active,
            'free_shipping' => $request->has('free_shipping') ? $request->boolean('free_shipping') : $product->free_shipping,
        ]);

        $data = $request->validate([
            'category_id' => ['sometimes', 'exists:categories,id'],
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'discount_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'stock' => ['sometimes', 'integer', 'min:0'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'is_featured' => ['boolean'],
            'is_active' => ['boolean'],
            'free_shipping' => ['boolean'],
            'shipping_cost' => ['nullable', 'numeric', 'min:0', 'required_if:free_shipping,false,0'],
            'tax_percent' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'image' => ['nullable', 'image', 'max:4096'],
            'images' => ['nullable', 'array', 'max:8'],
            'images.*' => ['image', 'max:4096'],
            'image_url' => ['nullable', 'url'],
        ]);

        if (isset($data['name'])) {
            $slug = Str::slug($data['name']);
            $originalSlug = $slug;
            $counter = 1;
            while (Product::where('slug', $slug)->where('id', '!=', $product->id)->exists()) {
                $slug = $originalSlug.'-'.$counter++;
            }
            $data['slug'] = $slug;
        }

        if (array_key_exists('free_shipping', $data) && $data['free_shipping']) {
            $data['shipping_cost'] = 0;
        }

        $gallery = $this->collectUploadedImages($request);

        if (! empty($gallery)) {
            $product->deleteStoredImages();
            $data['images'] = $gallery;
            $data['image'] = $gallery[0];
        } elseif (! empty($data['image_url'])) {
            $product->deleteStoredImages();
            $data['images'] = [$data['image_url']];
            $data['image'] = $data['image_url'];
        }

        unset($data['image_url']);
        $product->update($data);

        return response()->json($product->fresh()->load('category'));
    }

    public function destroy(Product $product)
    {
        $product->deleteStoredImages();
        $product->delete();

        return response()->json(['message' => 'Product deleted.']);
    }

    /**
     * @return list<string>
     */
    private function collectUploadedImages(Request $request): array
    {
        $gallery = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                if ($file && $file->isValid()) {
                    $gallery[] = $file->store('products', 'public');
                }
            }
        }

        // Backward compatible single file field
        if (empty($gallery) && $request->hasFile('image')) {
            $gallery[] = $request->file('image')->store('products', 'public');
        }

        return $gallery;
    }
}
