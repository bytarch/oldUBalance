
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

    const { name, phone, email, password, shift_start, shift_end } = req.body;

    // Basic validation
    if (!name || !email || !password || !shift_start || !shift_end) {
      return res.status(400).json({ error: 'Name, email, password, shift start, and shift end are required.' });
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert gate guard into the database
      const { data, error } = await supabase
        .from('gate_guard')
        .insert([
          {
            name,
            phone,
            email,
            password: hashedPassword,
            shift_start,
            shift_end,
          },
        ])
        .select();

      if (error) {
        if (error.message.includes('duplicate key value violates unique constraint')) {
          return res.status(409).json({ error: 'Email is already registered.' });
        }
        console.error('Error creating gate guard:', error);
        return res.status(500).json({ error: 'Error creating gate guard.' });
      }

      return res.status(201).json({ message: 'Gate guard signed up successfully.', guard: data[0] });
    } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
}
