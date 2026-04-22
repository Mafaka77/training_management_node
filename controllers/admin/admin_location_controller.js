const Location = require("../../models/location_model");
const STATUS = require("../../utils/httpStatus");
exports.getLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(STATUS.OK).json({ locations, message: "Locations fetched successfully" });
    } catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
exports.createLocation = async (req, res) => {
    try {
        const { coordinates, radius } = req.body;

        // 1. Basic Validation
        if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
            return res.status(STATUS.BAD_REQUEST).json({
                message: "Invalid coordinates. Format must be [longitude, latitude].",
                status: STATUS.BAD_REQUEST
            });
        }

        // 2. Check for existing location name to prevent duplicates
        const existingLocation = await Location.findOne({
            location_name: 'ATI'
        });

        if (existingLocation) {
            return res.status(STATUS.OK).json({
                message: "A location with this name already exists.",
                status: STATUS.CONFLICT
            });
        }

        // 3. Construct the GeoJSON object properly
        const newLocation = new Location({
            location: {
                type: 'Point',
                coordinates: [parseFloat(coordinates[0]), parseFloat(coordinates[1])]
            },
            radius: radius || 50 // Fallback to schema default if not provided
        });

        await newLocation.save();

        // 4. Return the newly created object (Standard Professional Practice)
        return res.status(STATUS.OK).json({
            message: "Geo-location defined successfully",
            data: newLocation,
            status: STATUS.CREATED
        });

    } catch (error) {
        console.error("Location Create Error:", error); // Log for server-side debugging
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred while creating the location profile.",
            error: error.message
        });
    }
};
exports.deleteLocation = async (req, res) => {
    try {
        const location = await Location.findByIdAndDelete(req.params.id);
        res.status(STATUS.OK).json({ location, message: "Location deleted successfully" });
    } catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}