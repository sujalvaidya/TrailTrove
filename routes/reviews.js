const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const HikingTrail = require("../models/hikingTrail");
const Review = require("../models/review");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");


router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const hikingTrail = await HikingTrail.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    hikingTrail.reviews.push(review);
    await review.save();
    await hikingTrail.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/hikingTrails/${hikingTrail._id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await HikingTrail.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review!')
    res.redirect(`/hikingTrails/${id}`);
}))

module.exports = router;
