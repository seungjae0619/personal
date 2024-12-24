const express = require("express");
const { Pool } = require("pg");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger.js"); // Import the Swagger spec

const app = express();

// PostgreSQL connection setup
const pool = new Pool({
  user: "tmdwo0619",
  host: "personal-db-instance.cdqauw8qetm0.ap-northeast-2.rds.amazonaws.com",
  database: "personal_db_instance",
  password: "andy050619",
  port: 5432,
  connectionTimeoutMillis: 30000,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Error acquiring client:", err.message);
    console.error("Connection details:", {
      host: "personal-db-instance.cdqauw8qetm0.ap-northeast-2.rds.amazonaws.com",
      port: 5432,
      user: "tmdwo0619",
      database: "personal_db_instance",
    });
  } else {
    console.log("Connected to PostgreSQL database");
    release();
  }
});

// Swagger setup (to serve Swagger UI at /api-docs)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Your existing routes (example route for users)
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM userinfo");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    console.error("Detailed error:", error.stack); // Log more detailed error
    res.status(500).send("Server error");
  }
});

app.use(express.static(path.join(__dirname, "client/somnia_build/build")));

// Catch-all route to serve React app for all other requests
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/somnia_build/build", "index.html"));
});

// Define the port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
