const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const HikingTrail = require('./models/hikingTrail');

mongoose.connect('mongodb://localhost:27017/trailTrove');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/hikingTrails', async (req, res) => {
    const hikingTrails = await HikingTrail.find({});
    res.render('hikingTrails/index', {hikingTrails});
});

app.get('/hikingTrails/new', (req, res) => {
    res.render('hikingTrails/new')
})

app.post('/hikingTrails', async (req, res) => {
    const hikingTrail = new HikingTrail(req.body.hikingTrail);
    await hikingTrail.save();
    res.redirect(`/hikingTrails/${hikingTrail._id}`);
})

app.get('/hikingTrails/:id', async (req, res) => {
    const hikingTrail = await HikingTrail.findById(req.params.id);
    res.render('hikingTrails/show', {hikingTrail});
});

app.get('/hikingTrails/:id/edit', async (req, res) => {
    const hikingTrail = await HikingTrail.findById(req.params.id);
    res.render('hikingTrails/edit', {hikingTrail});

})

app.put('/hikingTrails/:id', async (req, res) => {
    const {id} = req.params;
    const hikingTrail = await HikingTrail.findByIdAndUpdate(id, {...req.body.hikingTrail});
    res.redirect(`/hikingTrails/${hikingTrail._id}`);
})

app.delete('/hikingTrails/:id', async (req, res) => {
    const {id} = req.params;
    await HikingTrail.findByIdAndDelete(id);
    res.redirect('/hikingTrails');
})

app.listen(3000, () => {
    console.log('Server started on port 3000');
});