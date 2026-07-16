<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestMailCommand extends Command
{
    protected $signature = 'mail:test {email : Destination email address}';

    protected $description = 'Send a test email to verify SMTP configuration';

    public function handle(): int
    {
        $email = $this->argument('email');

        $this->info('Mailer: '.config('mail.default'));
        $this->info('Host: '.config('mail.mailers.smtp.host'));
        $this->info('From: '.config('mail.from.address'));
        $this->info('Sending test email to '.$email.'...');

        try {
            Mail::raw(
                "TechStore mail test OK.\n\nIf you received this, SMTP is configured correctly.",
                function ($message) use ($email) {
                    $message->to($email)
                        ->subject('TechStore — test email');
                }
            );
            $this->info('Email sent successfully.');

            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error('Failed: '.$e->getMessage());

            return self::FAILURE;
        }
    }
}
