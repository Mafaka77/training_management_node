const Ticket= require('../../models/ticket_model');
const User= require('../../models/user_model');
const STATUS=require('../../utils/httpStatus');

exports.getAllTickets = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = "", status, priority, category } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        // Build filter dynamically
        const filter = {};

        if (search) {
            filter.$or = [
                { subject: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (category) filter.category = category;

        // Fetch with pagination
        const tickets = await Ticket.find(filter)
            .populate("user", "name email role")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Ticket.countDocuments(filter);

        res.status(STATUS.OK).json({
            status: STATUS.OK,
            tickets,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: "Server Error"
        });
    }
};


exports.getTicketById=async (req,res)=>{
    const {ticketId}= req.params;
    try{
        const ticket= await Ticket.findById(ticketId).populate('user','name email role').populate('replies.sender','name email role');
        if(!ticket){
            return res.status(STATUS.NOT_FOUND).json({status:STATUS.NOT_FOUND, message:"Ticket not found"});
        }
        res.status(STATUS.OK).json({status:STATUS.OK, ticket});
    }catch(error){
        console.error("Error fetching ticket by ID:", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({status:STATUS.INTERNAL_SERVER_ERROR, message:"Server Error"});
    }
}

exports.replyTicket= async (req,res)=>{
    const {ticketId}= req.params;
    const {message}= req.body;
    const userId= req.user.user.id; // Admin replying
    try{
        const ticket= await Ticket.findById(ticketId);
        if(!ticket){
            return res.status(STATUS.NOT_FOUND).json({status:STATUS.NOT_FOUND, message:"Ticket not found"});
        }
        ticket.replies.push({message, sender:userId});
        ticket.status="In Progress"; // Update status to In Progress when replied
        ticket.updatedAt= Date.now();
        await ticket.save();
        res.status(STATUS.OK).json({status:STATUS.OK, message:"Reply added successfully", ticket});
    }catch(error){
        console.error("Error replying to ticket:", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({status:STATUS.INTERNAL_SERVER_ERROR, message:"Server Error"});
    }
}

exports.changeStatus=async (req,res)=>{
    const {ticketId}= req.params;
    const {status}= req.body;
    const validStatuses=["Open", "In Progress", "Resolved", "Closed"];
    if(!validStatuses.includes(status)){
        return res.status(STATUS.BAD_REQUEST).json({status:STATUS.BAD_REQUEST, message:"Invalid status value"});
    }
    try{
        const ticket= await Ticket.findById(ticketId);
        if(!ticket){
            return res.status(STATUS.NOT_FOUND).json({status:STATUS.NOT_FOUND, message:"Ticket not found"});
        }
        ticket.status=status;
        ticket.updatedAt= Date.now();
        await ticket.save();
        res.status(STATUS.OK).json({status:STATUS.OK, message:"Ticket status updated", ticket});
    }catch(error){
        console.error("Error changing ticket status:", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({status:STATUS.INTERNAL_SERVER_ERROR, message:"Server Error"});
    }
}































