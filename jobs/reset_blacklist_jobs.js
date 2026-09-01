const User = require('../models/user_model');

async function startBlacklistCronJobs() {
    try {
        console.log("⏳ [CRON] Checking expired blacklists...");
        const result = await User.updateMany(
            {
                is_blacklisted: true,
                'blacklist_details.end_date': { $lt: new Date() }
            },
            {
                $set: {
                    is_blacklisted: false,
                    blacklist_details: null
                }
            }
        );
        console.log(`✅ [CRON] Blacklist reset completed. Updated ${result.modifiedCount || 0} user(s).`);
    } catch (ex) {
        console.error("❌ [CRON] Blacklist reset error:", ex.message);
    }
}

module.exports = {
    startBlacklistCronJobs
};