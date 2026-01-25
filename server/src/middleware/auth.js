import { verifyAccessToken } from '../utils/jwt.js';
import { prisma } from '../prismaClient.js';

export async function authMiddleware(req, res, next) {
    const auth = req.headers.authorization?.split(' ')?.[1];
    if (!auth) return res.status(401).json({ error: 'Missing Authorization token' });
    try {
        const payload = verifyAccessToken(auth);
        // optionally fetch user
        const user = await prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user) return res.status(401).json({ error: 'User not found' });
        req.user = { id: user.id, email: user.email, role: user.role };
        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

export function requireRoles(allowed = []) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        if (!allowed.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
        return next();
    };
}