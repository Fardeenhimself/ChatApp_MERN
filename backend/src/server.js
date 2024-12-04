const app = require('./app');
const http = require('http');
const connectDB = require('./lib/db');
const { initializeSocket } = require('./lib/socket.io'); // Import initializeSocket

require('dotenv').config();

const server = http.createServer(app);
initializeSocket(server);  // Initialize socket.io

async function startServer() {
    await connectDB();
    
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}

startServer();

module.exports = server; // Export the server instance, not io
