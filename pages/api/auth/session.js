
import { authenticate } from '@/middleware/auth';

export default async function handler(req, res) {
  // Apply the authentication middleware
  authenticate(req, res, async () => {
    // Your protected route logic goes here
    res.status(200).json( req.user );
  });
}
