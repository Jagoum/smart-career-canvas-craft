
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-xl font-bold">
            ResumeBuilder
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="transition-colors hover:text-foreground/80">
            Home
          </Link>
          <Link to="/templates" className="transition-colors hover:text-foreground/80">
            Templates
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="transition-colors hover:text-foreground/80">
                Dashboard
              </Link>
              <Button variant="outline" onClick={signOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link to="/register">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </nav>
        
        {/* Mobile menu button would go here */}
      </div>
    </header>
  );
}
