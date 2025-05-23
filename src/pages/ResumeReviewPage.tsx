import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function ResumeReviewPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-4">Review Resume</h1>
      <p className="mb-4">This page is under construction. Functionality to submit your resume for AI review will be implemented here.</p>
      <p className="mb-4">It will interact with the backend endpoint:</p>
      <ul className="list-disc pl-5 mb-4">
        <li><code>POST /api/resume/review</code></li>
      </ul>
      <Link to="/dashboard">
        <Button variant="outline">Back to Dashboard</Button>
      </Link>
    </div>
  );
}
