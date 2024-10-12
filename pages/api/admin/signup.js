
import bcrypt from 'bcrypt';
import supabase from '@/supabase';
import { authenticate } from '@/middleware/authenticate'; // Authentication middleware

export default async function handler(req, res) {
  // Apply the authentication middleware
  await authenticate(req, res, async () => {
    // Check if the authenticated user's role is 'admin'
    const { role } = req.user;
    if (role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required.' });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert admin into the database
      const { data, error } = await supabase
        .from('admin')
        .insert([
          {
            username,
            email,
            password: hashedPassword,
          },
        ])
        .select();

      if (error) {
        console.error('Error creating admin:', error);
        return res.status(500).json({ error: 'Error creating admin.' });
      }

      return res.status(201).json({ message: 'Admin signed up successfully.', admin: data[0] });
    } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
}
