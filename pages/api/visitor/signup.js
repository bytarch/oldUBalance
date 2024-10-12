
import bcrypt from 'bcrypt';
import supabase from '@/supabase';
import { authenticate } from '@/middleware/authenticate'; // Authentication middleware

export default async function handler(req, res) {
  // Apply the authentication middleware
  await authenticate(req, res, async () => {
   
    if (req.method !== 'POST') {
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    const { name, phone, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert visitor into the database
      const { data, error } = await supabase
        .from('visitors')
        .insert([
          {
            name,
            phone,
            email,
            password: hashedPassword,
          },
        ])
        .select();

      if (error) {
        console.error('Error creating visitor:', error);
        return res.status(500).json({ error: 'Error creating visitor.' });
      }

      return res.status(201).json({ message: 'Visitor signed up successfully.', visitor: data[0] });
    } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
}
