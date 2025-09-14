// testMongoConnection.js
// Simple script to test MongoDB connection using Mongoose

const mongoose = require('mongoose');

const uri = 'mongodb+srv://shriya29d_db_user:jqPXUo244WeV9Dhx@booknest.pwqiicn.mongodb.net/?retryWrites=true&w=majority&appName=BookNest';

async function testConnection() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ MongoDB connection successful!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();
