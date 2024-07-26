const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const HikingTrail = require('../models/hikingTrail');

mongoose.connect('mongodb://localhost:27017/trailTrove');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await HikingTrail.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random493 = Math.floor(Math.random() * 493);
        const trail = new HikingTrail({
            location: `${cities[random493].city}, ${cities[random493].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await trail.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
