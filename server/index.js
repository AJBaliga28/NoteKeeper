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

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await collectionUsers.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await collectionUsers.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Invalid credentials." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });
    res.status(200).send({ token });
  } catch (err) {
    console.error(`Failed to log in: ${err}\n`);
    res.status(500).send({ message: "An error occurred." });
  }
});

const authenticateAndExtractUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    if (!user || !user.userId) {
      return res.status(400).json({ message: "User ID missing from request" });
    }

    req.user = user;
    req.userId = user.userId;
    next();
  });
};

app.get("/api/user", authenticateAndExtractUser, async (req, res) => {
  try {
    const user = await collectionUsers.findOne({
      _id: new ObjectId(req.user.userId),
    });
    if (!user) return res.status(404).send({ message: "User not found." });
    res.status(200).send({ username: user.username, email: user.email });
  } catch (err) {
    console.error(`Failed to fetch user info: ${err}\n`);
    res.status(500).send({ message: "An error occurred." });
  }
});

app.get("/api/notes", authenticateAndExtractUser, async (req, res) => {
  try {
    const notes = await collection.find({ userId: req.userId }).toArray();
    res.status(200).send(notes);
  } catch (err) {
    console.error(`Failed to retrieve notes: ${err}\n`);
    res.status(500).send({ message: "An error occurred." });
  }
});

app.post("/api/notes", authenticateAndExtractUser, async (req, res) => {
  const newNote = { ...req.body, userId: req.userId, status: "incomplete" };
  try {
    const result = await collection.insertOne(newNote);
    if (result.insertedId) {
      newNote._id = result.insertedId;
      res.status(201).send(newNote);
    } else {
      res.status(500).send({ message: "Failed to create note." });
    }
  } catch (err) {
    console.error(`Failed to create note: ${err}\n`);
    res.status(500).send({ message: "An error occurred." });
  }
});

app.delete("/api/notes/:id", authenticateAndExtractUser, async (req, res) => {
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

app.put("/api/notes/:id", authenticateAndExtractUser, async (req, res) => {
  const noteID = req.params.id;
  const { title, content, status } = req.body;
  // console.log("from put: ", title, content, status);
  if (!ObjectId.isValid(noteID)) {
    console.error("Invalid ID format:", noteID);
    return res.status(400).send({ message: "Invalid ID format." });
  }

  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(noteID), userId: req.userId }, // Ensure note belongs to the user
      { $set: { title, content, status } }
    );

    if (result.matchedCount === 0) {
      console.error("Note not found with ID:", noteID);
      return res
        .status(404)
        .send({ message: `Note with ID: ${noteID} not found.` });
    }

    console.log("Note updated successfully:", noteID);
    res.status(200).json({ _id: noteID, title, content, status });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => console.log(`Listening at ${PORT}`));
