
import supabase from '@/supabase';
import { authenticate } from '@/middleware/authenticate'; // Adjust the path as necessary

export default async function handler(req, res) {
  // Apply the authentication middleware
  await authenticate(req, res, async () => {
    const { role } = req.user;

   

    if (req.method === 'GET') {
      // Fetch all visitees
      const { data, error } = await supabase
        .from('visitee')
        .select('*');

      if (error) {
        console.error('Error fetching visitees:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Exclude password from all visitee records
      const cleanedData = data.map(visitee => {
        const { password, ...rest } = visitee;
        return rest;
      });

      return res.status(200).json(cleanedData);

    } else if (req.method === 'POST') {
         // Allow only admin and gate_guard to access this data
    if (role !== 'admin' && role !== 'gate_guard') {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions.' });
      }
      // Generate a random 5-digit number for visitee_id
      const visitee_id = Math.floor(10000 + Math.random() * 90000); // Random 5-digit number

      // Add a new visitee
      const { name, unit_number, phone, email, password } = req.body;

      const { data, error } = await supabase
        .from('visitee')
        .insert([{ visitee_id, name, unit_number, phone, email, password }]) // Include random ID
        .select();

      if (error) {
        console.error('Error adding visitee:', error);
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
