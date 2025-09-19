const Ticket= require('../../models/ticket_model');
const STATUS= require('../../utils/httpStatus');

exports.raiseTicket=async (req, res)=>{
    try{
        const {subject, description, priority, category}= req.body;
        const user=req.user.user.id;
        if( !subject || !description){
            return res.status(STATUS.OK).json({message: 'Subject and Description are required',status:STATUS.BAD_REQUEST});
        }
        const newTicket= new Ticket({
            user,
            subject,
            description,
            priority,
            category
        });
        await newTicket.save();
        return res.status(STATUS.OK).json({message: 'Ticket raised successfully', ticket: newTicket,status:STATUS.CREATED});
    }catch(error){
        console.error('Error raising ticket:', error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({message: 'Internal server error',status:STATUS.INTERNAL_SERVER_ERROR});
    }
}
exports.myTicket=async (req, res)=>{
    try{
        const user=req.user.user.id;
        const tickets= await Ticket.find({user}).select(['subject','status','createdAt']).sort({createdAt: -1});
        return res.status(STATUS.OK).json({message: 'Tickets fetched successfully', tickets, status:STATUS.OK});
    }catch(error){
        console.error('Error fetching tickets:', error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({message: 'Internal server error',status:STATUS.INTERNAL_SERVER_ERROR});
    }
}
exports.getTicketById = async (req, res) => {
    try {
        const user = req.user.user.id;
        const { ticketId } = req.params;

        const ticket = await Ticket.findOne({ _id: ticketId, user })
            .populate('user', 'name email')
            .populate('replies.sender', 'name email')  // <--- populate nested sender
            .lean();

        if (!ticket) {
            return res.status(STATUS.OK).json({
                message: 'Ticket not found',
                status: STATUS.NOT_FOUND
            });
        }

        // optional: ensure replies are sorted by createdAt ascending
        if (ticket.replies && Array.isArray(ticket.replies)) {
            ticket.replies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }

        return res.status(STATUS.OK).json({
            message: 'Ticket fetched successfully',
            ticket,
            status: STATUS.OK
        });
    } catch (error) {
        console.error('Error fetching ticket:', error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error',
            status: STATUS.INTERNAL_SERVER_ERROR
        });
    }
};

exports.replyTickets=async (req, res)=>{
    try{
        const user=req.user.user.id;
        const {ticketId}= req.params;
        const {message}= req.body;
        if(!message){
            return res.status(STATUS.OK).json({message: 'Message is required',status:STATUS.BAD_REQUEST});
        }
        const ticket= await Ticket.findOne({_id: ticketId, user});
        if(!ticket){
            return res.status(STATUS.OK).json({message: 'Ticket not found', status:STATUS.NOT_FOUND});
        }
        ticket.replies.push({sender: user, message});
        await ticket.save();
        return res.status(STATUS.OK).json({message: 'Reply added successfully', ticket, status:STATUS.OK});
    }catch(error){
        console.error('Error replying to ticket:', error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({message: 'Internal server error',status:STATUS.INTERNAL_SERVER_ERROR});
    }
}
exports.closeTicket=async (req, res)=>{
    try{
        const user=req.user.user.id;
        const {ticketId}= req.params;
        const ticket= await Ticket.findOne({_id: ticketId, user});
        if(!ticket){
            return res.status(STATUS.OK).json({message: 'Ticket not found', status:STATUS.NOT_FOUND});
        }
        ticket.status='Closed';
        await ticket.save();
        return res.status(STATUS.OK).json({message: 'Ticket closed successfully', ticket, status:STATUS.OK});
    }catch(error){
        console.error('Error closing ticket:', error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({message: 'Internal server error',status:STATUS.INTERNAL_SERVER_ERROR});
    }
}

































