// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB URI (sanitize for safety before production)
const mongoURI = 'mongodb+srv://thisadarasaneru224:hVmwNmC2AQtEnQNB@cluster0.i2bbggf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const ImageSchema = new mongoose.Schema({
  imglink: { type: String, required: true },
  category: { type: String, enum: ['successful', 'unsuccessful'], required: true }
});

const Image = mongoose.model('Image', ImageSchema);

app.post('/api/images', async (req, res) => {
  try {
    const { imglink, category } = req.body;
    const newImage = new Image({ imglink, category });
    await newImage.save();
    res.status(201).json({ message: 'Image saved' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving image' });
  }
});

app.get('/api/images', async (req, res) => {
  try {
    const images = await Image.find().sort({ _id: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
