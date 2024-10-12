
import supabase from '@/supabase';
import { authenticate } from '@/middleware/authenticate'; // Adjust the path as necessary

export default async function handler(req, res) {
  // Apply the authentication middleware
  await authenticate(req, res, async () => {
    const { id } = req.query; // Get ID from query parameters


    if (req.method === 'GET') {
             // Check if the user's role is admin or gate_guard
     const { role } = req.user;
     if (role === 'visitor') {
       return res.status(403).json({ error: 'Forbidden: Insufficient permissions.' });
     }
      // Fetch a specific visitor by ID
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .eq('visitor_id', id)
        .single();

      if (error) {
        console.error('Error fetching visitor:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (!data) {
        return res.status(404).json({ error: 'Visitor not found' });
      }

      // Exclude password field
      delete data.password;

      return res.status(200).json(data);

    } else if (req.method === 'PATCH') {
         // Check if the user's role is admin or gate_guard for GET, PATCH, and DELETE operations
    const { role } = req.user;
    if (role !== 'admin' && role !== 'gate_guard') {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions.' });
    }

      // Update visitor details
      const { name, phone, email } = req.body;

      // Only allow updating specific fields
      const updates = { name, phone, email };

      // Update visitor in the database
      const { data, error } = await supabase
        .from('visitors')
        .update(updates)
        .eq('visitor_id', id)
        .select();

      if (error) {
        console.error('Error updating visitor:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (!data) {
        return res.status(404).json({ error: 'Visitor not found' });
      }

      // Exclude password field in the response
      delete data[0].password;

      return res.status(200).json(data[0]);

    } else if (req.method === 'DELETE') {
         // Check if the user's role is admin or gate_guard for GET, PATCH, and DELETE operations
    const { role } = req.user;
    if (role !== 'admin' && role !== 'gate_guard') {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions.' });
    }

      // Handle DELETE request to remove a specific visitor
      const { error } = await supabase
        .from('visitors')
        .delete()
        .eq('visitor_id', id);

      if (error) {
        console.error('Error deleting visitor:', error);
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
