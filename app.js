// Import the required modules
import mysql2 from "mysql2";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

// Create a connection pool for sql
const pool = mysql2
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  })
  .promise();

// Create an instance
const app = express();

// Define a port number
const PORT = 3001;

// Enable static file serving
app.use(express.static("public"));

// App middleware to allow the app to parse form data
// Access form data through req.body
app.use(express.urlencoded({ extended: true }));

// Set view engine to EJS
app.set("view engine", "ejs");

// Define a default route ("/")
app.get("/", (req, res) => {
  res.render("home");
});

// app.get("/db-test", async (req, res) => {
//   try {
//     const [orders] = await pool.query("SELECT * FROM orders");
//     res.send(orders);
//     // Remember order[0] or [order] has information we see, order[1] has metadata
//   } catch (err) {
//     console.error("Database error ", err);
//     res.status(500).send("Database error occurred.");
//   }
// });

app.post("/submit-order", async (req, res) => {
  try {
    const order = req.body;

    console.log(order);

    // Convert toppings array to a comma separated string
    order.toppings = Array.isArray(order.toppings)
      ? order.toppings.join(", ")
      : "";

    // SQL INSERT query with placeholders to prevent SQL injection
    const sql = `INSERT INTO orders(customer, email, flavor, cone, toppings, comment) 
    VALUES (?, ?, ?, ?, ?, ?);`;

    const params = [
      order.customer,
      order.email,
      order.flavor,
      order.cone,
      order.toppings,
      order.comment ?? null,
    ];

    const [result] = await pool.execute(sql, params);

    order.id = result.insertId;
    console.log("Order saved with ID:", order.id);

    //Display the confirmation page
    res.render("confirm", { order });
  } catch (err) {
    console.error("Error saving order:", err);
    res
      .status(500)
      .send(
        `Sorry, there was an error processing your order. Please try again.`,
      );
  }
});

// Display all orders

app.get("/admin", async (req, res) => {
  try {
    // Fetch all orders from database, most recent first
    const [orders] = await pool.query(`SELECT * FROM orders
                ORDER BY timestamp DESC`);

    // Render the admin page
    res.render("admin", { orders });
  } catch (err) {
    console.error("Database error:", err);

    res.status(500).send("Error loading orders: " + err.message);
  }
});

// Start server on designated port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
