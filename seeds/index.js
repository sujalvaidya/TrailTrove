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
    for (let i = 0; i < 300; i++) {
        const random493 = Math.floor(Math.random() * 493);
        const price = Math.floor(Math.random() * 300) + 20;
        const trail = new HikingTrail({
            author: '66a5c06430a85f7f49f68298',
            location: `${cities[random493].city}, ${cities[random493].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur beatae doloremque ea, eius facilis fugit illo, labore molestias, nam nihil nisi quasi quo rerum sed veniam. Aperiam distinctio sed voluptate?',
            price: price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random493].longitude,
                    cities[random493].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dnipaqldf/image/upload/v1722163959/TrailTrove/u0fhz7qzixfwybtcopmy.jpg',
                    filename: 'TrailTrove/u0fhz7qzixfwybtcopmy',
                },
                {
                    url: 'https://res.cloudinary.com/dnipaqldf/image/upload/v1722163959/TrailTrove/qek9q8dtlqnuqe2vrhhd.jpg',
                    filename: 'TrailTrove/qek9q8dtlqnuqe2vrhhd',
                }
            ]
        })
        await trail.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
