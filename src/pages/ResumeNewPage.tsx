import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function ResumeNewPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-4">Create New Resume</h1>
      <p className="mb-4">This page is under construction. Functionality to create and generate new resumes will be implemented here.</p>
      <p className="mb-4">It will interact with backend endpoints like:</p>
      <ul className="list-disc pl-5 mb-4">
        <li><code>POST /api/resume/generate</code> (for AI generation)</li>
        <li><code>POST /api/resume/save</code> (to save the resume)</li>
      </ul>
      <Link to="/dashboard">
        <Button variant="outline">Back to Dashboard</Button>
      </Link>
    </div>
  );
}
