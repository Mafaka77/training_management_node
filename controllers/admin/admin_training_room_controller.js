const TrainingRoom= require("../../models/training_room_model");
const STATUS= require("../../utils/httpStatus");

//ROOMS-----------------------------------------------

exports.submitTrainingRoom= async (req, res) => {
    const { room_name, room_no, capacity, details } = req.body;

    try {
        if (!room_name || !room_no) {
            return res.status(STATUS.OK).json({ error: "Please fill all required fields" ,status:STATUS.BAD_REQUEST});
        }

        const existingRoom = await TrainingRoom.findOne({
            $or: [{ room_name }, { room_no }]
        });

        if (existingRoom) {
            return res.status(STATUS.OK).json({ error: "Room with same name or number already exists" ,status:STATUS.CONFLICT});
        }

        const room = new TrainingRoom({
            room_name,
            room_no,
            capacity,
            details,
        });

        await room.save();
        return res.status(STATUS.OK).json({ message: "Training Room created successfully" ,status:STATUS.CREATED});

    } catch (e) {
        return res.status(STATUS.OK).json({ error: e.message ,status:STATUS.INTERNAL_SERVER_ERROR});
    }
};
exports.getTrainingRoom= async (req, res) => {
    try {
        const rooms = await TrainingRoom.find();
        return res.status(STATUS.OK).json({ rooms, status: STATUS.OK });
    } catch (e) {
        return res.status(STATUS.OK).json({ error: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
};