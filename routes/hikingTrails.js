const express = require('express');
const router = express.Router();
const hikingTrails = require('../controllers/hikingTrails');
const catchAsync = require("../utils/catchAsync");
const {isLoggedIn, isAuthor, validateHikingTrail} = require('../middleware')
const multer = require('multer');
const {storage} = require("../cloudinary");
const upload = multer({storage});

router.route('/')
    .get(catchAsync(hikingTrails.index))
    .post(isLoggedIn, upload.array('image'), validateHikingTrail, catchAsync(hikingTrails.createHikingTrail))

router.get('/new', isLoggedIn, hikingTrails.renderNewForm);

router.route('/:id')
    .get(catchAsync(hikingTrails.showHikingTrail))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateHikingTrail, catchAsync(hikingTrails.updateHikingTrail))
    .delete(isLoggedIn, isAuthor, catchAsync(hikingTrails.deleteHikingTrail))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(hikingTrails.renderEditForm));

module.exports = router;