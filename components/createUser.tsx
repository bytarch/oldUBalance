"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define the type for the user creation request
type CreateUserBody = {
  name: string;
  email: string;
  password: string;
  phone?: string; // Optional for guard
  shift_start?: string; // Optional for guard
  shift_end?: string; // Optional for guard
  unit_number?: string; // Optional for visitee
};

export default function CreateUserDialog() {
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [unitNumber, setUnitNumber] = useState(""); // State for unit number
  const [userType, setUserType] = useState("visitor"); // Default user type
  const [phone, setPhone] = useState(""); // Phone number for guard
  const [shiftStart, setShiftStart] = useState(""); // Shift start time for guard
  const [shiftEnd, setShiftEnd] = useState(""); // Shift end time for guard

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission

    // Prepare the body based on user type
    const body: CreateUserBody = {
      name,
      email,
      password,
    };

    if (userType === "visitee") {
      // Add visitee-specific fields
      body.unit_number = unitNumber; // Unit number for visitee
      body.phone = phone; // Phone number for visitee
    } else if (userType === "guard") {
      // Add guard-specific fields
      body.phone = phone; // Phone number for guard
      body.shift_start = shiftStart; // Shift start for guard
      body.shift_end = shiftEnd; // Shift end for guard
    }
    else if (userType === "visitor") {
        // Add guard-specific fields
        body.phone = phone; // Phone number for guard
       
      }
    // API call to create user
    const response = await fetch(`/api/${userType}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      alert("User created successfully");
      // Reset form fields
      setname("");
      setEmail("");
      setPassword("");
      setUnitNumber(""); // Reset unit number
      setUserType("visitor"); // Reset to default
      setPhone(""); // Reset phone number
      setShiftStart(""); // Reset shift start
      setShiftEnd(""); // Reset shift end
    } else {
      alert(`Error: ${data.error}`);
    }
  };
// Function to capitalize the first letter of a string
const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Create a user here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setname(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
              required
            />
          </div>

          {/* Conditionally render the unit number field for visitee */}
          {userType === "visitee" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit_number" className="text-right">
                Unit Number
              </Label>
              <Input
                id="unit_number"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                className="col-span-3"
                required // Required only for visitee
              />
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="userType" className="text-right">
              User Type
            </Label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="col-span-3"
              required
            >
              <option value="visitor">Visitor</option>
              <option value="visitee">Visitee</option>
              <option value="guard">Guard</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {/* Guard-specific fields */}
          {userType === "guard" && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="shift_start" className="text-right">
                  Shift Start
                </Label>
                <Input
                  id="shift_start"
                  type="time"
                  value={shiftStart}
                  onChange={(e) => setShiftStart(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="shift_end" className="text-right">
                  Shift End
                </Label>
                <Input
                  id="shift_end"
                  type="time"
                  value={shiftEnd}
                  onChange={(e) => setShiftEnd(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            </>
          )} {userType === "visitor" && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
             
            </>
          )}
          <DialogFooter>
          <Button type="submit">Add {capitalizeFirstLetter(userType)}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
