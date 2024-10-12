
import supabase from '@/supabase';
import { authenticate } from '@/middleware/authenticate'; // Adjust the path as necessary

export default async function handler(req, res) {
  // Apply the authentication middleware
  await authenticate(req, res, async () => {
    const { id } = req.query; // Get ID from query parameters

    if (req.method === 'GET') {
      // Handle GET request to fetch a specific visitee
      const { data, error } = await supabase
        .from('visitee')
        .select('*')
        .eq('visitee_id', id) // Adjust to your field name
        .single(); // Fetch a single record

      if (error) {
        console.error('Error fetching visitee:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Check if a visitee was found
      if (!data) {
        return res.status(404).json({ error: 'Visitee not found' });
      }

      // Remove sensitive fields from the visitee
      delete data.password; // Remove password if present

      return res.status(200).json(data);

    } else if (req.method === 'PATCH') {
      // Check if the user's role is admin or gate_guard
      const { role } = req.user;
      if (role !== 'admin' && role !== 'gate_guard') {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions.' });
      }
      
      // Handle PATCH request to update a specific visitee
      const { name, unit_number, phone, email } = req.body;

      // Only allow updating specific fields
      const updates = { name, unit_number, phone, email };

      // Update visitee in the database
      const { data, error } = await supabase
        .from('visitee')
        .update(updates)
        .eq('visitee_id', id)
        .select();

      if (error) {
        console.error('Error updating visitee:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (!data) {
        return res.status(404).json({ error: 'Visitee not found' });
      }

      // Exclude the password field in the response
      delete data[0].password;

      return res.status(200).json(data[0]);

    } else if (req.method === 'DELETE') {
      // Check if the user's role is admin or gate_guard
      const { role } = req.user;
      if (role !== 'admin' && role !== 'gate_guard') {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions.' });
      }

      // Delete all appointments linked to the visitee first
      const { error: deleteAppointmentsError } = await supabase
        .from('appointments')
        .delete()
        .eq('visitee_id', id); // Remove all appointments for this visitee

      if (deleteAppointmentsError) {
        console.error('Error deleting appointments:', deleteAppointmentsError);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Handle DELETE request to remove a specific visitee
      const { error } = await supabase
        .from('visitee')
        .delete()
        .eq('visitee_id', id);

      if (error) {
        console.error('Error deleting visitee:', error);
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
