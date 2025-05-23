
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function HomePage() {
  const { data: templateCount } = useQuery({
    queryKey: ['templateCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('resume_templates')
        .select('*', { count: 'exact' });
      
      if (error) throw error;
      return count || 0;
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Create Professional Resumes with AI
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Build stunning, ATS-compliant resumes in minutes with our AI-powered platform. 
                Stand out from the crowd and land your dream job.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/templates">
                <Button size="lg" className="h-12">Browse Templates</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="h-12">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 items-center">
            <div className="flex flex-col justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Powerful Resume Building Features
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Our platform offers everything you need to create the perfect resume.
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg shadow-sm">
                <div className="p-2 bg-primary/10 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">AI-Powered Content</h3>
                <p className="text-gray-500 text-center">
                  Our AI generates professional bullet points and summaries tailored to your experience.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg shadow-sm">
                <div className="p-2 bg-primary/10 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Beautiful Templates</h3>
                <p className="text-gray-500 text-center">
                  Choose from {templateCount || "multiple"} professionally designed templates optimized for ATS.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg shadow-sm">
                <div className="p-2 bg-primary/10 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Export Options</h3>
                <p className="text-gray-500 text-center">
                  Export your resume as a PDF or DOCX file ready to send to employers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                What Our Users Say
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Don't just take our word for it. Here's what job seekers think about our platform.
              </p>
            </div>
          </div>
          <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial cards would go here */}
            <div className="p-6 border rounded-lg shadow-sm bg-background">
              <div className="flex items-start gap-4">
                <div className="space-y-1">
                  <h4 className="font-semibold">Sarah J.</h4>
                  <p className="text-sm text-gray-500">Marketing Professional</p>
                </div>
              </div>
              <p className="mt-4 text-gray-500">
                "This platform helped me craft a perfect resume that highlighted my skills. I received more interview calls in a week than I had in months!"
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm bg-background">
              <div className="flex items-start gap-4">
                <div className="space-y-1">
                  <h4 className="font-semibold">Michael T.</h4>
                  <p className="text-sm text-gray-500">Software Engineer</p>
                </div>
              </div>
              <p className="mt-4 text-gray-500">
                "The AI suggestions were spot on. It helped me articulate my experience in a much more impactful way than I could have done alone."
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm bg-background">
              <div className="flex items-start gap-4">
                <div className="space-y-1">
                  <h4 className="font-semibold">Lisa R.</h4>
                  <p className="text-sm text-gray-500">Recent Graduate</p>
                </div>
              </div>
              <p className="mt-4 text-gray-500">
                "As someone with limited work experience, I was struggling to create a resume. This tool helped me highlight my skills and education perfectly."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Build Your Dream Resume?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Join thousands of job seekers who have found success with our platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg">Get Started Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
