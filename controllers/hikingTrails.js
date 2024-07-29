const HikingTrail = require("../models/hikingTrail");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const {cloudinary} = require("../cloudinary");

module.exports.index = async (req, res) => {
    const hikingTrails = await HikingTrail.find({});
    res.render('hikingTrails/index', {hikingTrails});
}

module.exports.renderNewForm = (req, res) => {
    res.render('hikingTrails/new')
}

module.exports.createHikingTrail = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.hikingTrail.location,
        limit: 1
    }).send();
    const hikingTrail = new HikingTrail(req.body.hikingTrail);
    hikingTrail.geometry = geoData.body.features[0].geometry;
    hikingTrail.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    hikingTrail.author = req.user._id;
    await hikingTrail.save();
    console.log(hikingTrail);
    req.flash('success', 'Successfully created a new hiking trail!');
    res.redirect(`/hikingTrails/${hikingTrail._id}`);
}

module.exports.showHikingTrail = async (req, res) => {
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
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const hikingTrail = await HikingTrail.findById(id);
    if (!hikingTrail) {
        req.flash('error', 'No hiking trail found!');
        return res.redirect('/hikingTrails');
    }
    res.render('hikingTrails/edit', {hikingTrail});

}

module.exports.updateHikingTrail = async (req, res) => {
    const {id} = req.params;
    const hikingTrail = await HikingTrail.findByIdAndUpdate(id, {...req.body.hikingTrail});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    hikingTrail.images.push(...imgs);
    await hikingTrail.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await hikingTrail.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated the hiking trail!');
    res.redirect(`/hikingTrails/${hikingTrail._id}`);
}

module.exports.deleteHikingTrail = async (req, res) => {
    const {id} = req.params;
    await HikingTrail.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the hiking trail!')
    res.redirect('/hikingTrails');
}