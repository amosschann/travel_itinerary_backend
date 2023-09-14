const express = require('express');
const itineraryRouter = express.Router();
const database = require('../helpers/database');
const authenticateToken = require('../helpers/tokenHelper');
const { handleServerError } = require('../helpers/errorHelper');

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
    // console.log(travel_id, date, start_time, end_time, activity_name)
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

itineraryRouter.get('/get-current-date-itinerary', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const {travel_id, date} = req.query;
    let itineraryQuery = 'SELECT * FROM itineraries WHERE travel_id= ? and date=? ORDER BY start_time ASC'
    const values = [travel_id, date];
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

itineraryRouter.post('/delete-itinerary', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { activity_id } = req.body;
    // console.log(travel_id, date, start_time, end_time, activity_name)
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