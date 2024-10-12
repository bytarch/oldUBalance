
import supabase from '@/supabase';
import { authenticate } from '@/middleware/authenticate'; // Adjust the path as necessary

export default async function handler(req, res) {
  // Apply the authentication middleware
  await authenticate(req, res, async () => {
    const { role } = req.user;

    // Allow only admin to access this data
    if (role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions.' });
    }

    if (req.method === 'GET') {
      // Fetch all gate guards sorted by updated_at in ascending order
      const { data, error } = await supabase
        .from('gate_guard')
        .select('*')
        .order('updated_at', { ascending: true }); // Sort by updated_at in ascending order

      if (error) {
        console.error('Error fetching gate_guard:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Exclude password from all gate guard records
      const cleanedData = data.map(guard => {
        const { password, ...rest } = guard;
        return rest;
      });

      return res.status(200).json(cleanedData);

    } else if (req.method === 'POST') {
      // Add a new gate guard
      const { name, phone, email, password, shift_start, shift_end } = req.body;

      // Validate required fields
      if (!name || !password || !shift_start || !shift_end) {
        return res.status(400).json({ error: 'Name, password, shift start, and shift end are required.' });
      }

      const { data, error } = await supabase
        .from('gate_guard')
        .insert([{ name, phone, email, password, shift_start, shift_end }]) // Insert new gate guard
        .select();

      if (error) {
        console.error('Error adding gate_guard:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Exclude password from the response
      const { password: _, ...createdGuard } = data[0]; // Remove password from created guard

      return res.status(201).json(createdGuard);

    } else {
      // If the request method is not allowed, return 405
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  });
}
