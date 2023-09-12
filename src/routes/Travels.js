const express = require('express');
const travelsRouter = express.Router();
const database = require('../helpers/database');
const authenticateToken = require('../helpers/tokenHelper');
const { handleServerError } = require('../helpers/errorHelper');

/*Travels*/
//with middleware 

travelsRouter.get('/get-travels', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;

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

travelsRouter.post('/add-travels', authenticateToken, (req, res) => {
  try {
      const {user_id} = req.user;
      const { title, destination, departureDate, returnDate} = req.body;
      let travelQuery = 'SELECT * FROM travels where user_id=? and start_date=? LIMIT 1'
      const travelValues = [user_id, departureDate];
      database.query(travelQuery, travelValues, (err, result) => {
          if (err) {
          handleServerError(res, err);
          } else {
              if (result.length === 0) {
                  let sql = 'INSERT INTO travels (name, title, start_date, end_date, user_id) VALUES (?, ?, ?, ?, ?)';
                  const values = [destination, title, departureDate, returnDate, user_id];
                  database.query(sql, values, (err, result2) => {
                      if (err) {
                      handleServerError(res, err);
                      } else {
                      res.status(200).json({ result2 });
                      }
                  });
              } else {
                  res.status(500).json({ message: 'Existing travel plan on the same day exists' });
              }
          }
      });
      
  } catch (error) {
      handleServerError(res, error);
  }
});

travelsRouter.get('/get-upcoming-travels', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    
    const upcomingQuery = 'SELECT * FROM travels WHERE user_id=? AND start_date > CURDATE() ORDER BY start_date ASC';
    database.query(upcomingQuery, [user_id], (err, result) => {
      if (err) {
        handleServerError(res, err);
      } else {
        res.status(200).json(result);
      }
    });
    
  } catch (error) {
    handleServerError(res, error);
  }
});

travelsRouter.get('/get-completed-travels', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    
    const completedQuery = 'SELECT * FROM travels WHERE user_id=? AND start_date <= CURDATE() ORDER BY start_date DESC';
    database.query(completedQuery, [user_id], (err, result) => {
      if (err) {
        handleServerError(res, err);
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    handleServerError(res, error);
  }
});


module.exports = travelsRouter;
