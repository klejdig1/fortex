import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import clientRoutes from './routes/clients.js';
import { prisma } from './prismaClient.js';


const app = express();
app.use(helmet());
app.use(express.json());

// Allow one origin or comma-separated list (e.g. https://fortex01.netlify.app,http://localhost:5173)
const originEnv = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const allowedOrigins = originEnv.split(',').map((o) => o.trim()).filter(Boolean);
app.use(cors({
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 60_000, max: 300 }));

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);

// simple health
app.get('/api/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'internal server error' });
});

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});