"use client"
import React, { AwaitedReactNode, JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";

import Link from 'next/link';

import {

  Bolt,
  Braces,

  Podcast ,

} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Nav from '@/components/nav_reg';



export default function Homepage() {



  return (
    <div className="flex min-h-screen w-full flex-col">
    <Nav/>
     {/* Main Content */}
     <div className="pt-40 flex flex-col items-center justify-center pb-12 space-y-6 text-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      Luxury homes in a gated community 
    </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
        along the Belize River. Located in the premier area of the Cayo District of BLZ. </p>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <Button asChild>
            <Link href="/login">
              Get Started
            </Link>
          </Button>
          <Button variant="outline">
            <Link href="#learnMore">
              Learn More
            </Link>
          </Button>
        </div>
      </div>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
    

      <div id="learnMore" className="flex items-center justify-center min-h-screen">
  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
    What&apos;s a Gated Community?
  </h1>
  <p className="text-sm text-muted-foreground">  is a residential area that is enclosed by walls or fences, restricting access to the public.</p>
</div>

<div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
  <Card x-chunk="dashboard-01-chunk-4">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">
        <p>Enhanced Security</p>
      </CardTitle>
      <Bolt className="h-4 w-4 " />
    </CardHeader>
    <CardContent>
      <p className="text-xs">
        Gated communities often feature security personnel and controlled access points, ensuring a safe environment for residents.
         </p>
    </CardContent>
  </Card>
  
  <Card x-chunk="dashboard-01-chunk-0">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Private Amenities</CardTitle>
      <div className="h-4 w-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="18">
          <mask height="180" id=":r8:mask0_408_134" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: 'alpha' }}>
            <circle cx="90" cy="90" fill="black" r="90"></circle>
          </mask>
          <g mask="url(#:r8:mask0_408_134)">
            <circle cx="90" cy="90" data-circle="true" fill="black" r="90"></circle>
            <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#:r8:paint0_linear_408_134)"></path>
            <rect fill="url(#:r8:paint1_linear_408_134)" height="72" width="12" x="115" y="54"></rect>
          </g>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id=":r8:paint0_linear_408_134" x1="109" x2="144.5" y1="116.5" y2="160.5">
              <stop stop-color="white"></stop>
              <stop offset="1" stop-color="white" stop-opacity="0"></stop>
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id=":r8:paint1_linear_408_134" x1="121" x2="120.799" y1="54" y2="106.875">
              <stop stop-color="white"></stop>
              <stop offset="1" stop-color="white" stop-opacity="0"></stop>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-xs">
        Residents often enjoy exclusive amenities such as pools, gyms, and parks.
         </p>
    </CardContent>
  </Card>
  
  <Card x-chunk="dashboard-01-chunk-1">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Community Engagement</CardTitle>
      <Podcast className="h-4 w-4 " />
    </CardHeader>
    <CardContent>
      <p className="text-xs">
        Gated communities often organize social events and activities to encourage interaction among residents.
         </p>
    </CardContent>
  </Card>
  
  <Card x-chunk="dashboard-01-chunk-2">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Maintenance Services</CardTitle>
      <Braces className="h-4 w-4 " />
    </CardHeader>
    <CardContent>
      <p className="text-xs">
        Many gated communities offer maintenance services for landscaping and common areas.
         </p>
    </CardContent>
  </Card>
</div>


<div id="solutions" className="flex items-center justify-center min-h-screen">
  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
    How Does It Work? 
  </h1>
  <p className="text-sm text-muted-foreground"> Overview of Features and Functionality</p>
</div>

<div className="grid gap-4 lg:grid-cols-2">
  <Card>
    <CardHeader>
      <CardTitle>How It Works</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        <li><strong>Data Collection:</strong> Staff gather community member progress data through an easy-to-use interface.</li>
        <li><strong>Secure Data Storage:</strong> All data is stored securely and accessible anytime.</li>
        <li><strong>Real-Time Reporting:</strong> Generate instant reports on community progress and engagement.</li>
        <li><strong>Efficient Communication:</strong> Use instant messaging features to connect members and staff quickly.</li>
      </ul>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle>Key Features</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        <li>User management with easy login and account settings.</li>
        <li>Mobile and web access for convenience and flexibility.</li>
        <li>Notifications for updates and announcements to keep members informed.</li>
        <li>Integration capabilities with existing community tools and services.</li>
      </ul>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle>System Requirements</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        <li>Compatible with Chrome, Firefox, and Edge browsers.</li>
        <li>Accessible on desktops, tablets, and mobile devices.</li>
        <li>Requires a stable internet connection for seamless data syncing.</li>
      </ul>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle>Next Steps</CardTitle>
    </CardHeader>
    <CardContent>
      <p>We will evaluate potential solutions based on:</p>
      <ul className="space-y-2">
        <li>User management and ease of use.</li>
        <li>Efficiency in data collection and storage.</li>
        <li>Adherence to budget and timeline constraints.</li>
        <li>Compliance with data privacy regulations.</li>
      </ul>
    </CardContent>
  </Card>
</div>


<div id="contact" className="flex items-center justify-center min-h-screen">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
      Get in touch with us.

</h1>
<p className="text-sm text-muted-foreground"> Using any of the following.</p>
</div>
<div className="grid gap-3 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
<Link href={'#'}>



        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <p>WhatsApp</p>
            </CardTitle>
            
          </CardHeader>
          <CardContent>
        +501 111-1111
       
          </CardContent>
        </Card></Link>
        <Link href={'#'}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium ">Instagram</CardTitle>
           </CardHeader>
          <CardContent>
          
          @ubalance
      
          </CardContent>
        </Card></Link>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email</CardTitle>
           
          </CardHeader>
          <CardContent>
          
          gatedcommunities@ubalance.com
        </CardContent>
        </Card>
        
      </div>
    </main>
    </div>
  );
}


