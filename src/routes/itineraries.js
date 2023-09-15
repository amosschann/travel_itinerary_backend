const express = require('express');
const itineraryRouter = express.Router();
const database = require('../helpers/database');
const authenticateToken = require('../helpers/tokenHelper');
const { handleServerError } = require('../helpers/errorHelper');
const { Blob } = require('buffer');

/*Itineraries*/
//with middleware 

itineraryRouter.get('/get-itinerary', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { travel_id } = req.travel_id;
    
    const getUpcomingTravel = () => {
      return new Promise((resolve, reject) => {
        const upcomingQuery = 'SELECT * FROM travels WHERE user_id=? AND start_date > CURDATE() ORDER BY start_date ASC LIMIT 1 ';
        database.query(upcomingQuery, [user_id], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result[0]);
          }
        });
      });
    };

    const getCompletedTravel = () => {
      return new Promise((resolve, reject) => {
        const completedQuery = 'SELECT * FROM travels WHERE user_id=? AND start_date <= CURDATE() ORDER BY start_date DESC LIMIT 1 ';
        database.query(completedQuery, [user_id], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result[0]);
          }
        });
      });
    };

    const [upcomingTravel, completedTravel] = await Promise.all([
      getUpcomingTravel(),
      getCompletedTravel()
    ]);

    res.status(200).json({ upcomingTravel, completedTravel });
  } catch (error) {
    handleServerError(res, error);
  }
});

itineraryRouter.post('/add-itinerary', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { activity_name, start_time, end_time, travel_id, date } = req.body;
    let itineraryQuery = 'INSERT INTO itineraries (travel_id, date, start_time, end_time, activity_name) VALUES (?, ?, ?, ?, ?)'
    const values = [travel_id, date, start_time, end_time, activity_name];
    database.query(itineraryQuery, values, (err, result) => {
        if (err) {
        handleServerError(res, err);
        } else {
        res.status(200).json({ result });
        }
    });
  } catch (error) {
    handleServerError(res, error);
  }
});

itineraryRouter.get('/get-current-date-itinerary-and-medias', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const {travel_id, date} = req.query;
    
    const values = [travel_id, date];
    const getCurrentDateItinerary = () => {
      return new Promise((resolve, reject) => {
        let itineraryQuery = 'SELECT * FROM itineraries WHERE travel_id= ? and date=? ORDER BY start_time ASC'
        database.query(itineraryQuery, values, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
      });
      });
    };

    const getCurrentDateMedias = () => {
      return new Promise((resolve, reject) => {
        let mediaQuery = 'SELECT * FROM medias WHERE travel_id= ? and date=? ORDER BY id ASC'
        database.query(mediaQuery, values, (err, results) => {
          if (err) {
            reject(err);
          } else {
            // Assuming results is an array of media data rows
            const mediaDataArray = [];
    
            for (const row of results) {
              if (row.media_data) {
                const binaryData = row.media_data;
                // Convert binary data to Base64
                const base64Data = Buffer.from(binaryData).toString('base64');
                mediaDataArray.push(base64Data);
              }
            }
    
            resolve(mediaDataArray);
          }
        });
      });
    };

    const [itineraries, medias] = await Promise.all([
      getCurrentDateItinerary(),
      getCurrentDateMedias()
    ]);

    if (itineraries.length === 0 && medias.length === 0) {
      //if both itineraries and medias are empty, return an empty JSON response
      res.status(200).json({}); // Empty JSON object
    } else if (medias.length === 0) {
      res.status(200).json({ itineraries });
    } else if (itineraries.length === 0) {
      res.status(200).json({ "media_data": medias });
    } else {
      res.status(200).json({ itineraries, "media_data": medias });
    }
    
  
  } catch (error) {
    handleServerError(res, error);
  }
});

itineraryRouter.post('/delete-itinerary', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { activity_id } = req.body;
    let itineraryQuery = 'DELETE FROM itineraries WHERE ID=?'
    const values = [activity_id];
    database.query(itineraryQuery, values, (err, result) => {
        if (err) {
        handleServerError(res, err);
        } else {
        res.status(200).json({ result });
        }
    });
  } catch (error) {
    handleServerError(res, error);
  }
});

module.exports = itineraryRouter;