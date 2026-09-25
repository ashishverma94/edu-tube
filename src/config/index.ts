export const config = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isDev: process.env.NODE_ENV === "development",

  database: {
    url: process.env.DATABASE_URL!,
  },

  cors: {
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
  },
};