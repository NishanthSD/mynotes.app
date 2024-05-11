const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;
const uri = "mongodb+srv://nishanth:Soviet1922@cluster0.yxrvdc4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Define the schema for notes
const noteSchema = new mongoose.Schema({
  title: String,
  description: String,
  severity: String,
  relevance: String,
  timestamp: { type: Date, default: Date.now }
});
const Note = mongoose.model('Note', noteSchema);

// Routes
app.post('/notes', async (req, res) => {
  const { title, description, severity, relevance } = req.body;
  try {
    const note = new Note({ title, description, severity, relevance });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/notes/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      res.status(404).json({ error: 'Note not found' });
    } else {
      res.json(deletedNote);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ timestamp: 1 });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
