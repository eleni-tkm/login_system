const express = require("express");
const session = require("express-session");
const mysql = require("mysql");
const dotenv = require("dotenv");
const paginate = require('express-paginate');
const util = require('util');
const app = express();

dotenv.config({ path: "./.env" });

app.set("view engine", "ejs");
const port = process.env.PORT;
const bcrypt = require("bcryptjs");
app.use(paginate.middleware(10, 50));
app.use(express.urlencoded({ extended: "false" }));
app.use(express.json());
// other imports
const path = require("path");

const publicDir = path.join(__dirname, "./public");

app.use(express.static(publicDir));

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MySQL connected!");
  }
});

const query = util.promisify(db.query).bind(db);

// Session middleware
app.use(
  session({
    secret: process.env.SECRET, // Your secret key
    resave: false,              // Do not resave session if nothing is modified
    saveUninitialized: true,    // Save uninitialized sessions
   
  })
);


app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    // User is logged in, proceed to the next middleware or route
    return next();
  }
  // Redirect to login if the user is not authenticated
  res.redirect("/login");
}


app.get("/main",isAuthenticated, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const currentPage = parseInt(req.query.page) || 1; // Default to page 1
    const search = req.query.search || ""; // Get the search query from the request
    const offset = (currentPage - 1) * limit;

    // Get the total count of rows, with search filtering if applicable
    const countQuery = `
      SELECT COUNT(*) AS count 
      FROM scien_staff 
      WHERE Name LIKE ? OR Sirname LIKE ? OR Specialization LIKE ? OR Email LIKE ? OR Nationallity LIKE ?
    `;
    const totalCount = await new Promise((resolve, reject) => {
      db.query(countQuery, Array(5).fill(`%${search}%`), (err, result) => {
        if (err) return reject(err);
        resolve(result[0].count);
      });
    });

    // Fetch paginated results with search filtering
    const dataQuery = `
      SELECT * 
      FROM scien_staff 
      WHERE Name LIKE ? OR Sirname LIKE ? OR Specialization LIKE ? OR Email LIKE ? OR Nationallity LIKE ?
      LIMIT ? OFFSET ?
    `;
    const results = await new Promise((resolve, reject) => {
      db.query(dataQuery, [...Array(5).fill(`%${search}%`), limit, offset], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    const pageCount = Math.ceil(totalCount / limit); // Total number of pages

    // Generate the pagination array
    const pages = Array.from({ length: pageCount }, (_, i) => ({
      number: i + 1,
      active: i + 1 === currentPage,
    }));

    // Render the view and pass variables
    res.render("main", {
      scientificStaff: results,
      pageCount,
      totalCount,
      currentPage,
      pages,
      limit,
      search, // Pass the search query back to the template for reference
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
  
  
// Login Authentication Route
app.post("/auth/login", async (req, res) => {
  const { name, password } = req.body;
  const search="";
  if (!name || !password) {
    return res.status(400).send("Name and password are required!");
  }

  try {
    // Check credentials in the database
    const queryString = "SELECT * FROM users WHERE name = ?";
    const results = await query(queryString, [name]);

    // If no user is found
    if (!results.length) {
      return res.status(401).send("Not Authorized");
    }

    const user = results[0];

    // Compare the passwords using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const limit = 10;  // Default limit
      const currentPage = 1; // Default to page 1
      const offset = (currentPage - 1) * limit;

      // Count query for total records
      const countQuery = "SELECT COUNT(*) AS count FROM scien_staff";
      const totalCountResult = await query(countQuery);
      const totalCount = totalCountResult[0].count;

      // Data query with pagination
      const dataQuery = "SELECT * FROM scien_staff LIMIT ? OFFSET ?";
      const staffResults = await query(dataQuery, [limit, offset]);

      // Calculate page count and pagination structure
      const pageCount = Math.ceil(totalCount / limit);
      const pages = Array.from({ length: pageCount }, (_, i) => ({
        number: i + 1,
        active: i + 1 === currentPage,
      }));
      req.session.user = {
        id: user.id,
        name: user.name,
      };
      // Render the view and pass pagination variables
      res.redirect(`/main?limit=${limit}&page=${currentPage}&search=${encodeURIComponent(search)}`);
  
    } else {
      // Invalid password
      res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    console.error("Error during login or database query:", error);
    res.status(500).send("Server error");
  }
});
  
  
app.get("/mainPublic", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const currentPage = parseInt(req.query.page) || 1; // Default to page 1
    const search = req.query.search || ""; // Get the search query from the request
    const offset = (currentPage - 1) * limit;

    // Get the total count of rows, with search filtering if applicable
    const countQuery = `
      SELECT COUNT(*) AS count 
      FROM scien_staff 
      WHERE Name LIKE ? OR Sirname LIKE ? OR Specialization LIKE ? OR Email LIKE ? OR Nationallity LIKE ?
    `;
    const totalCount = await new Promise((resolve, reject) => {
      db.query(countQuery, Array(5).fill(`%${search}%`), (err, result) => {
        if (err) return reject(err);
        resolve(result[0].count);
      });
    });

    // Fetch paginated results with search filtering
    const dataQuery = `
      SELECT * 
      FROM scien_staff 
      WHERE Name LIKE ? OR Sirname LIKE ? OR Specialization LIKE ? OR Email LIKE ? OR Nationallity LIKE ?
      LIMIT ? OFFSET ?
    `;
    const results = await new Promise((resolve, reject) => {
      db.query(dataQuery, [...Array(5).fill(`%${search}%`), limit, offset], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    const pageCount = Math.ceil(totalCount / limit); // Total number of pages

    // Generate the pagination array
    const pages = Array.from({ length: pageCount }, (_, i) => ({
      number: i + 1,
      active: i + 1 === currentPage,
    }));

    // Render the view and pass variables
    res.render("mainPublic", {
      scientificStaff: results,
      pageCount,
      totalCount,
      currentPage,
      pages,
      limit,
      search, // Pass the search query back to the template for reference
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});



// Login Authentication Route
app.post("/auth/login", async (req, res) => {
const { name, password } = req.body;

if (!name || !password) {
  return res.status(400).send("Name and password are required!");
}

try {
  // Check credentials in the database
  const queryString = "SELECT * FROM users WHERE name = ?";
  const results = await query(queryString, [name]);

  // If no user is found
  if (!results.length) {
    return res.status(401).send("Not Authorized");
  }

  const user = results[0];

  // Compare the passwords using bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (isPasswordValid) {
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const currentPage = parseInt(req.query.page) || 1; // Default to page 1
    const search = req.query.search || ""; // Get the search query from the request
    const offset = (currentPage - 1) * limit;

    // Get the total count of rows, with search filtering if applicable
    const countQuery = `
      SELECT COUNT(*) AS count 
      FROM scien_staff 
      WHERE Name LIKE ? OR Sirname LIKE ? OR Specialization LIKE ? OR Email LIKE ?
    `;
    const totalCount = await new Promise((resolve, reject) => {
      db.query(countQuery, Array(4).fill(`%${search}%`), (err, result) => {
        if (err) return reject(err);
        resolve(result[0].count);
      });
    });

    // Fetch paginated results with search filtering
    const dataQuery = `
      SELECT * 
      FROM scien_staff 
      WHERE Name LIKE ? OR Sirname LIKE ? OR Specialization LIKE ? OR Email LIKE ?
      LIMIT ? OFFSET ?
    `;
    const results = await new Promise((resolve, reject) => {
      db.query(dataQuery, [...Array(4).fill(`%${search}%`), limit, offset], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    const pageCount = Math.ceil(totalCount / limit); // Total number of pages

    // Generate the pagination array
    const pages = Array.from({ length: pageCount }, (_, i) => ({
      number: i + 1,
      active: i + 1 === currentPage,
    }));

    // Render the view and pass variables
    res.render("main", {
      scientificStaff: results,
      pageCount,
      totalCount,
      currentPage,
      pages,
      limit,
      search: search || "",  // Pass the search query back to the template for reference
    });
  } else {
    // Invalid password
    res.status(401).send("Invalid credentials");
  }
} catch (error) {
  console.error("Error during login or database query:", error);
  res.status(500).send("Server error");
}
});


// Handle form submission and insert data into the database

app.get("/add", (req, res) => {
  res.render("addition_form"); // Render the form for adding staff
});

app.post("/add", (req, res) => {
  const { name, sirname, specialization, email, nationallity } = req.body;

  // SQL query to insert data into the scien_staff table
  const query =
    "INSERT INTO scien_staff (Name, Sirname, Specialization, Email, Nationallity) VALUES (?, ?, ?, ?, ?)";

  db.query(query, [name, sirname, specialization, email, nationallity], (err, result) => {
    if (err) throw err;
    console.log("Staff member added to the database");

    // After insertion, render the addition_form.ejs with a success message
    // res.render('addition_form', { message: 'Staff member added successfully!' });
  });
});

// Handle form submission and insert data into the database
app.post("/add-staff", (req, res) => {
  const { name, sirname, specialization, email, nationallity } = req.body;

  // SQL query to insert data into the scien_staff table
  const query =
    "INSERT INTO scien_staff (Name, Sirname, Specialization, Email, Nationallity) VALUES (?, ?, ?, ?, ?)";

  db.query(query, [name, sirname, specialization, email, nationallity], (err, result) => {
    if (err) throw err;
    console.log("Staff member added to the database");
    // Redirect or respond to confirm the submission
    // Respond with a message and instructions for redirection
    res.send(`
                <p>Staff member added successfully!</p>
                <p>You will be redirected to the main page in 5 seconds...</p>
                <script>
                    setTimeout(() => {
                        window.location.href = '/main';
                    }, 5000);
                </script>
            `);
  });
});


app.get("/editstaff",isAuthenticated, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const currentPage = parseInt(req.query.page) || 1; // Default to page 1
    const search = req.query.search || ""; // Get the search query from the request
    const offset = (currentPage - 1) * limit;

    // Get the total count of rows, with search filtering if applicable
    const countQuery = `
      SELECT COUNT(*) AS count 
      FROM scien_staff 
      WHERE Name LIKE ? OR Sirname LIKE ? OR Specialization LIKE ? OR Email LIKE ? OR Nationallity LIKE ?
    `;
    const totalCount = await new Promise((resolve, reject) => {
      db.query(countQuery, Array(5).fill(`%${search}%`), (err, result) => {
        if (err) return reject(err);
        resolve(result[0].count);
      });
    });

    // Fetch paginated results with search filtering
    const dataQuery = `
      SELECT * 
      FROM scien_staff 
      WHERE Name LIKE ? OR Sirname LIKE ? OR Specialization LIKE ? OR Email LIKE ? OR Nationallity LIKE ?
      LIMIT ? OFFSET ?
    `;
    const results = await new Promise((resolve, reject) => {
      db.query(dataQuery, [...Array(5).fill(`%${search}%`), limit, offset], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    const pageCount = Math.ceil(totalCount / limit); // Total number of pages

    // Generate the pagination array
    const pages = Array.from({ length: pageCount }, (_, i) => ({
      number: i + 1,
      active: i + 1 === currentPage,
    }));

    // Render the view and pass variables
    res.render("editstaff", {
      scientificStaff: results,
      pageCount,
      totalCount,
      currentPage,
      pages,
      limit,
      search, // Pass the search query back to the template for reference
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});


app.get("/deletestaff",isAuthenticated, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const currentPage = parseInt(req.query.page) || 1; // Default to page 1
    const search = req.query.search || ""; // Get the search query from the request
    const offset = (currentPage - 1) * limit;

    // Get the total count of rows, with search filtering if applicable
    const countQuery = `
      SELECT COUNT(*) AS count 
      FROM scien_staff 
      WHERE Name LIKE ? OR Sirname LIKE ? OR Specialization LIKE ? OR Email LIKE ? OR Nationallity LIKE ?
    `;
    const totalCount = await new Promise((resolve, reject) => {
      db.query(countQuery, Array(5).fill(`%${search}%`), (err, result) => {
        if (err) return reject(err);
        resolve(result[0].count);
      });
    });

    // Fetch paginated results with search filtering
    const dataQuery = `
      SELECT * 
      FROM scien_staff 
      WHERE Name LIKE ? OR Sirname LIKE ? OR Specialization LIKE ? OR Email LIKE ? OR Nationallity LIKE ?
      LIMIT ? OFFSET ?
    `;
    const results = await new Promise((resolve, reject) => {
      db.query(dataQuery, [...Array(5).fill(`%${search}%`), limit, offset], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    const pageCount = Math.ceil(totalCount / limit); // Total number of pages

    // Generate the pagination array
    const pages = Array.from({ length: pageCount }, (_, i) => ({
      number: i + 1,
      active: i + 1 === currentPage,
    }));

    // Render the view and pass variables
    res.render("deletestaff", {
      scientificStaff: results,
      pageCount,
      totalCount,
      currentPage,
      pages,
      limit,
      search, // Pass the search query back to the template for reference
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// POST route to update a staff member
app.post("/savechange", async (req, res) => {
  const { id, Name, Sirname, Specialization, Email, Nationallity } = req.body; // Get the data from the form

  try {
    // Dynamically build the query for only the provided fields
    const fieldsToUpdate = [];
    const values = [];

    if (Name) {
      fieldsToUpdate.push("Name = ?");
      values.push(Name);
    }
    if (Sirname) {
      fieldsToUpdate.push("Sirname = ?");
      values.push(Sirname);
    }
    if (Specialization) {
      fieldsToUpdate.push("Specialization = ?");
      values.push(Specialization);
    }
    if (Email) {
      fieldsToUpdate.push("Email = ?");
      values.push(Email);
    }

    if (Nationallity) {
      fieldsToUpdate.push("Nationallity = ?");
      values.push(Nationallity);
    }

    // Check if there are fields to update
    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Add the ID to the values array for the WHERE clause
    values.push(id);

    // Construct the SQL query
    const sql = `UPDATE scien_staff SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;

    // Use the promisified version of the query for async/await
    const query = util.promisify(db.query).bind(db);
    const result = await query(sql, values);

    // Check if any rows were updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Record not found or no changes made" });
    }

    // Redirect back to the page with a success message
    res.redirect("/editstaff"); // Adjust the redirect path as needed
  } catch (error) {
    console.error("Error updating record:", error);
    res.status(500).send("Internal server error");
  }
});


app.post("/deleteStaff/:id", isAuthenticated, async (req, res) => {
  const staffId = req.params.id;

  try {
    // SQL query to delete the staff member with the given ID
    const deleteQuery = `
      DELETE FROM scien_staff 
      WHERE id = ?
    `;

    await new Promise((resolve, reject) => {
      db.query(deleteQuery, [staffId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    // After deletion, redirect back to the edit staff page
    res.redirect("/main");

  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting staff member");
  }
});



app.get("/caseStudies", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const currentPage = parseInt(req.query.page) || 1; // Default to page 1
    const search = req.query.search || ""; // Get the search query from the request
    const offset = (currentPage - 1) * limit;

    // Get the total count of rows, with search filtering if applicable
    const countQuery = `
      SELECT COUNT(*) AS count 
      FROM case_studies 
      WHERE year LIKE ? OR author LIKE ? OR category LIKE ? OR title LIKE ? OR description LIKE ? OR file_link LIKE ?
    `;
    const totalCount = await new Promise((resolve, reject) => {
      db.query(countQuery, Array(6).fill(`%${search}%`), (err, result) => {
        if (err) return reject(err);
        resolve(result[0].count);
      });
    });

    // Fetch paginated results with search filtering
    const dataQuery = `
      SELECT * 
      FROM case_studies 
      WHERE year LIKE ? OR author LIKE ? OR category LIKE ? OR title LIKE ? OR description LIKE ? OR file_link LIKE ?
      LIMIT ? OFFSET ?
    `;
    const results = await new Promise((resolve, reject) => {
      db.query(dataQuery, [...Array(6).fill(`%${search}%`), limit, offset], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    const pageCount = Math.ceil(totalCount / limit); // Total number of pages

    // Generate the pagination array
    const pages = Array.from({ length: pageCount }, (_, i) => ({
      number: i + 1,
      active: i + 1 === currentPage,
    }));

    // Render the view and pass variables
    res.render("caseStudies", {
      caseStudies: results,
      pageCount,
      totalCount,
      currentPage,
      pages,
      limit,
      search, // Pass the search query back to the template for reference
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});


app.listen(port, () => {
  console.log(`server started on port ${port}`);
});



