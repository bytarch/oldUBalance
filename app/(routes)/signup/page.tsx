"use client"; // Add this at the top to make the component a Client Component

import Link from "next/link"
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"

import { useRouter } from "next/navigation"; // Import useRouter for navigation

import Nav from '@/components/nav_reg';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export default function LoginForm() {
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  const [phone, setphone] = useState(""); // State for email
  const [name, setname] = useState(""); // State for password
  const [error, setError] = useState(""); // State for error messages
  const router = useRouter(); // Initialize the router for navigation


  useEffect(() => {
    const auth = async () => {
        try {
            const response = await fetch('/api/auth/session');
            if (!response.ok) {
                throw new Error('Failed to fetch session data');
            }

            const session = await response.json();

            // Role-based redirection
     switch (session.role) {
        case "admin":
          router.push("/admin/dashboard");
          break;
        case "visitee":
          router.push("/visitee/dashboard");
          break;
        case "gate_guard":
          router.push("/gate_guard/dashboard");
          break;
        case "visitors":
          router.push("/visitors/dashboard");
          break;
        default:
          setError("Unknown role, please contact support.");
          break;
        
      }  
        } catch (error) {
            console.error('Error during authentication:', error);
            
        }
    };

    auth(); // Run the authentication logic
}, []); // Empty dependency array to run only once on mount
// Explicitly type the event parameter
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault(); // Prevent the default form submission



  try {
    const response = await fetch("/api/visitor/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, phone, email, password }), // Send email and password as JSON
    });

    if (!response.ok) {
      // Handle errors
      const errorData = await response.json();
      setError(errorData.message || "Signup failed. Please try again."); // Set error message
      return;
    }

    // Handle successful login
    const data = await response.json();
    console.log("Signup successful:", data); // You can handle the response data as needed

    // Role-based redirection
    
    
        
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }), // Send email and password as JSON
          });
    
          if (!response.ok) {
            // Handle errors
            const errorData = await response.json();
            setError(errorData.message || "Login failed. Please try again."); // Set error message
            return;
          }
    
          // Handle successful login
          const data = await response.json();
          console.log("Login successful:", data); // You can handle the response data as needed
    
          router.push("/visitors/dashboard");
        } catch (error) {
          console.error("Error:", error);
          setError("An unexpected error occurred. Please try again.");
        }

  } catch (error) {
    console.error("Error:", error);
    setError("An unexpected error occurred. Please try again.");
  }
};

  return (  <div className="flex min-h-screen w-full flex-col">
    <Nav/>
    <div className="pt-40 flex flex-col items-center justify-center pb-12 space-y-6 text-center">
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
       If your a visitor kindly enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
      <form onSubmit={handleSubmit} className="grid gap-4"> {/* Added form tag */}
          {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
          <div className="grid gap-2">
          <div className="flex items-center">
              <Label htmlFor="name">Full Name</Label>
             
            </div>
            <Input
              id="name"
              type="name"
              placeholder="John Doe"
              required
              value={name} // Bind value to state
              onChange={(e) => setname(e.target.value)} // Update state on change
            />
          </div>
          <div className="grid gap-2">
          <div className="flex items-center">
              <Label htmlFor="email">Email</Label>
             
            </div>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email} // Bind value to state
              onChange={(e) => setEmail(e.target.value)} // Update state on change
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
             
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password} // Bind value to state
              onChange={(e) => setPassword(e.target.value)} // Update state on change
            />
          </div>
          <div className="grid gap-2">
          <div className="flex items-center">
         <Label htmlFor="phone">Phone Number</Label>
             
            </div>
            <Input
              id="phone"
              type="phone"
              placeholder="+501 632-9742"
              required
              value={phone} // Bind value to state
              onChange={(e) => setphone(e.target.value)} // Update state on change
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
    </div>
    </div>
  )
}
