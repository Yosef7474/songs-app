const Song = require("../models/songs.model");


// create new song
const createSong = async (req, res) => {
    try {
        const { title, artist, album, genre } = req.body;
        if (!title || !artist || !album || !genre) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const song =  new Song({
            title,
            artist,
            album,
            genre
        })
          const savedSong = await song.save();
          res.status(201).json({
      success: true,
      data: savedSong
    });     
    } catch (error) {
        res.status(400).json({
      success: false,
      message: error.message
    });
        
    }
}


// Get song by ID
const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    res.status(200).json({
      success: true,
      data: song
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update song
const updateSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    res.status(200).json({
      success: true,
      data: song
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// Delete song
const deleteSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Song deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Get all songs with optional filtering
const getSongs = async (req, res) => {
  try {
    const { genre, artist, album } = req.query;
    let filter = {};
    
    if (genre) filter.genre = genre;
    if (artist) filter.artist = artist;
    if (album) filter.album = album;

    const songs = await Song.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: songs.length,
      data: songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



module.exports = {
  createSong,
  getSongs,
  getSongById,
  updateSong,
  deleteSong
};