import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react'

function Content() {
    return (
        <div className="bg-white h-screen flex flex-col justify-center items-center">
          <h1 className="text-primary text-4xl font-bold mb-4">
            Welcome to the AI Mock Interview Platform
          </h1>
          <p className="text-gray-700 text-lg mb-8">
            Practice and enhance your interview skills with AI-driven mock interviews.
          </p>
          <Link href={"/dashboard"}>
            <Button>Get Started</Button>
          </Link>
        </div>
      );
}

export default Content
