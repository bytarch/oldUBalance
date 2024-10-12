
import supabase from '@/supabase';
import { authenticate } from '@/middleware/authenticate'; // Adjust the path as necessary

export default async function handler(req, res) {
  // Apply the authentication middleware
  await authenticate(req, res, async () => {
    const { id } = req.query; // Get ID from query parameters
    const { role } = req.user;



    if (req.method === 'GET') {
      // Fetch a specific appointment by ID
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('appointment_id', id)
        .single(); // Fetch a single record

      if (error) {
        console.error('Error fetching appointment:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (!data) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      return res.status(200).json(data);

    } else if (req.method === 'PATCH') {
            // Check if the user's role is admin or gate_guard
    if (role !== 'admin' && role !== 'gate_guard') {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions.' });
      }
      // Update a specific appointment
      const { appointment_date, qr_code, valid_from, valid_until, status } = req.body;

      const updates = {
        appointment_date,
        qr_code,
        valid_from,
        valid_until,
        status,
      };

      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('appointment_id', id)
        .select();

      if (error) {
        console.error('Error updating appointment:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.status(200).json(data[0]);

    } else if (req.method === 'DELETE') {
            // Check if the user's role is admin or gate_guard
    if (role !== 'admin' && role !== 'gate_guard') {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions.' });
      }
      // Delete a specific appointment
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('appointment_id', id);

      if (error) {
        console.error('Error deleting appointment:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.status(204).end(); // No content to send back

    } else {
      // If the request method is not allowed
      res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  });
}
