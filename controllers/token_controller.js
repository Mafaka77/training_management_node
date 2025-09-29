const DeviceToken=require('../models/device_token_model.js');
const STATUS=require('../utils/httpStatus.js');

exports.deleteToken=async (req,res)=>{
    const {token}=req.body;
    const userId=req.user.user.id;
    await DeviceToken.findOneAndDelete({user:userId,token});
    return res.status(STATUS.OK).json({message:'Token deleted successfully',status:STATUS.OK});
}

exports.registerToken = async (req, res) => {
  try {
      const {token, platform = "android"}=req.body;
        const userId=req.user.user.id;
    if (!userId || !token) return res.status(STATUS.BAD_REQUEST).json({ error: "Token is required",status:STATUS.BAD_REQUEST });

    // Upsert by token (token is globally unique)
    await DeviceToken.updateOne(
      { token },
      {
        $set: { user: userId, platform, lastSeenAt: new Date() },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );

    const deviceCount = await DeviceToken.countDocuments({ user: userId });
    return res.status(STATUS.OK).json({ ok: true, devices: deviceCount ,status:STATUS.OK});
  } catch (e) {
    // Handle duplicate key race
    if (e.code === 11000) return res.json({ ok: true, deduped: true });
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: e.message,status:STATUS.INTERNAL_SERVER_ERROR });
  }
}