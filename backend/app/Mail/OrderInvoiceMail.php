<?php

namespace App\Mail;

use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderInvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your TechStore invoice '.$this->order->order_number,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.orders.invoice',
            with: [
                'order' => $this->order,
            ],
        );
    }

    public function attachments(): array
    {
        try {
            $this->order->loadMissing('items');
            $pdf = Pdf::loadView('pdf.invoice', ['order' => $this->order])
                ->setPaper('a4')
                ->setOption('isRemoteEnabled', false)
                ->setOption('defaultFont', 'DejaVu Sans');

            $binary = $pdf->output();

            return [
                Attachment::fromData(
                    fn () => $binary,
                    'TechStore-Invoice-'.$this->order->order_number.'.pdf'
                )->withMime('application/pdf'),
            ];
        } catch (\Throwable $e) {
            report($e);

            // Still send the HTML invoice email if PDF generation fails.
            return [];
        }
    }
}
