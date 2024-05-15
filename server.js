const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Patient = require("./models/patientmodel");
const app = express();
app.use(express.json());
//connect to mongodb database
mongoose
  .connect(
    "mongodb+srv://root:847sug@cluster0.2px7ebs.mongodb.net/patientdetails?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected!");
    app.listen(3000, () => {
      console.log("patient api is running on port3000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
// Registration endpoint
app.post("/patients", async (req, res) => {
  try {
    const { Firstname, Lastname, Email, Picture, Mobilenumber, Password } =
      req.body;
    const hashedPassword = await bcrypt.hash(Password, 10);
    const patient = new Patient({
      Firstname,
      Lastname,
      Email,
      Picture,
      Mobilenumber,
      Password: hashedPassword,
    });
    await patient.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login endpoint
app.post("/patients/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const patient = await Patient.findOne({ Email });
    if (!patient) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(Password, patient.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ patientId: patient._id }, "secret", {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//system administrator can check all data of patients who registered
app.get("/patients", async (req, res) => {
  try {
    const patient = await Patient.find({});
    res.status(200).json(patient);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
//retrieve all data of particular patient when he logged to there account
app.get("/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    res.status(200).json(patient);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
//if patient need to update their details
app.put("/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByIdAndUpdate(id, req.body);
    if (!patient) {
      return res
        .status(404)
        .json({ message: "cannot find patient with id ${id}" });
    }
    const updatedpatient = await Patient.findById(id);
    res.status(200).json(updatedpatient);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
//if system administrator need to remove patient from application
app.delete("/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByIdAndDelete(id, req.body);
    if (!patient) {
      return res
        .status(404)
        .json({ message: "cannot find patient with id ${id}" });
    }
    const removedpatient = await Patient.findById(id);
    res.status(200).json(removedpatient);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
