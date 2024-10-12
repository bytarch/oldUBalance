
import supabase from '@/supabase';
import { authenticate } from '@/middleware/authenticate'; // Adjust the path as necessary

export default async function handler(req, res) {
  // Apply the authentication middleware
  await authenticate(req, res, async () => {
    const { role } = req.user;

    // Allow only admin and gate_guard to access this data
    if (role !== 'admin' && role !== 'gate_guard') {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions.' });
    }

    if (req.method === 'GET') {
      // Fetch visitors from the database
      const { data, error } = await supabase
        .from('visitors')
        .select('*');

      if (error) {
        console.error('Error fetching visitors:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Exclude password field for all visitors
      const cleanedData = data.map(visitor => {
        const { password, ...rest } = visitor;
        return rest;
      });

      return res.status(200).json(cleanedData);

    } else if (req.method === 'POST') {
      // Generate a random 5-digit number for visitor_id
      const visitor_id = Math.floor(10000 + Math.random() * 90000); // Random 5-digit number

      // Add a new visitor
      const { name, phone, email, password } = req.body;

      const { data, error } = await supabase
        .from('visitors')
        .insert([{ visitor_id, name, phone, email, password }]) // Include random ID
        .select();

      if (error) {
        console.error('Error adding visitor:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.status(201).json(data);

    } else {
      // If the request method is not allowed, return 405
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  });
}
