import express from 'express';
import dotenv from 'dotenv';
import pg from 'pg';  // Default import
import cors from 'cors';  // Import the cors package
const { Pool } = pg;  // Destructure the Pool from the default import
 
dotenv.config();  // Load environment variables from .env
 
const app = express();
const PORT = process.env.PORT || 5000;
 
// Middleware to parse JSON bodies
app.use(express.json());
 
// Enable CORS for all domains (or you can restrict it to specific domains)
app.use(cors({
  origin: 'http://ec2-54-225-233-174.compute-1.amazonaws.com:5389/', // Add your frontend URL here
  methods: ['GET', 'POST'], // Allow specific HTTP methods if needed
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow custom headers if necessary
}));
 
// PostgreSQL database connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
 
// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log('Connected to PostgreSQL:', result.rows);
  });
});
 
// Add the missing route for cron-jobs
app.get('/api/cron-jobs', async (req, res) => {
  try {
    const { table, environment } = req.query;
 
    // Use double quotes around "table" and "environment" to avoid syntax issues
    const query = 'SELECT * FROM cron_jobs WHERE "table" = $1 AND "environment" = $2';
 
    // Run the query, passing parameters safely
    const result = await pool.query(query, [table, environment]);
 
    // Return the result as JSON
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching cron jobs:', error);
    res.status(500).json({ error: 'Failed to fetch cron jobs' });
  }
});
 
// Basic route to check if the server is running
app.get('/', (req, res) => {
  res.send('Backend is running and connected to PostgreSQL');
});
 
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});