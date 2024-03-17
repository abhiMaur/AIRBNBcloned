const express = require('express');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware/middleware');
const reviewController = require('../controllers/review');
const router = express.Router({mergeParams:true});



router.post("/", isLoggedIn, validateReview, reviewController.createReview)

router.delete("/:reviewId",isLoggedIn, isReviewAuthor, reviewController.deleteReview)

module.exports = router;