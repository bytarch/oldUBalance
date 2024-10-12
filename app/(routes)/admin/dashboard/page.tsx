'use client';
import Image from "next/image"
import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  DollarSign,
  CreditCard,
  Users, File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
} from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Input } from "@/components/ui/input"
  import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

  import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import Nav from '@/components/nav';
import { useRouter, usePathname } from 'next/navigation';
import CreateUserDialog from '@/components/createUser';
import { Guard, Visitee, Appointments, Admin, Visitor, convertToBelizeTime } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
const ITEMS_PER_PAGE = 3;


export default function Dashboard() {
  const pathname = usePathname();
  const router = useRouter();

  const [Role, setRole] = useState<string>(''); 
  const [Title, setTitle] = useState<string>(''); 
  const [guards, setGuards] = useState<Guard[]>([]); 
  const [visitees, setVisitees] = useState<Visitee[]>([]); 
  const [appointments, setAppointments] = useState<Appointments[]>([]); 
  const [admins, setAdmins] = useState<Admin[]>([]); 
  const [visitor, setVisitor] = useState<Visitor[]>([]); 
  
   // State to control dialog visibility
   const [dialogOpen, setDialogOpen] = useState(false);
   const [selectedAppointment, setSelectedAppointment] = useState<Appointments | null>(null);




  // State to hold previous counts
  const [previousGuardCount, setPreviousGuardCount] = useState<number>(0);
  const [previousVisiteeCount, setPreviousVisiteeCount] = useState<number>(0);
  const [previousAppointmentCount, setPreviousAppointmentCount] = useState<number>(0);
  const [previousAdminCount, setPreviousAdminCount] = useState<number>(0);
  
  // Pagination state
  const [currentGuardPage, setCurrentGuardPage] = useState(0);
  const [currentVisiteePage, setCurrentVisiteePage] = useState(0);
  const [currentVisitorsPage, setCurrentVisitorsPage] = useState(0);
  
  useEffect(() => {
    if (pathname) {
      let role = pathname.split('/')[1];
      setRole(role);
      role = role.charAt(0).toUpperCase() + role.slice(1);
      setTitle(role);
    }
  }, [pathname]);

  useEffect(() => {
    const auth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const session = await response.json();
  
       // If the user session is not "admin", redirect to login
       if (session.role !== "admin") {  // assuming session object contains a role field
        window.location.href = "/login";
        return; // Ensure no further execution after redirect
      }
  
        // User is authenticated, fetch other data
        fetchvisitor();
        fetchadmins();
        fetchAppointments();
        fetchVisitees();
        fetchGuards();
  
      } catch (error) {
        console.error('Error during authentication:', error);
        window.location.href = "/login"; // Redirect if there's an error
      }
    };
  
    auth(); // Run the authentication logic
  
    // We ensure the auth logic is completed first before calling other fetches
  
  }, []); // Empty dependency array to run only once on mount
  

  const fetchGuards = async () => {
    try {
      const response = await fetch('/api/guard');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data: Guard[] = await response.json();
      setGuards(data);

      // Calculate previous guard count based on created_at
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1); // Get yesterday's date
      const previousCount = data.filter((guard: Guard) => new Date(guard.created_at) < yesterday).length;
      setPreviousGuardCount(previousCount);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVisitees = async () => {
    try {
      const response = await fetch('/api/visitee');
      if (!response.ok) {
        throw new Error('Failed to fetch visitees');
      }
      const data: Visitee[] = await response.json();
      setVisitees(data);

      // Calculate previous visitee count based on created_at
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1); // Get yesterday's date
      const previousCount = data.filter((visitee: Visitee) => new Date(visitee.created_at) < yesterday).length;
      setPreviousVisiteeCount(previousCount);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data: Appointments[] = await response.json();
      setAppointments(data);

      // Calculate previous appointment count based on created_at
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1); // Get yesterday's date
      const previousCount = data.filter((appointment: Appointments) => new Date(appointment.created_at) < yesterday).length;
      setPreviousAppointmentCount(previousCount);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchadmins = async () => {
      try {
        const response = await fetch('/api/admin');
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data: Admin[] = await response.json();
        setAdmins(data);

        // Calculate previous appointment count based on created_at
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // Get yesterday's date
        const previousCount = data.filter((admins: Admin) => new Date(admins.created_at) < yesterday).length;
        setPreviousAdminCount(previousCount);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchvisitor= async () => {
        try {
          const response = await fetch('/api/visitor');
          if (!response.ok) {
            throw new Error('Failed to fetch visitor');
          }
          const data: Visitor[] = await response.json();
          setVisitor(data);
  
          
        } catch (error) {
          console.error(error);
        }
      };
  const handleGuardPageChange = (direction: 'next' | 'prev') => {
    setCurrentGuardPage(prev => (direction === 'next' ? prev + 1 : prev - 1));
  };

  const handleVisiteePageChange = (direction: 'next' | 'prev') => {
    setCurrentVisiteePage(prev => (direction === 'next' ? prev + 1 : prev - 1));
  };
  const handleVisitorsPageChange = (direction: 'next' | 'prev') => {
    setCurrentVisitorsPage(prev => (direction === 'next' ? prev + 1 : prev - 1));
  };
  // Calculate percentage change
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0; // Avoid division by zero
    return ((current - previous) / previous) * 100;
  };

  const guardPercentageChange = calculatePercentageChange(guards.length, previousGuardCount);
  const visiteePercentageChange = calculatePercentageChange(visitees.length, previousVisiteeCount);
  const appointmentPercentageChange = calculatePercentageChange(appointments.length, previousAppointmentCount);
  const adminPerchantageChange = calculatePercentageChange(admins.length, previousAdminCount);
  // Guard data for the current page
  const paginatedGuards = guards.slice(
    currentGuardPage * ITEMS_PER_PAGE,
    (currentGuardPage + 1) * ITEMS_PER_PAGE
  );
  // Visitee data for the current page
  const paginatedVisitors = visitor.slice(
    currentVisiteePage * ITEMS_PER_PAGE,
    (currentVisiteePage + 1) * ITEMS_PER_PAGE
  );
  // Visitee data for the current page
  const paginatedVisitees = visitees.slice(
    currentVisiteePage * ITEMS_PER_PAGE,
    (currentVisiteePage + 1) * ITEMS_PER_PAGE
  );
  const handleDeleteGuard = async (guardId: number) => {
    const confirmed = confirm('Are you sure you want to delete this guard?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/guard/${guardId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete guard');
      }

      setGuards(prevGuards => prevGuards.filter(guard => guard.guard_id !== guardId));
      alert('Guard deleted successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to delete guard');
    }
  };

  const handleDeleteVisitee = async (visiteeId: number) => {
    const confirmed = confirm('Are you sure you want to delete this resident?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/visitee/${visiteeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete resident');
      }

      setVisitees(prevVisitees => prevVisitees.filter(visitee => visitee.visitee_id !== visiteeId));
      alert('Resident deleted successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to delete resident');
    }
  };
  const handleEditGuard = async (guard: Guard) => {
    // Confirm editing the guard's profile
    const confirmed = window.confirm(`Editing ${guard.name}'s Profile. Do you want to continue?`);
    if (!confirmed) return;
  
    // Get new values from the user
    const newName = window.prompt("Enter new name:", guard.name);
    const newEmail = window.prompt("Enter new email:", guard.email);
    const newPhone = window.prompt("Enter new phone number:", guard.phone);
    const newShiftStart = window.prompt("Enter new shift start time (YYYY-MM-DDTHH:MM:SS):", guard.shift_start);
    const newShiftEnd = window.prompt("Enter new shift end time (YYYY-MM-DDTHH:MM:SS):", guard.shift_end);
  
    // Validate user input
    if (!newName || !newEmail || !newPhone || !newShiftStart || !newShiftEnd) {
      alert("All fields must be filled out.");
      return;
    }
  
    // Prepare the updated guard data
    const updatedGuardData = {
      name: newName,
      email: newEmail,
      phone: newPhone,
      shift_start: newShiftStart,
      shift_end: newShiftEnd,
    };
  
    // Send the updated data to the server
    try {
      const response = await fetch(`/api/guard/${guard.guard_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGuardData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update guard profile');
      }
  
      alert('Guard profile updated successfully');
      // Optionally refresh the guards list or update the local state
      // setGuards(prevGuards => prevGuards.map(g => g.guard_id === guard.guard_id ? updatedGuardData : g));
      fetchGuards();
    } catch (error) {
      console.error(error);
    //  alert(error.message);
    }
  };
  const handleEditResidents = async (visitee: Visitee) => {
    // Confirm editing the visitee's profile
    const confirmed = window.confirm(`Editing ${visitee.name}'s Profile. Do you want to continue?`);
    if (!confirmed) return;

    // Get new values from the user
    const newName = window.prompt("Enter new name:", visitee.name);
    const newEmail = window.prompt("Enter new email:", visitee.email);
    const newPhone = window.prompt("Enter new phone number:", visitee.phone);
    const newUnitNumber = window.prompt("Enter new unit number:", visitee.unit_number); // Added unit_number prompt

    // Validate user input
    if (!newName || !newEmail || !newPhone || !newUnitNumber) {
        alert("All fields must be filled out.");
        return;
    }

    // Prepare the updated visitee data
    const updatedVisiteeData = {
        name: newName,
        email: newEmail,
        phone: newPhone,
        unit_number: newUnitNumber, // Include the new unit number
    };

    // Send the updated data to the server
    try {
        const response = await fetch(`/api/visitee/${visitee.visitee_id}`, { // Change endpoint to match `visitee_id`
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedVisiteeData),
        });

        if (!response.ok) {
            throw new Error('Failed to update visitee profile');
        }

        alert('Visitee profile updated successfully');
        // Optionally refresh the visitees list or update the local state
        // setVisitees(prevVisitees => prevVisitees.map(v => v.visitee_id === visitee.visitee_id ? updatedVisiteeData : v));
        fetchVisitees();
    } catch (error) {
        console.error(error);
       // alert(error.message); // Optionally display the error message to the user
    }
};

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Nav />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        
        {Role === 'admin' && (
          <div className="mb-4">
            <CreateUserDialog />
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Guards</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{guards.length}</div>
              <p className="text-xs text-muted-foreground">
                {guardPercentageChange.toFixed(1)}% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Residents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visitees.length}</div>
              <p className="text-xs text-muted-foreground">
                {visiteePercentageChange.toFixed(1)}% from yesterday
              </p>
            </CardContent>
          </Card>

       
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{admins.length}</div>
              <p className="text-xs text-muted-foreground">
                {adminPerchantageChange.toFixed(1)}% from yesterday
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
              <p className="text-xs text-muted-foreground">
                {appointmentPercentageChange.toFixed(1)}% from yesterday
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold">Guards</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Shift Start</TableHead>
            <TableHead>Shift End</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedGuards.map(guard => (
            <TableRow key={guard.guard_id}>
              <TableCell>
                <Link href={`/guard/${guard.guard_id}`}>
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarFallback>G</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{guard.name}</div>
                  </div>
                </Link>
              </TableCell>
              <TableCell>{guard.email}</TableCell>
              <TableCell>{guard.phone}</TableCell>
              <TableCell>{convertToBelizeTime(guard.shift_start)}</TableCell>
              <TableCell>{convertToBelizeTime(guard.shift_end)}</TableCell>
              <TableCell>
               
              <Button
            onClick={() => handleEditGuard(guard)} // Use the constant function here
            variant="outline"
            className="mr-2"
          >
            Edit
          </Button>
                <Button variant="destructive" onClick={() => handleDeleteGuard(guard.guard_id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

        <div className="flex justify-between">
          <Button onClick={() => handleGuardPageChange('prev')} disabled={currentGuardPage === 0}>
            Previous
          </Button>
          <Button
            onClick={() => handleGuardPageChange('next')}
            disabled={currentGuardPage + 1 >= Math.ceil(guards.length / ITEMS_PER_PAGE)}
          >
            Next
          </Button>
        </div>

       {/* Similar implementation for Residents */}
      <h2 className="text-2xl font-bold">Residents</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Unit Number</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedVisitees.map(visitee => (
            <TableRow key={visitee.visitee_id}>
              <TableCell>
                <div className="font-medium">{visitee.name}</div>
              </TableCell>
              <TableCell>{visitee.unit_number}</TableCell>
              <TableCell>{visitee.email}</TableCell>
              <TableCell>{visitee.phone}</TableCell>
              <TableCell>
              <Button
            onClick={() => handleEditResidents(visitee)} // Use the constant function here
            variant="outline"
            className="mr-2"
          >
            Edit
          </Button>
                <Button variant="destructive" onClick={() => handleDeleteVisitee(visitee.visitee_id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination controls */}
      <div className="flex justify-between">
        <Button onClick={() => handleVisiteePageChange('prev')} disabled={currentVisiteePage === 0}>
          Previous
        </Button>
        <Button
          onClick={() => handleVisiteePageChange('next')}
          disabled={currentVisiteePage + 1 >= Math.ceil(guards.length / ITEMS_PER_PAGE)}
        >
          Next
        </Button>
      </div>
      {/* Similar implementation for Residents */}
      <h2 className="text-2xl font-bold">Visitors</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visitor.map(visitor => (
            <TableRow key={visitor.visitor_id}>
              <TableCell>
                <div className="font-medium">{visitor.name}</div>
              </TableCell>
              <TableCell>{visitor.email}</TableCell>
              <TableCell>{visitor.phone}</TableCell>
              <TableCell>
             
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

     
      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                     {/* Appointments Table Card */}
  <Card className="w-full mx-auto mb-0"> {/* Removed max width and added full width */}
    <CardHeader>
      <CardTitle>Appointments</CardTitle>
      <CardDescription>Appointments made throughout the years.</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">
              <span className="sr-only">QR Code</span>
            </TableHead>
            <TableHead>Vistor</TableHead>
            <TableHead>Visiting</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {appointments.map((appointment) => (
                    <TableRow key={appointment.appointment_id}>
                        <TableCell className="hidden sm:table-cell">
                            <img
                                alt={`QR Code for ${appointment.qr_code}`}
                                className="aspect-square rounded-md object-cover"
                                height="64"
                                src={appointment.qr_code} // Assuming QR codes are stored in this path
                                width="64"
                            />
                        </TableCell>
                        <TableCell className="font-medium">{appointment.visitor_name}</TableCell>
                        <TableCell className="font-medium">{appointment.visitee_name}</TableCell>
                        <TableCell>{new Date(appointment.appointment_date).toLocaleString()}</TableCell>
                        <TableCell>{new Date(appointment.valid_until).toLocaleString()}</TableCell>
                        <TableCell>
                            <Badge variant={appointment.status === "confirmed" ? "outline" : "secondary"}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </Badge>
                        </TableCell>
                        <TableCell>
                        <Dialog>
                                        <DialogTrigger asChild>
                                            <Button onClick={() => setSelectedAppointment(appointment)}>View</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Appointment Details</DialogTitle>
                                                <DialogDescription>
                                                    View the details of your selected appointment.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                {selectedAppointment && (
                                                    <>
                                                        <div className="flex items-center">
                                                            <img
                                                                alt={`QR Code for ${selectedAppointment.qr_code}`}
                                                                className="aspect-square rounded-md object-cover"
                                                                height="128" // Adjust height as needed
                                                                width="128" // Adjust width as needed
                                                                src={selectedAppointment.qr_code} // Display the selected QR code
                                                            />
                                                            <div className="ml-4">
                                                            <p className="font-medium">Vistor: {selectedAppointment.visitor_name}</p>
                                                                <p className="font-medium">Visitee: {selectedAppointment.visitee_name}</p>
                                                                <p>Date: {new Date(selectedAppointment.appointment_date).toLocaleString()}</p>
                                                                <p>Valid Until: {new Date(selectedAppointment.valid_until).toLocaleString()}</p>
                                                                <p>Status: {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}</p>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                          
                                        </DialogContent>
                                    </Dialog>
                        </TableCell>
                    </TableRow>
                ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
                </div>

      </main>
    </div>
  );
}
