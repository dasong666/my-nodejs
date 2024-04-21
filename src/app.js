const morgan = require('morgan');
const express = require('express');
const NodeCache = require("node-cache");
const app = express();
const PORT = process.env.PORT || 8088;

// Setup the logger
app.use(morgan('combined'));  // 'combined' outputs the Apache style logs

// Create a cache instance with a standard TTL (Time To Live) of 1 hour (3600 seconds)
const cache = new NodeCache({ stdTTL: 3600 });

// Health check route to verify if the cache is working
app.get('/health', (req, res) => {
    const healthCheck = {
        uptime: process.uptime(),
        message: 'HAPPY',
        timestamp: Date.now()
    };
    try {
        // Attempt to use the cache
        cache.set("health", "1");
        const cacheTest = cache.get("health");
        if (cacheTest) {
            return res.status(200).send(healthCheck);
        }
        throw new Error('Cache not working');
    } catch (error) {
        return res.status(503).send({ ...healthCheck, message: 'Node-Cache not working...' });
    }
});

// Endpoint to get or set pet names in the cache
app.get('/hola', (req, res) => {
    const petName = req.query.pet;

    // Check if petName was provided and handle accordingly
    if (petName) {
        // Save the pet name in the cache with a specific TTL (e.g., 2 hours)
        cache.set(petName, `Hola ${petName}!`, 7200);

        // Retrieve from cache to ensure it's saved and return
        const message = cache.get(petName);
        res.json({ greeting: message });
    } else {
        // Default response if no pet name is given
        res.json({ greeting: "Salida!" });
    }
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

