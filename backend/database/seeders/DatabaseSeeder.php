<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@techstore.com'],
            [
                'name' => 'Admin',
                'password' => 'password',
                'is_admin' => true,
            ]
        );

        $categories = [
            ['name' => 'Smartphones', 'description' => 'Latest smartphones and mobile devices', 'image' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80'],
            ['name' => 'Laptops', 'description' => 'Powerful laptops for work and play', 'image' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80'],
            ['name' => 'USB Flash Drives', 'description' => 'Portable storage solutions', 'image' => 'https://images.unsplash.com/photo-1624823183534-2959db71423c?w=600&q=80'],
            ['name' => 'USB Cables', 'description' => 'Durable charging and data cables', 'image' => 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80'],
            ['name' => 'Chargers', 'description' => 'Fast chargers and power adapters', 'image' => 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80'],
            ['name' => 'Headphones', 'description' => 'Premium audio headphones', 'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'],
            ['name' => 'Keyboards', 'description' => 'Mechanical and wireless keyboards', 'image' => 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80'],
            ['name' => 'Mouse', 'description' => 'Gaming and office mice', 'image' => 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80'],
            ['name' => 'Monitors', 'description' => 'High-resolution displays', 'image' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80'],
            ['name' => 'Smart Watches', 'description' => 'Wearable smart technology', 'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'],
            ['name' => 'Power Banks', 'description' => 'Portable battery packs', 'image' => 'https://images.unsplash.com/photo-1609091839311-b348d03cbb86?w=600&q=80'],
            ['name' => 'Speakers', 'description' => 'Bluetooth and smart speakers', 'image' => 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80'],
            ['name' => 'Computer Accessories', 'description' => 'Essential PC peripherals', 'image' => 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&q=80'],
        ];

        $categoryModels = [];
        foreach ($categories as $cat) {
            $categoryModels[$cat['name']] = Category::updateOrCreate(
                ['slug' => Str::slug($cat['name'])],
                [
                    'name' => $cat['name'],
                    'description' => $cat['description'],
                    'image' => $cat['image'],
                    'is_active' => true,
                ]
            );
        }

        $products = [
            // Smartphones
            ['Smartphones', 'Nova X Pro 5G', 'Flagship 5G smartphone with 6.7" AMOLED display, 256GB storage, and triple camera system.', 899.00, 10, 45, 4.8, true, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'],
            ['Smartphones', 'Pulse Lite 128GB', 'Affordable smartphone with vivid display, long battery life, and dual SIM support.', 299.00, 15, 80, 4.4, true, 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80'],
            ['Smartphones', 'Aero Fold Mini', 'Compact foldable phone with premium hinge design and multitasking features.', 1299.00, 5, 20, 4.6, false, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80'],
            // Laptops
            ['Laptops', 'OrbitBook 15 Ultrabook', 'Slim 15" ultrabook with Intel Core i7, 16GB RAM, 512GB SSD, and all-day battery.', 1199.00, 8, 30, 4.7, true, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80'],
            ['Laptops', 'Forge Gaming 17', 'High-performance gaming laptop with RTX graphics, 32GB RAM, and 144Hz display.', 1899.00, 12, 15, 4.9, true, 'https://images.unsplash.com/photo-1603302576837-37561b2e67cb?w=800&q=80'],
            ['Laptops', 'Studio Pro 14', 'Creator-focused laptop with color-accurate screen and dedicated GPU.', 1499.00, 0, 25, 4.5, false, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'],
            // USB Flash Drives
            ['USB Flash Drives', 'NanoClip 64GB', 'Ultra-compact USB 3.2 flash drive for everyday storage.', 18.99, 0, 200, 4.2, false, 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&q=80'],
            // USB Cables
            ['USB Cables', 'FlexCharge USB-C 2m', 'Braided USB-C to USB-C cable, 100W PD fast charging, 2 meters.', 19.99, 25, 150, 4.5, true, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80'],
            ['USB Cables', 'MagLink Lightning Cable', 'Magnetic tip Lightning cable with tangle-free design.', 24.99, 15, 90, 4.1, false, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
            ['USB Cables', 'MultiHub 3-in-1 Cable', 'USB-C / Lightning / Micro-USB combo cable for all devices.', 16.99, 30, 110, 4.0, false, 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&q=80'],
            // Chargers
            ['Chargers', 'TurboCharge 65W GaN', 'Compact GaN charger with dual USB-C ports and 65W output.', 49.99, 18, 75, 4.7, true, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80'],
            ['Chargers', 'DeskDock Wireless Stand', '15W wireless charging stand with phone cradle.', 39.99, 10, 55, 4.4, false, 'https://images.unsplash.com/photo-1591290619762-c588f6ccbf55?w=800&q=80'],
            ['Chargers', 'TravelPack 45W Duo', 'Dual-port travel charger with foldable prongs.', 34.99, 0, 100, 4.3, false, 'https://images.unsplash.com/photo-1609091839311-b348d03cbb86?w=800&q=80'],
            // Headphones
            ['Headphones', 'Aether ANC Over-Ear', 'Noise-cancelling over-ear headphones with 40h battery and Hi-Res audio.', 249.00, 20, 40, 4.8, true, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
            ['Headphones', 'BeatBuds Pro Wireless', 'True wireless earbuds with spatial audio and IPX5 rating.', 129.00, 15, 85, 4.6, true, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'],
            ['Headphones', 'Studio Monitor X200', 'Open-back studio headphones for accurate mixing.', 179.00, 5, 35, 4.5, false, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80'],
            // Keyboards
            ['Keyboards', 'KeyForge TKL Mechanical', 'Tenkeyless mechanical keyboard with hot-swap switches and RGB.', 109.00, 12, 50, 4.7, true, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80'],
            ['Keyboards', 'SlimType Wireless Quiet', 'Low-profile wireless keyboard with quiet keys for offices.', 69.99, 0, 70, 4.3, false, 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80'],
            ['Keyboards', 'MacroPad Pro 12', 'Programmable 12-key macropad with OLED display.', 89.00, 8, 8, 4.4, false, 'https://images.unsplash.com/photo-1618384887929-16ec33cab9ef?w=800&q=80'],
            // Mouse
            ['Mouse', 'Precision Pro Wireless', 'Ergonomic wireless mouse with 16K DPI sensor.', 79.99, 15, 65, 4.6, true, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80'],
            ['Mouse', 'Glide Gaming RGB', 'Lightweight gaming mouse with customizable RGB and 8 buttons.', 59.99, 10, 90, 4.5, false, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80'],
            ['Mouse', 'OfficeTrack Silent', 'Silent-click Bluetooth mouse for quiet workspaces.', 29.99, 20, 5, 4.2, false, 'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=800&q=80'],
            // Monitors
            ['Monitors', 'Clarity 27" 4K IPS', '27-inch 4K IPS monitor with USB-C hub and 99% sRGB.', 449.00, 10, 28, 4.8, true, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80'],
            ['Monitors', 'RaceCurve 32" 165Hz', '32-inch curved gaming monitor, 165Hz, 1ms response.', 399.00, 8, 22, 4.7, true, 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=800&q=80'],
            ['Monitors', 'WorkView 24" FHD', '24-inch Full HD monitor with blue-light filter.', 159.00, 0, 40, 4.3, false, 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&q=80'],
            // Smart Watches
            ['Smart Watches', 'PulseWatch Ultra', 'Premium smartwatch with GPS, SpO2, and 7-day battery.', 349.00, 12, 38, 4.7, true, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
            ['Smart Watches', 'FitBand Active 3', 'Fitness tracker with heart-rate monitoring and sleep tracking.', 79.99, 20, 95, 4.4, false, 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80'],
            ['Smart Watches', 'Chrono Hybrid Classic', 'Hybrid smartwatch with analog dials and smart notifications.', 199.00, 5, 30, 4.5, false, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80'],
            // Power Banks
            ['Power Banks', 'PowerCore 20000mAh', 'High-capacity power bank with 65W USB-C PD output.', 59.99, 15, 70, 4.6, true, 'https://images.unsplash.com/photo-1609091839311-b348d03cbb86?w=800&q=80'],
            ['Power Banks', 'SlimCharge 10000mAh', 'Ultra-slim 10,000mAh power bank for travel.', 34.99, 10, 110, 4.3, false, 'https://images.unsplash.com/photo-1624823183534-2959db71423c?w=800&q=80'],
            ['Power Banks', 'SolarPack Outdoor 25K', 'Rugged solar power bank for outdoor adventures.', 89.99, 0, 9, 4.2, false, 'https://images.unsplash.com/photo-1591290619762-c588f6ccbf55?w=800&q=80'],
            // Speakers
            ['Speakers', 'BoomBox Portable XL', 'Waterproof Bluetooth speaker with 24h playtime and deep bass.', 129.00, 18, 48, 4.7, true, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80'],
            ['Speakers', 'DeskBar Stereo Mini', 'Compact stereo desktop speakers with USB power.', 49.99, 10, 60, 4.3, false, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80'],
            ['Speakers', 'HomePod Sphere Smart', 'Smart speaker with voice assistant and 360° sound.', 199.00, 8, 25, 4.5, false, 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&q=80'],
            // Computer Accessories
            ['Computer Accessories', 'USB-C Hub 7-in-1', 'Aluminum USB-C hub with HDMI, SD, and Ethernet ports.', 54.99, 15, 80, 4.6, true, 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80'],
            ['Computer Accessories', 'Laptop Stand Elevate', 'Adjustable aluminum laptop stand for better ergonomics.', 39.99, 20, 55, 4.5, false, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80'],
            ['Computer Accessories', 'Webcam HD Pro 1080p', 'Full HD webcam with auto-focus and dual mics.', 69.99, 10, 42, 4.4, false, 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800&q=80'],
            ['Computer Accessories', 'CoolPad Exhaust Pro', 'Laptop cooling pad with dual fans and RGB lighting.', 32.99, 25, 7, 4.1, false, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80'],
        ];

        foreach ($products as [$catName, $name, $description, $price, $discount, $stock, $rating, $featured, $image]) {
            $slug = Str::slug($name);
            Product::updateOrCreate(
                ['slug' => $slug],
                [
                    'category_id' => $categoryModels[$catName]->id,
                    'name' => $name,
                    'description' => $description,
                    'price' => $price,
                    'discount_percent' => $discount,
                    'stock' => $stock,
                    'rating' => $rating,
                    'image' => $image,
                    'is_featured' => $featured,
                    'is_active' => true,
                ]
            );
        }
    }
}
