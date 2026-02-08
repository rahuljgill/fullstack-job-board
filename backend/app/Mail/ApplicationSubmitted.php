<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Application;
use App\Models\User;


class ApplicationSubmitted extends Mailable
{
    use Queueable, SerializesModels;

    public $application;
    public $user;

    public function __construct(Application $application, User $user)
    {
        $this->application = $application;
        $this->user = $user;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Application Submitted - ' . $this->application->job->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.application-submitted',
        );
    }
}
