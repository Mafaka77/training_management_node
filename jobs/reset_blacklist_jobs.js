const User = require('../models/user_model');
async function startBlacklistCronJobs() {
    try {
        const users = await User.find({
            is_blacklisted: true,
            blacklist_details: { end_date: { $lt: new Date() } }
        });
        if (users.length > 0) {
            users.forEach(async (user) => {
                user.is_blacklisted = false;
                user.blacklist_details = null;
                await user.save();
            });
        }
    } catch (ex) { }
}
module.exports = {
    startBlacklistCronJobs
}