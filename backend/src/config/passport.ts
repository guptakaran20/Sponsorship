import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../lib/prisma';
import { env } from './env';

export const configurePassport = () => {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_CALLBACK_URL) {
    console.warn('Google OAuth not configured — skipping passport setup');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email found in Google profile'));
          }

          // Check if user already exists by email
          let user = await prisma.user.findUnique({ where: { email } });

          if (user) {
            // Link Google account if not already linked
            if (!user.provider) {
              user = await prisma.user.update({
                where: { id: user.id },
                data: { provider: 'google', providerId: profile.id },
              });
            }
            return done(null, user);
          }

          // Create new user — default to CLUB role (can be changed in profile)
          user = await prisma.user.create({
            data: {
              email,
              name: profile.displayName || email.split('@')[0],
              password: '', // OAuth users don't have a password
              role: 'CLUB',
              provider: 'google',
              providerId: profile.id,
              isVerified: true,
            },
          });

          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
