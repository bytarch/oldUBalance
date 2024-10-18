import supabase from '@/supabase';
import { authenticate } from '@/middleware/authenticate';
import { QRBuffer } from '@bytarch/qrcode'; 
import { v4 as uuidv4 } from 'uuid'; // For generating unique filenames

// Function to generate a random integer appointment ID
const generateUniqueAppointmentId = async () => {
  let uniqueId;
  let isUnique = false;

  while (!isUnique) {
    uniqueId = Math.floor(Math.random() * 999999) + 1;

    const { data, error } = await supabase
      .from('appointments')
      .select('appointment_id')
      .eq('appointment_id', uniqueId);

    if (!error && data.length === 0) {
      isUnique = true;
    }
  }
  
  return uniqueId;
};

export default async function handler(req, res) {
  await authenticate(req, res, async () => {
    const { role, id: userId } = req.user;

    if (req.method === 'GET') {
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
      const appointment_id = await generateUniqueAppointmentId();
      const {
        visitee_id,
        visitor_id,
        appointment_date,
        valid_from = appointment_date,
        valid_until = new Date(new Date(valid_from).getTime() + 60 * 60 * 1000),
        status = 'pending'
      } = req.body;

      const qrCodeDataObject = {
        appointment: {
          appointment_id,
          visitor_id,
          visitee_id,
          appointment_date,
          valid_from,
          valid_until,
          status,
        }
      };

      const qrCodeData = JSON.stringify(qrCodeDataObject);

      // Use QRBuffer from @bytarch/qrcode to generate QR code
      const qrCodeBuffer = await QRBuffer(qrCodeData);

      const qrCodeFileName = `qr_codes/${uuidv4()}.png`;

      console.log('User role:', role);
      console.log('User ID:', userId);

      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('gated_community_tracker')
        .upload(qrCodeFileName, qrCodeBuffer, {
          contentType: 'image/png',
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading QR code:', uploadError);
        return res.status(500).json({ error: uploadError.message });
      }

      const qrCodeUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/gated_community_tracker/${qrCodeFileName}`;

      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          appointment_id,
          visitee_id,
          visitor_id,
          appointment_date,
          qr_code: qrCodeUrl,
          valid_from,
          valid_until,
          status,
        }]);

      console.log('Insert data:', {
        appointment_id,
        visitee_id,
        visitor_id,
        appointment_date,
        qr_code: qrCodeUrl,
        valid_from,
        valid_until,
        status,
      });

      console.log('Insert response:', { data, error });

      if (error) {
        console.error('Error creating appointment:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({ success: true });
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  });
}
