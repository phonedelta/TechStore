<x-mail::message>
# Confirm your TechStore order

Hi {{ $order->customer_name }},

Thanks for your order **{{ $order->order_number }}** (total **{{ number_format($order->total, 2) }} MAD**).

Click the button below to **verify your order automatically**. After verification, your invoice PDF will be sent to this same email.

<x-mail::button :url="$verifyUrl" color="primary">
Verify my order
</x-mail::button>

Or copy this link into your browser:

{{ $verifyUrl }}

If you did not place this order, you can ignore this message.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
