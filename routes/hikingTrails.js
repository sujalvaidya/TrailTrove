const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const HikingTrail = require('../models/hikingTrail');
const {isLoggedIn, isAuthor, validateHikingTrail} = require('../middleware')


router.get('/', async (req, res) => {
    const hikingTrails = await HikingTrail.find({});
    res.render('hikingTrails/index', {hikingTrails});
});

router.get('/new', isLoggedIn, (req, res) => {

    res.render('hikingTrails/new')
});

router.post('/', isLoggedIn, validateHikingTrail, catchAsync(async (req, res, next) => {
    const hikingTrail = new HikingTrail(req.body.hikingTrail);
    hikingTrail.author = req.user._id;
    await hikingTrail.save();
    req.flash('success', 'Successfully created a new hiking trail!');
    res.redirect(`/hikingTrails/${hikingTrail._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const hikingTrail = await HikingTrail.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
        }
    }).populate('author');
    if (!hikingTrail) {
        req.flash('error', 'No hiking trail found!');
        return res.redirect('/hikingTrails');
    }
    res.render('hikingTrails/show', {hikingTrail});
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params;
    const hikingTrail = await HikingTrail.findById(id);
    if (!hikingTrail) {
        req.flash('error', 'No hiking trail found!');
        return res.redirect('/hikingTrails');
    }
    res.render('hikingTrails/edit', {hikingTrail});

}));

router.put('/:id', isLoggedIn, isAuthor, validateHikingTrail, catchAsync(async (req, res) => {
    const {id} = req.params;
    const hikingTrail = await HikingTrail.findByIdAndUpdate(id, {...req.body.hikingTrail});
    req.flash('success', 'Successfully updated the hiking trail!');
    res.redirect(`/hikingTrails/${hikingTrail._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params;
    await HikingTrail.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the hiking trail!')
    res.redirect('/hikingTrails');
}));

module.exports = router;