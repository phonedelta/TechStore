<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'min:10'],
        ]);

        $message = ContactMessage::create($data);

        return response()->json([
            'message' => 'Thank you! Your message has been sent.',
            'data' => $message,
        ], 201);
    }

    public function index(Request $request)
    {
        $query = ContactMessage::orderBy('created_at', 'desc');

        if ($request->query('unread') === '1') {
            $query->where('is_read', false);
        }

        return response()->json($query->paginate(20));
    }

    public function show(ContactMessage $contact)
    {
        if (! $contact->is_read) {
            $contact->update(['is_read' => true]);
        }

        return response()->json($contact);
    }

    public function markAsRead(ContactMessage $contact)
    {
        $contact->update(['is_read' => true]);

        return response()->json($contact);
    }

    public function destroy(ContactMessage $contact)
    {
        $contact->delete();

        return response()->json(['message' => 'Message deleted.']);
    }
}
