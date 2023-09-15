const express = require('express');
const mediasRouter = express.Router();
const database = require('./../helpers/database');
const authenticateToken = require('./../helpers/tokenHelper');
const { handleServerError } = require('./../helpers/errorHelper');

/*Travels*/
//with middleware 

mediasRouter.post('/add-media', authenticateToken, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { base64_image, travel_id, date } = req.body;
    
        // Convert base64 to Blob using the helper function
        const binaryData = Buffer.from(base64_image, 'base64');
    
        // Use placeholders for all values in the SQL query
        let itineraryQuery =
            'INSERT INTO medias (travel_id, media_data, date) VALUES (?, ?, ?)';
        const values = [travel_id, binaryData, date];
    
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


  


module.exports = mediasRouter;
