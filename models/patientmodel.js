const mongoose = require("mongoose");

const patientschema = mongoose.Schema(
  {
    Firstname: {
      type: String,
      required: [true, "please enter First name"],
    },
    Lastname: {
      type: String,
    },
    Mobilenumber: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Picture: {
      type: String,
      required: false,
    },
    Password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const patient = mongoose.model("patient", patientschema);
module.exports = patient;
