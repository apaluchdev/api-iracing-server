import express from 'express';
import irapi from './iracing-api.js';

const app = express()
const port = process.env.PORT /* Use Azure's port environment variable if available */ || 3001

app.get('/', (req, res) => {
  res.send('Base URL')
})

app.get('/cars', async (req, res) => {
    try {
        let cars = await irapi('https://members-ng.iracing.com/data/car/get');
        res.send(cars)
    }
    catch (error) {
        // TODO log error
        res.send('Internal server error')
    }
})

app.get('/tracks', async (req, res) => {
    try {
        let tracks = await irapi('https://members-ng.iracing.com/data/track/get');
        res.send(tracks)
    }
    catch (error) {
        // TODO log error
        res.send('Internal server error')
    }
})

app.listen(port, () => {
  console.log(`iracing-api server listening on port ${port}`)
})