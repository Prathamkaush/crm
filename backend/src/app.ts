import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './modules/auth/auth.routes';
import { errorHandler } from './middlewares/error.middleware';
import contactRoutes from "./routes/contacts.routes";
import analyticsRoutes from "./routes/analytics.routes";
import leadsRoutes from "./routes/leads.routes";
import taskRoutes from "./routes/task.routes";
import userRoutes from "./routes/users.routes";

const app = express();

// ========= CORS CONFIG =========
app.use(
  cors({
    origin: "http://localhost:5173",  // frontend dev URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ========= SECURITY =========
app.use(helmet());

// ========= PARSERS =========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========= RATE LIMIT =========
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

// ========= HEALTH CHECK =========
app.get('/health', (req, res) => res.json({ ok: true }));

// ========= AUTH ROUTES =========
app.use('/api/auth', authRoutes);

// ========= CONTACT ROUTES =========
app.use("/api/contacts", contactRoutes);

// ========= ANALYTICS ROUTES =========
app.use("/api/analytics", analyticsRoutes);

// ========= LEADS ROUTES =========
app.use("/api/leads", leadsRoutes);

// ========= TASK ROUTES =========

app.use("/api/tasks", taskRoutes);

// ========= USER ROUTES =========
app.use("/api/users", userRoutes);

// ========= GLOBAL ERROR HANDLER =========
app.use(errorHandler);

export default app;
