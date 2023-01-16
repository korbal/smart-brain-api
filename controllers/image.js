const Clarifai = require('clarifai');
const axios = require('axios');

/////////////////////////// Clarifai API /////////////////////////////////////
const USER_ID = 'balint';
const PAT = '1dad4a84dba04c308211a8634769017b';
const APP_ID = 'ztmsmartbrain';
const MODEL_ID = 'face-detection';


const handleImage = (req, res, db) => {
  const { id } = req.body;
  
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0].entries)
  })
  .catch(err => res.status(400).json('unable to get entries'));
}

const handleApiCall = (req, res) => {
  const { input } = req.body;

  const data = {
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
          "data": {
              "image": {
                  "url": input
              }
          }
      }
    ]
};

const config = {
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    }
};

axios.post("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", data, config)
    .then(response => response.data.outputs[0].data.regions[0].region_info.bounding_box)
    .then(boxdata => res.json(boxdata))
    .catch(err => res.status(400).json('unable to get entries'));
}




module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall
}
