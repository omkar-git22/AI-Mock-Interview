/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:3ksG4TeuOiZx@ep-green-feather-a5a842t0.us-east-2.aws.neon.tech/AI_Mock_Interview?sslmode=require',
    }
  };