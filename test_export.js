const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/training_management_ati";

mongoose.connect(uri)
  .then(async () => {
    console.log("Connected to DB");
    require('./models/district_model.js');
    require('./models/group_model.js');
    const controller = require('./controllers/admin/admin_trainee_controller.js');
    
    let resData = "";
    let status = 200;
    const req = { query: { reportType: 'all', groupId: 'all' } };
    const res = {
      setHeader: (k, v) => console.log(`Header: ${k} = ${v}`),
      status: (s) => { status = s; return res; },
      send: (data) => { resData = data; return res; },
      json: (data) => { resData = data; return res; }
    };

    try {
      await controller.exportTraineeReport(req, res);
      console.log("Status:", status);
      console.log("Output Length:", resData?.length);
      console.log("First 200 chars:", resData?.substring(0, 200));
    } catch (e) {
      console.error(e);
    }
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
