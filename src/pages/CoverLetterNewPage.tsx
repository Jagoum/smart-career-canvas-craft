import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function CoverLetterNewPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-4">Create New Cover Letter</h1>
      <p className="mb-4">This page is under construction. Functionality to generate new cover letters will be implemented here.</p>
      <p className="mb-4">It will interact with the backend endpoint:</p>
      <ul className="list-disc pl-5 mb-4">
        <li><code>POST /api/cover-letter/generate</code></li>
      </ul>
      <Link to="/dashboard">
        <Button variant="outline">Back to Dashboard</Button>
      </Link>
    </div>
  );
}
