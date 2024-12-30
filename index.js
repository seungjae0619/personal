const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger.js"); // Import the Swagger spec
const app = express();
const { Pool } = require("pg");
const fs = require("fs");

const cors = require("cors");
app.use(cors());

app.use(express.json());

const sslRootCert = fs.readFileSync(
  path.resolve(__dirname, "/Users/tmdwo0619/downloads/global-bundle.pem")
);
// Now, set up the PostgreSQL connection using the forwarded port
const pool = new Pool({
  user: "tmdwo0619",
  host: "personal-db-instance.cdqauw8qetm0.ap-northeast-2.rds.amazonaws.com", // Local address to forward traffic to RDS
  database: "personal_db_instance",
  password: "andy050619",
  port: 5432,
  ssl: {
    rejectUnauthorized: true, // Ensures that SSL certificates are verified
    ca: sslRootCert, // Provide the root certificate for SSL verification
  }, // Port that the SSH tunnel forwards
});

pool.connect((err, client, done) => {
  if (err) {
    console.error("Error connecting to RDS:", err);
  } else {
    console.log("Successfully connected to RDS.");
  }
  done();
});

// Swagger setup (to serve Swagger UI at /api-docs)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Your existing routes (example route for users)
app.get("/userinfo", async (req, res) => {
  try {
    console.log("Executing query to fetch users...");
    const result = await pool.query("SELECT * FROM userinfo");
    console.log(
      "Query executed successfully, number of users: ",
      result.rows.length
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    console.error("Detailed error:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Example POST route for adding user information
app.post("/userinfo", async (req, res) => {
  const { user_name, user_email, gender, age, fb_uid, user_pw } = req.body;

  if (!user_name || !user_email || !gender || !age || !fb_uid || !user_pw) {
    return res.status(400).json({ message: "Bad Request" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO userinfo (user_name, user_email, gender, age, fb_uid, user_pw ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [user_name, user_email, gender, age, fb_uid, user_pw]
    );
    res.status(201).json({
      message: "User added successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/userinfo/:user_pw", async (req, res) => {
  const { user_pw } = req.params; // Get user password from the URL (acting as the unique identifier)
  const { user_name, user_email, gender, age, fb_uid } = req.body; // Get new data from the request body

  // Check if the required fields are provided
  if (!user_name || !user_email || !gender || !age || !fb_uid) {
    return res.status(400).json({ message: "Bad Request. Missing fields." });
  }

  try {
    // Update query using PostgreSQL
    const result = await pool.query(
      `UPDATE userinfo
       SET user_name = $1, user_email = $2, gender = $3, age = $4, fb_uid = $5
       WHERE user_pw = $6
       RETURNING *`,
      [user_name, user_email, gender, age, fb_uid, user_pw]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE user by user_id
app.delete("/userinfo/:user_pw", async (req, res) => {
  const { user_id } = req.params;

  try {
    // Delete the user from the database by user_id
    const result = await pool.query(
      "DELETE FROM userinfo WHERE user_id = $1 RETURNING *",
      [user_id]
    );

    if (result.rows.length === 0) {
      // If no user was deleted, return 404
      return res.status(404).json({
        message: `User with ID ${user_id} not found.`,
      });
    }

    // Respond with success message and deleted user data
    res.status(200).json({
      message: "User deleted successfully",
      user: result.rows[0], // Return the deleted user object
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/diary", async (req, res) => {
  try {
    console.log("Executing query to fetch diary entries...");
    const result = await pool.query("SELECT * FROM diary");
    console.log(
      "Query executed successfully, number of diary entries: ",
      result.rows.length
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching diary entries:", error);
    console.error("Detailed error:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.use(express.static(path.join(__dirname, "client/client_build/build")));

// Catch-all route to serve React app for all other requests
app.get("/seungjae.com", (req, res) => {
  res.sendFile(path.join(__dirname, "client/client_build/build", "index.html"));
});

// Define the port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
