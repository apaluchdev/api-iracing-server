import express from 'express';
import irapi from './iracing-api.js';

const app = express()
const port = process.env.PORT || 3001

app.get('/', (req, res) => {
  res.send('iRacing API wrapper')
})

app.get('/cars', async (req, res) => {
    try {
        let cars = await irapi('https://members-ng.iracing.com/data/car/get');
        res.send(cars)
    }
    catch (error) {
        res.send('Internal server error')
    }
})

app.get('/documentation', async (req, res) => {
    try {
        let documentation = await irapi('https://members-ng.iracing.com/data');
        res.send(documentation)
    }
    catch (error) {
        res.send('Internal server error')
    }
})

app.get('/tracks', async (req, res) => {
    try {
        let tracks = await irapi('https://members-ng.iracing.com/data/track/get');
        res.send(tracks)
    }
    catch (error) {
        res.send('Internal server error')
    }
})

app.listen(port, () => {
  console.log(`iracing-api server listening on port ${port}`)
})