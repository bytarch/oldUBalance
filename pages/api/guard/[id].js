
import supabase from '@/supabase';
import { authenticate } from '@/middleware/authenticate'; // Adjust the path as necessary

export default async function handler(req, res) {
  // Apply the authentication middleware
  await authenticate(req, res, async () => {
    const { id } = req.query; // Get ID from query parameters

    if (req.method === 'GET') {
      // Handle GET request to fetch a specific gate_guard
      const { data, error } = await supabase
        .from('gate_guard')
        .select('*')
        .eq('guard_id', id) // Using guard_id to find the specific record
        .single(); // Fetch a single record

      if (error) {
        console.error('Error fetching gate_guard:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Check if a gate_guard was found
      if (!data) {
        return res.status(404).json({ error: 'Gate guard not found' });
      }

      // Remove sensitive fields from the gate_guard
      delete data.password; // Remove password if present

      return res.status(200).json(data);

    } else if (req.method === 'PATCH') {
      // Check if the user's role is admin
      const { role } = req.user;
      if (role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions.' });
      }

      // Handle PATCH request to update a specific gate_guard
      const { name, phone, email, shift_start, shift_end } = req.body;

      // Only allow updating specific fields
      const updates = { name, phone, email, shift_start, shift_end };

      // Update gate_guard in the database
      const { data, error } = await supabase
        .from('gate_guard')
        .update(updates)
        .eq('guard_id', id) // Using guard_id to find the specific record
        .select();

      if (error) {
        console.error('Error updating gate_guard:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (!data) {
        return res.status(404).json({ error: 'Gate guard not found' });
      }

      // Exclude the password field in the response
      delete data[0].password;

      return res.status(200).json(data[0]);

    } else if (req.method === 'DELETE') {
      // Check if the user's role is admin
      const { role } = req.user;
      if (role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions.' });
      }

      // Handle DELETE request to remove a specific gate_guard
      const { error } = await supabase
        .from('gate_guard')
        .delete()
        .eq('guard_id', id); // Using guard_id to find the specific record

      if (error) {
        console.error('Error deleting gate_guard:', error);
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
