const express = require('express');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const client = require('prom-client'); // Prometheus Client

const app = express();
app.use(cors());
app.use(express.json());

// --- Prometheus Metrics Setup ---
// Collect default metrics (CPU, Memory, etc.)
client.collectDefaultMetrics();

// Create a Histogram to track HTTP request duration
const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 0.5, 1, 2, 5]
});

// Middleware to measure request duration
app.use((req, res, next) => {
    const end = httpRequestDurationMicroseconds.startTimer();
    res.on('finish', () => {
        end({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            code: res.statusCode
        });
    });
    next();
});

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});
// --------------------------------

// Routes
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));

module.exports = app;
