

export interface Guard {
  guard_id: number;
  name: string;
  email: string;
  phone: string;
  shift_start: string; // or Date, depending on your data structure
  shift_end: string; // or Date
  created_at: string; // Include created_at for counting
}

export interface Visitee {
  visitee_id: number;
  name: string;
  unit_number: string;
  phone: string;
  email: string;
  created_at: string; // Include created_at for counting
}

export interface Appointments {
  appointment_id: number; // Unique identifier for the appointment
  visitee_id: number; // ID of the visitee
  visitor_id: number; // ID of the visitor
  appointment_date: string; // Date and time of the appointment
  qr_code: string; // QR code associated with the appointment
  valid_from: string; // Start time for the appointment validity
  valid_until: string; // End time for the appointment validity
  status: string; // Current status of the appointment (e.g., pending)
  created_at: string; // Timestamp for when the appointment was created
  visitor_name: string;
  visitee_name: string;
}

export interface Admin {
  admin_id: number;
  name: string;
  phone: string;
  email: string;
  created_at: string; // Include created_at for counting
}

export interface Visitor {
  visitor_id: number;
  name: string;
  phone: string;
  email: string;
  created_at: string; // Include created_at for counting
}


// Helper function to convert UTC time to Belize's formatted date and time
export const convertToBelizeTime = (utcDateString: string) => {
  const date = new Date(utcDateString);

  // Belize is UTC-6
  const belizeOffset = -6 * 60; // offset in minutes
  const localDate = new Date(date.getTime() + (belizeOffset + date.getTimezoneOffset()) * 60000);

  // Format to full date and time
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };

  return localDate.toLocaleString('en-US', options);
};
