const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const PORT = 5000;

const uri = process.env.MONGODB_URI;
const secretKey = process.env.SECRET_KEY;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let collection, collectionUsers;

async function connectToDatabase() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const dbName = "notesKeeper";
    const collectionName = "noteItems";
    const usersCollection = "notesUsers";

    const database = client.db(dbName);
    collection = database.collection(collectionName);
    collectionUsers = database.collection(usersCollection);
  } catch (err) {
    console.error(`Failed to connect to the database: ${err}\n`);
  }
}

connectToDatabase();

// Main route
app.get("/", (req, res) => {
  res.send("Hello World.");
});

app.get("/api/users", async (req, res) => {
  collectionUsers.find().toArray(function (err, docs) {
    console.log(JSON.stringify(docs));
  });
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await collectionUsers.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const result = await collectionUsers.insertOne({
      username,
      email,
      password: hashedPassword,
    });
    res
      .status(201)
      .send({ message: "User created.", userId: result.insertedId });
  } catch (err) {
    console.error(`Failed to sign up: ${err}\n`);
    res.status(500).send({ message: "An error occurred." });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user
    const user = await collectionUsers.findOne({ email });

    if (!user) {
      return res.status(400).send({ message: "Invalid credentials." });
    }

    // Check the password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send({ message: "Invalid credentials." });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });
    res.status(200).send({ token });
  } catch (err) {
    console.error(`Failed to log in: ${err}\n`);
    res.status(500).send({ message: "An error occurred." });
  }
});

// Middleware to authenticate and extract user info
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // Save user info in request
    next();
  });
};

// User info route
app.get("/api/user", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await collectionUsers.findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(404).send({ message: "User not found." });

    res.status(200).send({ username: user.username, email: user.email });
  } catch (err) {
    console.error(`Failed to fetch user info: ${err}\n`);
    res.status(500).send({ message: "An error occurred." });
  }
});

const extractUserId = (req, res, next) => {
  try {
    const userId = req.headers["user-id-header"];

    if (!userId) {
      return res.status(400).json({ error: "User ID missing from request" });
    }

    req.userId = userId;
    next();
  } catch (error) {
    res.status(500).json({ error: "Failed to extract User ID" });
  }
};

app.get("/api/notes", extractUserId, async (req, res) => {
  try {
    // Use the userId extracted by the middleware
    const userId = req.userId;
    if (!userId) {
      return res.status(400).send({ message: "User ID is required" });
    }

    // Retrieve notes for the specific user
    const notes = await collection.find({ userId: userId }).toArray();
    console.log(notes);
    res.status(200).send(notes);
  } catch (err) {
    console.error(`Failed to retrieve notes: ${err}\n`);
    res.status(500).send({ message: "An error occurred." });
  }
});

// Apply the middleware to routes that require it
app.post("/api/notes", extractUserId, async (req, res) => {
  const newNote = { ...req.body, userId: req.userId, status: "incomplete" };
  console.log(newNote);
  try {
    const result = await collection.insertOne(newNote);
    res.status(201).send(result);
  } catch (err) {
    console.error(`Failed to create note: ${err}\n`);
    res.status(500).send({ message: "An error occurred." });
  }
});

app.delete("/api/notes/:id", extractUserId, async (req, res) => {
  const noteID = req.params.id;
  if (!ObjectId.isValid(noteID)) {
    return res.status(400).send({ message: "Invalid ID format." });
  }
  try {
    const result = await collection.deleteOne({
      _id: new ObjectId(noteID),
      userId: req.userId,
    });
    if (result.deletedCount === 0) {
      res.status(404).send({ message: `Note with ID: ${noteID} not found.` });
    } else {
      res.status(200).send({ message: `Note with ID: ${noteID} deleted.` });
    }
  } catch (err) {
    console.error(`Failed to delete note: ${err}\n`);
    res.status(500).send({ message: "An error occurred." });
  }
});

app.put("/api/notes/:id", extractUserId, async (req, res) => {
  const noteID = req.params.id;
  if (!ObjectId.isValid(noteID)) {
    return res.status(400).send({ message: "Invalid ID format." });
  }
  const updatedNote = req.body;
  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(noteID), userId: req.userId }, // Ensure the note belongs to the user
      { $set: updatedNote }
    );
    if (result.matchedCount === 0) {
      res.status(404).send({ message: `Note with ID: ${noteID} not found.` });
    } else {
      res.status(200).send(updatedNote);
    }
  } catch (err) {
    console.error(`Failed to update note: ${err}\n`);
    res.status(500).send({ message: "An error occurred." });
  }
});

// Listening to the PORT
app.listen(PORT, () => console.log(`Listening at ${PORT}`));
