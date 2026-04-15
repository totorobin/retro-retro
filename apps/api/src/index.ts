import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserModel, BoardModel, ElementModel } from './models';
import routes from './routes';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middlewares
app.use(session({
  name: 'connect.sid',
  secret: process.env.SESSION_SECRET || 'retro-secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Mock Session for E2E tests in non-production
if (process.env.NODE_ENV !== 'production') {
  app.use((req: any, res, next) => {
    const mockUserId = req.headers['x-mock-user-id'] || req.cookies?.['mock_user_id'] || req.query?.mock_user_id;
    if (mockUserId) {
      req.session = req.session || { cookie: {} };
      req.session.passport = { user: mockUserId };
      req.session.save((err: any) => {
        next();
      });
    } else {
      next();
    }
  });
}

// Routes
app.use(routes);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/retro-retro';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Passport Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await UserModel.findOne({ id: profile.id });
      if (!user) {
        user = await UserModel.create({
          id: profile.id,
          email: profile.emails?.[0].value || '',
          firstName: profile.name?.givenName || '',
          lastName: profile.name?.familyName || '',
          picture: profile.photos?.[0].value
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findOne({ id });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// SOCKET LOGIC
io.on('connection', (socket) => {
  socket.on('join-board', (boardId) => {
    socket.join(boardId);
  });

  socket.on('update-element', async (data) => {
    const { element, boardId } = data;
    try {
      await ElementModel.findOneAndUpdate(
        { id: element.id },
        { ...element, boardId },
        { upsert: true, new: true }
      );
      socket.to(boardId).emit('element-updated', element);
    } catch (err) {
      console.error('Error updating element:', err);
    }
  });

  socket.on('lock-element', ({ elementId, boardId, userId }) => {
    socket.to(boardId).emit('element-locked', { elementId, userId });
  });

  socket.on('unlock-element', ({ elementId, boardId }) => {
    socket.to(boardId).emit('element-unlocked', { elementId });
  });

  socket.on('change-mode', async ({ boardId, mode }) => {
    try {
      await BoardModel.findOneAndUpdate({ id: boardId }, { mode });
      io.to(boardId).emit('mode-changed', mode);
    } catch (err) {
      console.error('Error changing mode:', err);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
