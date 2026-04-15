import { Router } from 'express';
import passport from 'passport';
import { UserModel } from '../models';
import { SquadController, BoardController, TestController } from '../controllers';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

// AUTH ROUTES
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000/squads');
  }
);

router.post('/auth/logout', (req: any, res: any, next: any) => {
  req.logout((err: any) => {
    if (err) return next(err);
    res.sendStatus(200);
  });
});

router.get('/api/me', (req: any, res: any) => {
  res.json(req.user || null);
});

router.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// SQUAD ROUTES
router.post('/api/squads', isAuthenticated, SquadController.create);
router.get('/api/squads', isAuthenticated, SquadController.list);
router.get('/api/squads/:id', isAuthenticated, SquadController.getById);
router.post('/api/squads/:id/join', isAuthenticated, SquadController.join);

// BOARD ROUTES
router.get('/api/boards/:id', isAuthenticated, BoardController.getById);

// TEST ROUTES
if (process.env.NODE_ENV !== 'production') {
  router.post('/api/test/clear-db', TestController.clearDb);
  router.post('/api/test/seed-squads', TestController.seedSquads);
  router.post('/api/test/seed-users', TestController.seedUsers);
}

export default router;
