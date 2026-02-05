const express=require('express');
const router=express.Router();
const multer = require("multer");
const upload = multer();
const {authenticate, authorizeRoles} = require("../middlewares/auth_middleware");
const TraineeAuthController=require('../controllers/trainee/trainee_auth_controller');
const TraineeTrainingController=require('../controllers/trainee/trainee_training_controller');
const {route} = require("express/lib/application");
const fileUpload=require('../middlewares/file_upload_middleware')
//REGISTRATION
router.post('/register',upload.none(), TraineeAuthController.register);
router.post('/login',upload.none(), TraineeAuthController.login);
router.post('/send-otp',upload.none(), TraineeAuthController.sendOtp);
router.post('/verify-otp',upload.none(), TraineeAuthController.verifyOtp);
router.get('/departments',upload.none(), TraineeAuthController.getDepartment);
router.get('/districts',upload.none(), TraineeAuthController.getDistricts);
router.get('/groups',upload.none(), TraineeAuthController.getGroups);
router.get('/me',authenticate,authorizeRoles('Trainee'), TraineeAuthController.me);
router.post('/logout',authenticate,authorizeRoles('Trainee'),TraineeAuthController.logout);
router.get('/my-profile',authenticate,authorizeRoles('Trainee'),TraineeAuthController.getMyProfile);
router.patch('/profile',authenticate,authorizeRoles('Trainee'),fileUpload.single('profile'),TraineeAuthController.updateProfile);
//TRAINING
router.get('/trainings',upload.none(),authenticate,authorizeRoles('Trainee'), TraineeTrainingController.getTraining);
router.get('/training/:trainingId',upload.none(),authenticate,authorizeRoles('Trainee'), TraineeTrainingController.getTrainingById);
router.post('/training/:trainingId/enrollments',upload.none(),authenticate,authorizeRoles('Trainee'), TraineeTrainingController.enrollInTraining);
router.get('/enrollments',upload.none(),authenticate,authorizeRoles('Trainee'), TraineeTrainingController.myEnrollments);
router.get('/enrollment/:enrollmentId',upload.none(),authenticate,authorizeRoles('Trainee'), TraineeTrainingController.myEnrollmentDetails);
router.get('/enrollment/:enrollmentId/status',upload.none(),authenticate,authorizeRoles('Trainee'),TraineeTrainingController.checkStatus);
router.get('/enrollment/:trainingId/course',upload.none(),authenticate,authorizeRoles('Trainee'),TraineeTrainingController.getCourseByProgram);
router.get('/enrollment/:trainingId/material',upload.none(),authenticate,authorizeRoles('Trainee'),TraineeTrainingController.getMaterials);
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
router.get('/upcoming',authenticate,authorizeRoles('Trainee'), upload.none(), require('../controllers/trainee/trainee_training_controller').getUpcomingTrainings);
//TICKETS
router.post('/tickets', upload.none(), authenticate,authorizeRoles('Trainee'), require('../controllers/trainee/trainee_ticket_controller').raiseTicket);
router.get('/tickets', upload.none(), authenticate,authorizeRoles('Trainee'), require('../controllers/trainee/trainee_ticket_controller').myTicket);
router.get('/tickets/:ticketId',upload.none(), authenticate,authorizeRoles('Trainee'), require('../controllers/trainee/trainee_ticket_controller').getTicketById);
router.post('/ticket/:ticketId/reply', upload.none(), authenticate,authorizeRoles('Trainee'), require('../controllers/trainee/trainee_ticket_controller').replyTickets);
router.patch('/ticket/:ticketId',upload.none(), authenticate,authorizeRoles('Trainee'), require('../controllers/trainee/trainee_ticket_controller').closeTicket);
//DOCUMENT
router.get('/documents', upload.none(), authenticate,authorizeRoles('Admin','Trainer','Trainee'), require('../controllers/document_controller').getDocuments);
// FAQ
router.get('/faqs',upload.none(),authenticate,authorizeRoles('Trainee'),require('../controllers/trainee/trainee_faq_controller').getFaq);
//BANNER
router.get('/banners',authenticate,authorizeRoles('Trainee'), upload.none(), require('../controllers/banner_controller').getBanners);
module.exports=router;

// FCM
router.post('/fcm/register-token',authenticate,authorizeRoles('Trainee'),upload.none(),require('../controllers/token_controller').registerToken);