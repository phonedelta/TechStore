<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'customer_name',
        'customer_email',
        'customer_phone',
        'shipping_address',
        'city',
        'country',
        'postal_code',
        'subtotal',
        'shipping_cost',
        'tax',
        'total',
        'payment_method',
        'status',
        'verification_token',
        'email_verified_at',
        'invoice_sent_at',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'shipping_cost' => 'decimal:2',
            'tax' => 'decimal:2',
            'total' => 'decimal:2',
            'email_verified_at' => 'datetime',
            'invoice_sent_at' => 'datetime',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function isEmailVerified(): bool
    {
        return $this->email_verified_at !== null;
    }
}
