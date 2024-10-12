
export default async function handler(req, res) {
    // Check if the request method is POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Clear the cookie by setting its expiration time to a past date
    const cookieString = `token=; HttpOnly; Max-Age=0; Path=/;`; // Expire the cookie immediately
    res.setHeader('Set-Cookie', cookieString);

    return res.status(200).json({ message: 'Logged out successfully' });
}
