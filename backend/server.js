const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const customerRoutes = require('./routes/customerRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const noteRoutes = require('./routes/noteRoutes');
const sapiensRoutes = require('./routes/sapiensRoutes');
const authRoutes = require('./routes/auth');
const { errorHandler } = require('./middleware/errorMiddleware');
const requestLogger = require('./middleware/requestLogger');
const authenticator = require('./middleware/authenticator');
const notFound = require('./middleware/notFound');
const { default: helmet } = require('helmet');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const { default: rateLimit } = require('express-rate-limit');
const cronjobs = require('./utils/cron-file');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');


dotenv.config();

connectDB();

const app = express();



// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
// or app.use(cors());

app.options('*', cors()) // include before other routes


// HTTP request logger middleware

//enter log into the file
//create access.log file in root folder and appends log into the file by adding the flags as 'a'
// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'app.log'), { flags: 'a' });

// create a rotating write stream 
//creates log folder and inside this it will create log file, file will be rotated every day coz interval is 1d
var accessLogStream = rfs.createStream('app.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
})
app.use(morgan('combined', { stream: accessLogStream }));  // combined, dev, common, short, tiny
// or custom like ':method :url :response-time'

// Security middleware to set various HTTP headers
app.use(helmet());

// Cookie parsing middleware
app.use(cookieParser());

// Response compression middleware
app.use(compression());

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Custom middleware
app.use(requestLogger); // Custom request logging middleware

app.use('/api/auth', authRoutes);

app.use(authenticator); // Custom authentication middleware


app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);

app.use('/api/employees', employeeRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/sapiens', sapiensRoutes);

// Error handling middleware
app.use(notFound); // Catch all undefined routes
app.use(errorHandler); // Handle errors

// const serverForSocket = http.createServer(app);
// const io = socketIo(serverForSocket, {
//     cors: {
//         origin: "http://localhost:5173", // React app address
//         methods: ["GET", "POST"],
//         credentials: true
//     }
// });

// io.on('connection', (socket) => {
//     console.log('New client connected');

//     // Handle messages from client
//     socket.on('message', (data) => {
//         console.log('Message received:', data);
//         io.emit('message', data); // Broadcast the message to all clients
//     });

//     // Handle disconnection
//     socket.on('disconnect', () => {
//         console.log('Client disconnected');
//     });
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port number ${PORT}`);
});
