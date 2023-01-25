const axios = require('axios');
require('dotenv').config();

/////////////////////////// Clarifai API /////////////////////////////////////
const USER_ID = 'balint';
const PAT = process.env.CLARIFAI_PAT;
const APP_ID = 'ztmsmartbrain';
const MODEL_ID = 'face-detection';
/////////////////////////// Clarifai API /////////////////////////////////////

const handleImage = (req, res, db) => {
  const { id } = req.body;
  console.log('-------image----------')
  console.log('req.body: ', req.body)
  console.log('PAT: ', PAT)
  console.log('-------image----------')
  
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
  console.log('-------api----------')
  console.log('req.body: ', req.body)
  console.log('-------api----------')
 
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


// axios.post("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", data, config)
//     .then(response => response.data.outputs[0].data.regions[0].region_info.bounding_box)
//     .then(boxdata => res.json(boxdata))
//     .catch(err => res.status(400).json('unable to get entries'));

axios.post("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", data, config)
    .then(response => {
        let boundingBoxes = response.data.outputs[0].data.regions.map(region => region.region_info.bounding_box);
        let allBoundingBoxes = [].concat(...boundingBoxes);
        //console.log(allBoundingBoxes)
        res.json(allBoundingBoxes)
    })
    .catch(err => res.status(400).json('unable to get entries'));

}

module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall
}
