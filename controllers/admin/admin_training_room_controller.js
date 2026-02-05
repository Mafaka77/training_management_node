const TrainingRoom= require("../../models/training_room_model");
const STATUS= require("../../utils/httpStatus");

//ROOMS-----------------------------------------------

exports.submitTrainingRoom= async (req, res) => {
    const { room_name, room_no, capacity, details ,latitude,longitude} = req.body;

    try {
        if (!room_name || !latitude || !longitude) {
            return res.status(STATUS.OK).json({ message: "Please fill all required fields" ,status:STATUS.BAD_REQUEST});
        }

        const existingRoom = await TrainingRoom.findOne({
            $or: [{ room_name }]
        });

        if (existingRoom) {
            return res.status(STATUS.OK).json({ message: "Room with same name or number already exists" ,status:STATUS.CONFLICT});
        }

        const room = new TrainingRoom({
            room_name,
            room_no,
            capacity,
            details,
            latitude,
            longitude,
        });

        await room.save();
        return res.status(STATUS.OK).json({ message: "Training Room created successfully" ,status:STATUS.CREATED});

    } catch (e) {
        return res.status(STATUS.OK).json({ message: e.message ,status:STATUS.INTERNAL_SERVER_ERROR});
    }
};
exports.getTrainingRoom= async (req, res) => {
    try {
        const rooms = await TrainingRoom.find();
        return res.status(STATUS.OK).json({ rooms, status: STATUS.OK });
    } catch (e) {
        return res.status(STATUS.OK).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
};
exports.deleteTrainingRoom = async (req, res) => {
    try {
        const { id } = req.params;

        const room= await TrainingRoom.findById(id);

        if (!room) {
            return res.status(STATUS.OK).json({
                message: "Training Room not found",
                status: STATUS.NOT_FOUND
            });
        }
     await room.deleteOne(id);
        return res.status(STATUS.OK).json({
            message: "Training Room deleted successfully",
            status: STATUS.OK
        });

    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: error.message,
            status: STATUS.INTERNAL_SERVER_ERROR
        });
    }
};
exports.updateTrainingRoom = async (req, res) => {
    try {        const { id } = req.params;
        const { room_name, capacity, details ,latitude,longitude} = req.body;

        const room = await TrainingRoom.findById(id);

        if (!room) {
            return res.status(STATUS.OK).json({
                message: "Training Room not found",
                status: STATUS.NOT_FOUND
            });
        }

        room.room_name = room_name || room.room_name;
        room.capacity = capacity || room.capacity;
        room.details = details || room.details;
        room.latitude = latitude || room.latitude;
        room.longitude = longitude || room.longitude;

        await room.save();

        return res.status(STATUS.OK).json({
            message: "Training Room updated successfully",
            status: STATUS.OK
        });

    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: error.message,
            status: STATUS.INTERNAL_SERVER_ERROR
        });
    }
}
exports.getTrainingRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const room = await TrainingRoom.findById(id);

        if (!room) {
            return res.status(STATUS.OK).json({
                message: "Training Room not found",
                status: STATUS.NOT_FOUND
            });
        }

        return res.status(STATUS.OK).json({
            room,
            status: STATUS.OK
        });

    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: error.message,
            status: STATUS.INTERNAL_SERVER_ERROR
        });
    }
}


