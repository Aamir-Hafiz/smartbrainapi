
const Clarifai = require('clarifai');
 console.log('Aamir I am Trying to detect face');
//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
  /*apiKey: 'YOUR_API_KEY_HERE'*/
 apiKey: 'ecb05f5897fb41c6a93c274158f65b35'
});
 console.log(app.status);
const handleApiCall = (req, res) => {
  console.log('Aamir I am Trying to detect face 2');
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
  handleImage,
  handleApiCall
}