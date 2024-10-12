"use client";

import {
  AwaitedReactNode,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Braces,
  Search,
  Users,
  ShieldOff,
  Info,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  Rectangle,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import router, { useRouter } from "next/router";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/switch";

export default function Nav() {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
{/* Use Next.js Image component for the logo */}
<div className="flex items-center gap-2">
  <Image
    src="/gated.png"
    alt="Gated logo"
    width={25} // Specify appropriate width
    height={25} // Specify appropriate height
    className="object-contain" // Ensures the image maintains its aspect ratio
  />
  <span className="text-sm font-medium whitespace-nowrap">Gated Community Tracker</span>
</div>


        </Link>

       
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
               {/* Use Next.js Image component for the logo */}
         {/* Use Next.js Image component for the logo */}
<div className="flex items-center gap-2">
  <Image
    src="/gated.png"
    alt="Gated logo"
    width={25} // Specify appropriate width
    height={25} // Specify appropriate height
    className="object-contain" // Ensures the image maintains its aspect ratio
  />
  <span className="text-sm font-medium whitespace-nowrap">Gated Community Tracker</span>
</div>

            </Link>
           

         
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative"></div>
        </form>
        
        <Button variant="outline">
          <Link href="/login">Log In</Link>
        </Button>
        <Button variant="outline">
          <Link href="/#contact">Contact</Link>
        </Button>
        <Button>
          <Link href="/signup">Sign Up</Link>
        </Button>
        <ModeToggle />
      </div>
    </header>
  );
}
