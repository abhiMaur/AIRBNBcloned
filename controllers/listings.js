const Listing = require("../models/listing");

module.exports.index = async (req,res)=> {
    Listing.aggregate([
        {
            $addFields: {
                gst: { $round: { $multiply: ["$price", 1.18] } }
            }
        }
    ]).then((allListingsWithGST) => {
        res.render("./listings/index", { allListings: allListingsWithGST });
    }).catch((err) => {
        console.error("Error occurred during aggregation: ", err);
    });
};

module.exports.renderNewForm = (req, res)=>{
    res.render("./listings/new.ejs");
}



module.exports.showListings = async (req, res)=>{
    let {id} = req.params;
    try {
        const listing = await Listing.findById(id)
        .populate({
            path:"reviews", 
            populate:{
                path:"author"
            },
        })
        .populate("owner");
        //listing.formattedPrice = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(listing.price);
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist");
            res.redirect("/listings");
        }
        res.render("./listings/show", {listing});
    } catch (error) {
        console.error("Error fetching listing:", error);
        res.status(500).send("Error fetching listing");
    }

}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    try {
        const listing = await Listing.findById(id);
        listing.formattedPrice = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(listing.price);
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist!")
            res.redirect('/listings');
        }
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_350");
        res.render("./listings/edit", {listing, originalImageUrl});
    } catch (error) {
        console.error("Error fetching listing:", error);
        res.status(500).send("Error fetching listing");
    }   
}

module.exports.createListings = async (req, res, next)=>{
    //let {title, description, image, price,country, location} = req.body;
    let url = req.file.path;
    let filename = req.file.filename;
    try {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url, filename};
        await newListing.save();
        req.flash("success", "new Listing Created!")
        res.redirect('/listings');
    } catch (error) {
        next(error);
    }

}

module.exports.updateListings = async (req,res)=>{
    let {id} = req.params;
    let url = req.file.path;
    let filename = req.file.filename;
    try {
        
        const updatedListing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
        updatedListing.image = {url, filename};
        if(typeof req.file != "undefined"){
            await updatedListing.save();
        }
        
        if (!updatedListing) {
                throw new ExpressError(400, "Invalid data, send valid data for listing")
        }
        req.flash("success", "Listing Updated!")
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error updating listing:", error);
        res.status(500).send("Error updating listing");
    }
}

module.exports.deleteListings = async (req,res)=>{
    let {id} = req.params;
    try {
        let deletedListing = await Listing.findByIdAndDelete(id);
        if (!deletedListing) {
            return res.status(404).send("Error while deleting the listing")
        }
        req.flash("success", "Listing Deleted!")
        res.redirect("/listings")
    } catch (error) {
        console.error("Error deleting listing:", error); 
        res.status(500).send("Error deleting listing");
    }   

}