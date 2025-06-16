const express = require('express');
const http = require("http");
const mongoose = require('mongoose');
const { Server } = require("socket.io");
const session = require('express-session'); // Import express-session
const tripRoutes = require("./routes/tripRoutes");
const Trip = require("./models/Trip");
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user'); // Assuming you have a user route

dotenv.config(); // Load environment variables from .env

const app = express();

app.use(cors());
app.use(express.json());

// Configure express-session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'a_default_secret_for_session', // Use a strong secret from .env
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Set to true in production (requires HTTPS)
    httpOnly: true, // Prevent client-side JS from accessing the cookie
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));


app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use("/api/trips", tripRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("locationUpdate", async ({ tripId, lat, lng }) => {
    try {
      if (!tripId || !lat || !lng) return;
      await Trip.findByIdAndUpdate(tripId, {
        $push: {
          realTimeTracking: {
            lat,
            lng,
            timestamp: new Date(),
          },
        },
      });
      io.emit(`trip-${tripId}-location`, { lat, lng });
    } catch (err) {
      console.error("Tracking update error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));