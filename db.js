const mongoose = require("mongoose");

async function connectDb() {
  await mongoose.connect(process.env.ATLAS_URI);
}

module.exports = { connectDb };
