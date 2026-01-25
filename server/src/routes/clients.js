import express from 'express';
import { z } from 'zod';
import { prisma } from '../prismaClient.js';
import { authMiddleware, requireRoles } from '../middleware/auth.js';

const router = express.Router();

const createSchema = z.object({
    name: z.string().min(1),
    email: z.string().email().optional(),
    data: z.any().optional()
});

// list with simple pagination & search
router.get('/', authMiddleware, async (req, res, next) => {
    try {
        const { q, skip = 0, take = 50 } = req.query;
        const where = q ? {
            OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } }
            ]
        } : {};
        const clients = await prisma.client.findMany({
            where,
            skip: Number(skip),
            take: Math.min(200, Number(take))
        });
        await prisma.auditLog.create({
            data: {
                actorId: req.user.id,
                actorEmail: req.user.email,
                action: 'list_clients',
                details: { q, count: clients.length }
            }
        });
        res.json({ data: clients });
    } catch (err) {
        next(err);
    }
});

router.get('/:id', authMiddleware, async (req, res, next) => {
    try {
        const client = await prisma.client.findUnique({ where: { id: req.params.id } });
        if (!client) return res.status(404).json({ error: 'Not found' });
        await prisma.auditLog.create({
            data: { actorId: req.user.id, actorEmail: req.user.email, action: 'get_client', targetId: client.id }
        });
        res.json({ data: client });
    } catch (err) { next(err); }
});

router.post('/', authMiddleware, requireRoles(['ADMIN','MANAGER']), async (req, res, next) => {
    try {
        const body = createSchema.parse(req.body);
        const created = await prisma.client.create({ data: { name: body.name, email: body.email, data: body.data ?? {} }});
        await prisma.auditLog.create({ data: { actorId: req.user.id, actorEmail: req.user.email, action: 'create_client', targetId: created.id, details: body }});
        res.status(201).json({ data: created });
    } catch (err) { next(err); }
});

router.put('/:id', authMiddleware, requireRoles(['ADMIN','MANAGER']), async (req, res, next) => {
    try {
        const body = createSchema.parse(req.body);
        const updated = await prisma.client.update({ where: { id: req.params.id }, data: { name: body.name, email: body.email, data: body.data ?? {} }});
        await prisma.auditLog.create({ data: { actorId: req.user.id, actorEmail: req.user.email, action: 'update_client', targetId: updated.id, details: body }});
        res.json({ data: updated });
    } catch (err) { next(err); }
});

router.delete('/:id', authMiddleware, requireRoles(['ADMIN']), async (req, res, next) => {
    try {
        await prisma.client.delete({ where: { id: req.params.id }});
        await prisma.auditLog.create({ data: { actorId: req.user.id, actorEmail: req.user.email, action: 'delete_client', targetId: req.params.id }});
        res.status(204).end();
    } catch (err) { next(err); }
});

export default router;