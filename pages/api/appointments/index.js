import supabase from '@/supabase';
import { authenticate } from '@/middleware/authenticate'; // Adjust the path as necessary
import QRCode from 'qrcode'; // Import the QR code library
import { v4 as uuidv4 } from 'uuid'; // For generating unique filenames

// Function to generate a random integer appointment ID
const generateUniqueAppointmentId = async () => {
  let uniqueId;
  let isUnique = false;

  while (!isUnique) {
    // Generate a random integer between 1 and 999999 (adjust range as needed)
    uniqueId = Math.floor(Math.random() * 999999) + 1;

    // Check if the ID already exists in the appointments table
    const { data, error } = await supabase
      .from('appointments')
      .select('appointment_id')
      .eq('appointment_id', uniqueId);

    // If there's an error or no data returned, the ID is unique
    if (!error && data.length === 0) {
      isUnique = true; // Found a unique ID
    }
  }
  
  return uniqueId;
};
export default async function handler(req, res) {
  // Apply the authentication middleware
  await authenticate(req, res, async () => {
    const { role, id: userId } = req.user; // Assuming `id` is part of req.user

    if (req.method === 'GET') {
      // Handle GET requests
      if (role === 'visitors') {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            visitor:visitor_id (
              name
            ),
            visitee:visitee_id (
              name
            )
          `)
          .eq('visitor_id', userId);

        if (error) {
          console.error('Error fetching appointments for visitor:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        const formattedData = data.map(appointment => ({
          appointment_id: appointment.appointment_id,
          appointment_date: appointment.appointment_date,
          qr_code: appointment.qr_code,
          valid_from: appointment.valid_from,
          valid_until: appointment.valid_until,
          status: appointment.status,
          visitor_id: appointment.visitor_id,
          visitor_name: appointment.visitor?.name || 'Unknown Visitor',
          visitee_id: appointment.visitee_id,
          visitee_name: appointment.visitee?.name || 'Unknown Visitee'
        }));

        return res.status(200).json(formattedData);
      }

      if (role === 'admin' || role === 'gate_guard') {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            visitor:visitor_id (
              name
            ),
            visitee:visitee_id (
              name
            )
          `);

        if (error) {
          console.error('Error fetching appointments:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        const formattedData = data.map(appointment => ({
          appointment_id: appointment.appointment_id,
          appointment_date: appointment.appointment_date,
          qr_code: appointment.qr_code,
          valid_from: appointment.valid_from,
          valid_until: appointment.valid_until,
          status: appointment.status,
          visitor_id: appointment.visitor_id,
          visitor_name: appointment.visitor?.name || 'Unknown Visitor',
          visitee_id: appointment.visitee_id,
          visitee_name: appointment.visitee?.name || 'Unknown Visitee'
        }));

        return res.status(200).json(formattedData);
      }

      return res.status(403).json({ error: 'Forbidden: Insufficient permissions.' });

    } else if (req.method === 'POST') {
      // Create a new appointment
      // Generate a random ID for the appointment
      const appointment_id = await generateUniqueAppointmentId(); // Await the function here
      const {
        visitee_id,
        visitor_id,
        appointment_date,
        valid_from = appointment_date,
        valid_until = new Date(new Date(valid_from).getTime() + 60 * 60 * 1000),
        status = 'pending'
      } = req.body; // Set default values
    
      // Create the data as a JSON object
      const qrCodeDataObject = {
        appointment: {
          appointment_id,
          visitor_id: visitor_id,
          visitee_id: visitee_id,
          appointment_date: appointment_date,
          valid_from,
          valid_until,
          status,
        }
      };
    
      // Convert the object to a JSON string
      const qrCodeData = JSON.stringify(qrCodeDataObject);
    
      // Generate QR code as a PNG image
      const qrCodeBuffer = await QRCode.toBuffer(qrCodeData, { type: 'png' });
    
      // Generate a unique filename for the QR code
      const qrCodeFileName = `qr_codes/${uuidv4()}.png`;
    
      // Log user details for debugging
      console.log('User role:', role);
      console.log('User ID:', userId);
    
      // Upload the QR code image to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('gated_community_tracker') // Replace with your actual bucket name
        .upload(qrCodeFileName, qrCodeBuffer, {
          contentType: 'image/png',
          upsert: true // Overwrite if the file already exists
        });
    
      if (uploadError) {
        console.error('Error uploading QR code:', uploadError);
        return res.status(500).json({ error: uploadError.message });
      }
    
      // Construct the public URL for the uploaded QR code
      const qrCodeUrl = `https://djsqtktjxnwkgmaqwhpe.supabase.co/storage/v1/object/public/gated_community_tracker/${qrCodeFileName}`;
    
      // Insert the appointment into the database with the QR code URL
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          appointment_id, // Use the generated appointment_id here
          visitee_id,
          visitor_id,
          appointment_date,
          qr_code: qrCodeUrl, // Store the URL of the QR code
          valid_from, // Optional field
          valid_until, // Optional field
          status, // Optional field
        }]);
    
      // Log the raw data and error for debugging
      console.log('Insert data:', {
        appointment_id, // Log the generated appointment_id
        visitee_id,
        visitor_id,
        appointment_date,
        qr_code: qrCodeUrl,
        valid_from,
        valid_until,
        status,
      });
      console.log('Insert response:', { data, error });
    
      // Check for errors after the insert
      if (error) {
        console.error('Error creating appointment:', error);
        return res.status(500).json({ error: error.message }); // Return error message
      }
    
      return res.status(201).json({ success: true });
    }
    
     else {
      // If the request method is not allowed
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  });
}
