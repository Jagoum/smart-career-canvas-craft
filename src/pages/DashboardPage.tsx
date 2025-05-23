
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  
  // If user is not authenticated, redirect to login
  if (!isLoading && !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-200px)]">
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/resume/new">
          <Button>Create New Resume</Button>
        </Link>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>My Resumes</CardTitle>
            <CardDescription>Manage your existing resumes</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You haven't created any resumes yet.</p>
          </CardContent>
          <CardFooter>
            <Link to="/resume/new">
              <Button variant="outline">Create Resume</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cover Letters</CardTitle>
            <CardDescription>Manage your cover letters</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You haven't created any cover letters yet.</p>
          </CardContent>
          <CardFooter>
            <Link to="/cover-letter/new">
              <Button variant="outline">Create Cover Letter</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Resume Reviews</CardTitle>
            <CardDescription>Get professional feedback on your resume</CardDescription>
          </CardHeader>
          <CardContent>
            <p>No reviews yet.</p>
          </CardContent>
          <CardFooter>
            <Link to="/resume/review">
              <Button variant="outline">Get Review</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
