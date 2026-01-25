import express from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../prismaClient.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';


const router = express.Router();

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().optional()
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

router.post('/register', async (req, res, next) => {
    try {
        const body = registerSchema.parse(req.body);
        const existing = await prisma.user.findUnique({ where: { email: body.email } });
        if (existing) return res.status(400).json({ error: 'Email already registered' });
        const hash = await bcrypt.hash(body.password, 10);
        const user = await prisma.user.create({
            data: { email: body.email, passwordHash: hash, name: body.name ?? null, role: 'USER' }
        });
        // sign tokens
        const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
        const refreshToken = signRefreshToken({ sub: user.id });
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); 
        await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } });
        res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } });
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const body = loginSchema.parse(req.body);
        const user = await prisma.user.findUnique({ where: { email: body.email } });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        const ok = await bcrypt.compare(body.password, user.passwordHash);
        if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
        const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
        const refreshToken = signRefreshToken({ sub: user.id });
        const decoded = verifyRefreshToken(refreshToken);
        const expiresAt = new Date(decoded.exp * 1000);
        await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } });
        res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } });
    } catch (err) {
        next(err);
    }
});

router.post('/refresh', async (req, res, next) => {
    try {
        console.log("Body received:", req.body);

        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ error: 'Missing refreshToken' });
        const payload = verifyRefreshToken(refreshToken);

        if (!payload?.sub) {
            return res.status(401).json({ error: 'Invalid refresh token' });
          }
        const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
        if (!stored) return res.status(401).json({ error: 'Invalid refresh token' });
        if (new Date(stored.expiresAt) < new Date()) {
            return res.status(401).json({ error: 'Refresh token expired' });
        }
        const user = await prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user) return res.status(401).json({ error: 'User not found' });
        const newAccess = signAccessToken({ sub: user.id, email: user.email, role: user.role });
        res.json({ accessToken: newAccess });
    } catch (err) {
        next(err);
    }
});

router.post('/logout', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ error: 'Missing refreshToken' });
        await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
});

export default router;

