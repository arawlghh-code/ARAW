import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-8xl md:text-[15vw] font-bold tracking-tighter uppercase leading-none mb-8">404</h1>
      <p className="text-xl font-light opacity-60 mb-12 uppercase tracking-widest">Page Not Found</p>
      <Link to="/" className="inline-block text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:opacity-50 transition-opacity">
        Back to Home
      </Link>
    </div>
  );
}
