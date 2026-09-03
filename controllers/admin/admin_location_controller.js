const Location = require("../../models/location_model");
const STATUS = require("../../utils/httpStatus");

exports.getLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(STATUS.OK).json({ locations, message: "Locations fetched successfully" });
    } catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

exports.getLocationById = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) {
            return res.status(STATUS.OK).json({ status: STATUS.NOT_FOUND, message: "Location not found" });
        }
        return res.status(STATUS.OK).json({ status: STATUS.OK, location, message: "Location fetched successfully" });
    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ status: STATUS.INTERNAL_SERVER_ERROR, message: error.message });
    }
};

exports.createLocation = async (req, res) => {
    try {
        const { coordinates, radius, location_name } = req.body;

        // 1. Basic Validation
        if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
            return res.status(STATUS.BAD_REQUEST).json({
                message: "Invalid coordinates. Format must be [longitude, latitude].",
                status: STATUS.BAD_REQUEST
            });
        }

        // 2. Check for existing location name to prevent duplicates
        const existingLocation = await Location.findOne({
            location_name: location_name || 'ATI Campus'
        });

        if (existingLocation) {
            return res.status(STATUS.OK).json({
                message: "A location with this name already exists.",
                status: STATUS.CONFLICT
            });
        }

        // 3. Construct the GeoJSON object properly
        const newLocation = new Location({
            location_name: location_name || "ATI Campus",
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

exports.updateLocation = async (req, res) => {
    try {
        const { coordinates, radius, location_name } = req.body;

        const location = await Location.findById(req.params.id);
        if (!location) {
            return res.status(STATUS.OK).json({
                status: STATUS.NOT_FOUND,
                message: "Location not found"
            });
        }

        if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
            location.location = {
                type: 'Point',
                coordinates: [parseFloat(coordinates[0]), parseFloat(coordinates[1])]
            };
        }

        if (radius !== undefined && radius !== null && radius !== '') {
            location.radius = parseFloat(radius);
        }

        if (location_name) {
            location.location_name = location_name;
        }

        location.updatedAt = new Date();
        await location.save();

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            message: "Location updated successfully",
            location
        });
    } catch (error) {
        console.error("Location Update Error:", error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: "An error occurred while updating the location.",
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
};