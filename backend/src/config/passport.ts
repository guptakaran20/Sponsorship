import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from './env';

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Return profile to the controller
        return done(null, profile);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

// Since we check user and issue JWTs in the callback, we don't strictly need serializeUser 
// to touch the database. Just saving the basic passport profile to session is enough for the selection flow.
passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;
