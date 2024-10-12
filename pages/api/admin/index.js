
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
      // Fetch all admins
      const { data, error } = await supabase
        .from('admin')
        .select('*');

      if (error) {
        console.error('Error fetching admin:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Exclude password from all admin records
      const cleanedData = data.map(admin => {
        const { password, ...rest } = admin; // Exclude password
        return rest;
      });

      return res.status(200).json(cleanedData);

    } else if (req.method === 'POST') {
      // Add a new admin
      const { username, email, password } = req.body;

      // Validate required fields
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required.' });
      }

      // Insert new admin
      const { data, error } = await supabase
        .from('admin')
        .insert([{ username, email, password }]) // Insert new admin
        .select();

      if (error) {
        console.error('Error adding admin:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Exclude password from the response
      const { password: _, ...createdAdmin } = data[0]; // Remove password from created admin

      return res.status(201).json(createdAdmin);

    } else {
      // If the request method is not allowed, return 405
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  });
}
