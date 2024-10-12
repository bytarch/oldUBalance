"use client";
import React from 'react';

export default function ErrorPage({Message}:any) {


  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-white p-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">{Message}</h1>
        <p className="text-lg text-gray-700 mb-6">
          Something went wrong.
        </p>
       
      </div>
    </div>
  );
}
