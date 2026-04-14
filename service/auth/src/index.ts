import app from "./app.js";
import dotenv from "dotenv";
import { sql } from "./utils/db.js";
import { createClient } from "redis";

dotenv.config();

export const redisClient = createClient({
  url: process.env.Radis_url,
});

redisClient
  .connect()
  .then(() => console.log("✅ Connected to Redis successfully"))
  .catch((error) => {
    console.error("❌ Error connecting to Redis:", error);
    process.exit(1);
  });

//setting up Postgress SQL here
async function initDB() {
  try {
    await sql`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM PG_type WHERE typname = 'user_role') THEN
                CREATE TYPE user_role AS ENUM ('jobseeker', 'recruiter');
            END IF;
        END
        $$;
        `;

    await sql`
    CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        role user_role NOT NULL,
        bio TEXT,
        resume VARCHAR(255),
        resume_public_id VARCHAR(255),
        profile_pic VARCHAR(255),
        profile_pic_public_id VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        subscription TIMESTAMPTZ
    );
    `;

    await sql`
    CREATE TABLE IF NOT EXISTS skills (
        skill_id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
    );
    `;

    await sql`
    CREATE TABLE IF NOT EXISTS user_skills (
        user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        skill_id INTEGER NOT NULL REFERENCES skills(skill_id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, skill_id)
    );
    `;
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

initDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(
      `Auth Service is running on https://localhost:${process.env.PORT}`,
    );
  });
});

// --------------------------------------------

// This function initializes your PostgreSQL database
// It creates a custom ENUM type and required tables if they don't already exist

// async function initDB() {
//   try {
//     // This block is a PostgreSQL DO block (anonymous code execution)
//     // It allows running procedural logic (like IF conditions)
//     await sql`
//         DO $$  -- Start of anonymous code block
//         BEGIN  -- BEGIN starts the procedural block (like opening a function body)

//             -- Check if a custom ENUM type 'user_role' already exists
//             -- pg_type is a PostgreSQL system catalog table that stores type definitions
//             IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN

//                 -- If not exists, create a new ENUM type
//                 -- ENUM restricts values to predefined options
//                 CREATE TYPE user_role AS ENUM ('jobseeker', 'recruiter');

//             END IF;

//         END
//         $$; -- End of DO block
//         `;

//     // Create 'users' table if it does not exist
//     await sql`
//     CREATE TABLE IF NOT EXISTS users (
//         user_id SERIAL PRIMARY KEY,
//         -- SERIAL = auto-increment integer (1,2,3...)

//         name VARCHAR(100) NOT NULL,
//         -- Stores user name (max 100 chars)

//         email VARCHAR(100) UNIQUE NOT NULL,
//         -- Must be unique (no duplicate emails)

//         password VARCHAR(255) NOT NULL,
//         -- Stores hashed password

//         phone_number VARCHAR(20) NOT NULL,
//         -- Stores phone number

//         role user_role NOT NULL,
//         -- Uses ENUM type ('jobseeker' or 'recruiter')

//         bio TEXT,
//         -- Optional long text

//         resume VARCHAR(255),
//         resume_public_id VARCHAR(255),

//         profile_pic VARCHAR(255),
//         profile_pic_public_id VARCHAR(255),

//         created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
//         -- Stores timestamp with timezone (auto-filled)

//         subscription TIMESTAMPTZ
//         -- Optional subscription expiry date
//     );
//     `;

//     // Create 'skills' table
//     await sql`
//     CREATE TABLE IF NOT EXISTS skills (
//         skill_id SERIAL PRIMARY KEY,
//         name VARCHAR(100) UNIQUE NOT NULL
//         -- Skill name must be unique (e.g., "JavaScript")
//     );
//     `;

//     // Create many-to-many relationship table between users and skills
//     await sql`
//     CREATE TABLE IF NOT EXISTS user_skills (
//         user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
//         -- Foreign key → users table
//         -- ON DELETE CASCADE = delete related rows if user is deleted

//         skill_id INTEGER NOT NULL REFERENCES skills(skill_id) ON DELETE CASCADE,
//         -- Foreign key → skills table

//         PRIMARY KEY (user_id, skill_id)
//         -- Composite primary key (prevents duplicate mappings)
//     );
//     `;

//     console.log("Database initialized successfully.");

//   } catch (error) {
//     console.error("Error initializing database:", error);
//     process.exit(1); // Exit app if DB setup fails
//   }
// }

// user table:
// user_id | name    | email           | password   | phone_number | role       | created_at
// --------+---------+-----------------+------------+--------------+------------+---------------------
// 1       | Prajwal | p@gmail.com     | hashed123  | 9999999999   | jobseeker  | 2026-03-31 10:00:00
// 2       | Rahul   | r@gmail.com     | hashed456  | 8888888888   | recruiter  | 2026-03-31 10:05:00

// SKILLS TABLE
// skill_id | name
// ---------+------------
// 1        | JavaScript
// 2        | Node.js
// 3        | PostgreSQL

// USER_SKILLS TABLE
// user_id | skill_id
// --------+----------
// 1       | 1
// 1       | 2
// 2       | 3
