const express=require('express');
const router=express.Router();
const multer = require("multer");
const upload = multer();
const {authenticate, authorizeRoles} = require("../middlewares/auth_middleware");
const TraineeAuthController=require('../controllers/trainee/trainee_auth_controller');
const TraineeTrainingController=require('../controllers/trainee/trainee_training_controller');
const {route} = require("express/lib/application");

//REGISTRATION
router.post('/register',upload.none(), TraineeAuthController.register);
router.post('/login',upload.none(), TraineeAuthController.login);
router.post('/send-otp',upload.none(), TraineeAuthController.sendOtp);
router.post('/verify-otp',upload.none(), TraineeAuthController.verifyOtp);

//TRAINING
router.get('/trainings',upload.none(),authenticate,authorizeRoles('Trainee'), TraineeTrainingController.getTraining);
router.get('/training/:trainingId',upload.none(),authenticate,authorizeRoles('Trainee'), TraineeTrainingController.getTrainingById);
router.post('/training/:trainingId/enrollments',upload.none(),authenticate,authorizeRoles('Trainee'), TraineeTrainingController.enrollInTraining);
router.get('/enrollments',upload.none(),authenticate,authorizeRoles('Trainee'), TraineeTrainingController.myEnrollments);
router.get('/enrollment/:enrollmentId',upload.none(),authenticate,authorizeRoles('Trainee'), TraineeTrainingController.myEnrollmentDetails);
router.post(
    "/training/:trainingId/ratings",
    authenticate,
    authorizeRoles("Trainee"),
    TraineeTrainingController.upsertMyRating       // create or update my rating
);
router.post(
    "/trainer/feedback",
    upload.none(),
    authenticate,
    authorizeRoles("Trainee"),
    require("../controllers/trainee/trainee_feedback_controller").feedback
);
//TICKETS
router.post('/tickets', upload.none(), authenticate,authorizeRoles('Trainee'), require('../controllers/trainee/trainee_ticket_controller').raiseTicket);
router.get('/tickets', upload.none(), authenticate,authorizeRoles('Trainee'), require('../controllers/trainee/trainee_ticket_controller').myTicket);
router.get('/tickets/:ticketId',upload.none(), authenticate,authorizeRoles('Trainee'), require('../controllers/trainee/trainee_ticket_controller').getTicketById);
router.post('/tickets/:ticketId/replies', upload.none(), authenticate,authorizeRoles('Trainee'), require('../controllers/trainee/trainee_ticket_controller').replyTickets);
router.patch('/ticket/:ticketId',upload.none(), authenticate,authorizeRoles('Trainee'), require('../controllers/trainee/trainee_ticket_controller').closeTicket);
//DOCUMENT
router.get('/documents', upload.none(), authenticate,authorizeRoles('Admin','Trainer','Trainee'), require('../controllers/document_controller').getDocuments);
module.exports=router;