const express = require('express');
const { listingSchema } = require('../schema');
const ExpressError = require('../utils/ExpressError');
const Listing = require('../models/listing');
const { isLoggedIn, isOwner, validateListing } = require('../middleware/middleware');
const listingController = require('../controllers/listings');
const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig');
const upload = multer({ storage });
const router = express.Router({mergeParams:true});

//New Listing Route 
router.get("/new",isLoggedIn, listingController.renderNewForm)

//Show Listing Routes
router.route("/:id")
.get( listingController.showListings)
.put(isLoggedIn, isOwner, upload.single('listing[image]'), /* validateListing , */ listingController.updateListings)
.delete(isLoggedIn,  isOwner, listingController.deleteListings);


//Edit Listings Routes
router.get("/:id/edit",isLoggedIn , isOwner, listingController.renderEditForm)

//Index Route
router.route("/")
.get(listingController.index)
.post(isLoggedIn ,
    /* validateListing , */ 
    upload.single('listing[image]'),
    listingController.createListings);






    

module.exports = router;