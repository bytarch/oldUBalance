
import supabase from '@/supabase';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const JWT_SECRET = process.env.JWT_SECRET; // Ensure you set this in your .env file

export default async function handler(req, res) {
  // Check if the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const tables = ['admin', 'visitee', 'gate_guard', 'visitors'];

  try {
    // Iterate over each table to find a matching user
    for (const table of tables) {
      const { data: user, error: fetchError } = await supabase
        .from(table)
        .select('*')
        .eq('email', email)
        .single(); // Fetch a single record

      if (fetchError) {
        console.error(`Fetch error from ${table}:`, fetchError);
        continue; // Proceed to the next table if there's an error
      }

      // Check if the user exists
      if (user) {
        let passwordMatch = false;

        // If the password is likely hashed (e.g., bcrypt hashes are usually 60 characters)
        if (user.password.length > 50) {
          passwordMatch = await bcrypt.compare(password, user.password);
        } else {
          // If the password is not hashed, do a plain-text comparison
          passwordMatch = (user.password === password);
        }

        if (passwordMatch) {
          // Generate JWT token
          const accessToken = jwt.sign(
            { id: user.id || user.admin_id || user.guard_id || user.visitor_id || user.visitee_id, email: user.email, role: table },
            JWT_SECRET,
            { expiresIn: '31d' } // Token expiration time
          );

          // Set cookie with access token manually
          const cookieString = `token=${accessToken}; HttpOnly; Max-Age=${60 * 60 * 24 * 31}; Path=/;`;
          res.setHeader('Set-Cookie', cookieString);

          // Include the accessToken in the user object
          user.accessToken = accessToken;
          user.role = table;

          // Return user data including the access token if login is successful
          return res.status(200).json(user);
        }
      }
    }

    // If no match found in any table
    return res.status(401).json({ error: 'Invalid email or password.' });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
