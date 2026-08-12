// path: backend/src/config/prisma.js
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const logger = require('./logger')

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Error handling 
pool.on('error', (err) => {
    logger.error({
        error: `Unexpected error on idle client: ${err.message}`,
        stack: err.stack
    }, 'Error in pool');
});

// Pool connected
pool.on('connect', () => {
    logger.info('Database connected!');
});

module.exports = prisma;