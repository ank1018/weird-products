import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await connectDB();

          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            await User.create({
              email: user.email,
              name: user.name,
              habits: [
                {
                  id: 'habit-1',
                  name: 'Morning Exercise',
                  description: '30 minutes of exercise every morning',
                  frequency: 'daily',
                  streak: 0,
                  category: 'health',
                  completedDates: [],
                  type: 'follow',
                  createdAt: '2024-01-01T00:00:00.000Z',
                  updatedAt: '2024-01-01T00:00:00.000Z'
                }
              ],
            });
          }

          return true;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }
      return true;
    },
    async session({ session }) {
      try {
        await connectDB();
        if (session?.user?.email) {
          const user = await User.findOne({ email: session.user.email });
          if (user) {
            session.user.id = user._id.toString();
          }
        }
        return session;
      } catch (error) {
        console.error('Error in session callback:', error);
        return session;
      }
    },
  },
});

export { handler as GET, handler as POST }; 