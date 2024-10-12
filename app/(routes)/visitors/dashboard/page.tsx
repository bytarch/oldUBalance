'use client';
import Image from "next/image";
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  MoreVertical,
  Truck,
  CreditCard,
  Users,
  File,
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
} from "@/components/ui/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import Nav from '@/components/nav';
import { useRouter, usePathname } from 'next/navigation';
import CreateUserDialog from '@/components/createUser';
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {  Visitee, Appointments,convertToBelizeTime } from '@/lib/types';

const ITEMS_PER_PAGE = 3;

const Dashboard = () => {
    const pathname = usePathname();
    const router = useRouter();

    const [Role, setRole] = useState<string>(''); 
    const [Title, setTitle] = useState<string>(''); 
    const [visitees, setVisitees] = useState<Visitee[]>([]); 
    const [appointments, setAppointments] = useState<Appointments[]>([]); 
    const [selectedVisitee, setSelectedVisitee] = useState<Visitee | null>(null); // State for selected visitee
    const [previousVisiteeCount, setPreviousVisiteeCount] = useState<number>(0);
    const [previousAppointmentCount, setPreviousAppointmentCount] = useState<number>(0);
    const [visitorId, setVisitorId] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    // State to control dialog visibility
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointments | null>(null);


    
    useEffect(() => {
       // Get current date and time, then subtract 6 hours
       const currentDate = new Date();
       currentDate.setHours(currentDate.getHours() - 6); // Subtract 6 hours
       const formattedDate = currentDate.toISOString().slice(0, 16); // Format to YYYY-MM-DDTHH:MM
       setAppointmentDate(formattedDate);

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
                    throw new Error('Failed to fetch session data');
                }
    
                const session = await response.json();
    
                // If the user session is not "visitors", redirect to login
                if (session.role !== "visitors") {
                    window.location.href = "/login";
                    return; // Ensure no further execution after redirect
                }
                setVisitorId(session.id);
                // User is authenticated as a "visitors", fetch other data
                await fetchAppointments();
                await fetchVisitees();
                
            } catch (error) {
                console.error('Error during authentication:', error);
                window.location.href = "/login"; // Redirect on error
            }
        };
    
        auth(); // Run the authentication logic
    }, []); // Empty dependency array to run only once on mount

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

    // Calculate percentage change
    const calculatePercentageChange = (current: number, previous: number) => {
        if (previous === 0) return 0; // Avoid division by zero
        return ((current - previous) / previous) * 100;
    };

    const visiteePercentageChange = calculatePercentageChange(visitees.length, previousVisiteeCount);
    const appointmentPercentageChange = calculatePercentageChange(appointments.length, previousAppointmentCount);

    const handleScheduleAppointment = async (appointmentData: {
      visitee_id: number | undefined;
      visitor_id: string;
      appointment_date: string;
  }) => {
      if (!appointmentData.visitee_id) {
          console.error('No visitee selected');
          return;
      }
  
      try {
          const response = await fetch('/api/appointments', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(appointmentData),
          });
  
          if (!response.ok) {
              throw new Error('Failed to schedule appointment');
          }
  
          const result = await response.json();
          console.log('Appointment scheduled successfully:', result);
          await fetchAppointments(); // Refresh appointments list
  
             // Clear selected visitee and appointment date after scheduling
             setSelectedVisitee(null);
           
   
             // Close the dialog after successfully scheduling
             setDialogOpen(false);
   
  
          // Show success message
          alert('Appointment scheduled successfully!'); // Alert pop-up
      } catch (error) {
          console.error('Error scheduling appointment:', error);
      }
  };
  
  

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Nav />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                    {/* Total Appointments Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{appointments.length}</div>
                            <p className="text-xs text-muted-foreground">
                                {appointmentPercentageChange.toFixed(1)}% from yesterday
                            </p>
                        </CardContent>
                    </Card>

                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Card className="cursor-pointer" onClick={() => setDialogOpen(true)}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Residence</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{visitees.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Click here to select a person to visit.
                        </p>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Select a Resident</DialogTitle>
                    <DialogDescription>
                        Please select an individual you wish to visit from the menu below
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <select
                        id="visitee-select"
                        className="border rounded p-2 w-full"
                        value={selectedVisitee?.visitee_id || ""}
                        onChange={(e) => {
                            const selectedId = parseInt(e.target.value);
                            const selected = visitees.find(v => v.visitee_id === selectedId) || null;
                            setSelectedVisitee(selected);
                        }}
                    >
                        <option value="" disabled>Select a Visitee</option>
                        {visitees.map((visitee) => (
                            <option key={visitee.visitee_id} value={visitee.visitee_id}>
                                {visitee.name} - House {visitee.unit_number}
                            </option>
                        ))}
                    </select>

                    {/* Appointment Date Input */}
                    <input
                        type="datetime-local"
                        placeholder="Appointment Date"
                        className="border rounded p-2 w-full"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)} // Add this state and setter
                    />
                </div>
                <DialogFooter>
                    <Button
                        onClick={() => {
                            handleScheduleAppointment({
                                visitee_id: selectedVisitee?.visitee_id,
                                visitor_id: visitorId,
                                appointment_date: appointmentDate,
                            });
                        }}
                    >
                        Schedule Appointment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

                </div>

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
};

export default Dashboard;
