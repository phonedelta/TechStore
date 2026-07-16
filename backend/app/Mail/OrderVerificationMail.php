<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Order $order,
        public string $verifyUrl
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Verify your TechStore order '.$this->order->order_number,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.orders.verify',
            with: [
                'order' => $this->order,
                'verifyUrl' => $this->verifyUrl,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
