const Song = require('../models/songs.model');

const getStatistics = async (req, res) => {
  try {
    // Get total counts
    const totalSongs = await Song.countDocuments();
    const totalArtists = await Song.distinct('artist').then(artists => artists.length);
    const totalAlbums = await Song.distinct('album').then(albums => albums.length);
    const totalGenres = await Song.distinct('genre').then(genres => genres.length);

    // Songs per genre
    const songsPerGenre = await Song.aggregate([
      {
        $group: {
          _id: '$genre',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Songs and albums per artist
    const artistStats = await Song.aggregate([
      {
        $group: {
          _id: '$artist',
          songCount: { $sum: 1 },
          albums: { $addToSet: '$album' }
        }
      },
      {
        $project: {
          artist: '$_id',
          songCount: 1,
          albumCount: { $size: '$albums' },
          albums: 1
        }
      },
      { $sort: { songCount: -1 } }
    ]);

    // Songs per album
    const albumStats = await Song.aggregate([
      {
        $group: {
          _id: { artist: '$artist', album: '$album' },
          songCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          artist: '$_id.artist',
          album: '$_id.album',
          songCount: 1
        }
      },
      { $sort: { artist: 1, songCount: -1 } }
    ]);

    // Recent additions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSongs = await Song.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        total: {
          songs: totalSongs,
          artists: totalArtists,
          albums: totalAlbums,
          genres: totalGenres
        },
        songsPerGenre,
        artistStats,
        albumStats,
        recentAdditions: recentSongs
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getStatistics
};