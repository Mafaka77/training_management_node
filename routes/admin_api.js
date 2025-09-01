const express=require('express');
const router=express.Router();
const multer = require("multer");
const upload = multer();
const fileUpload=require('../middlewares/file_upload_middleware')
const {authenticate, authorizeRoles} = require("../middlewares/auth_middleware");
const authController=require('../controllers/admin/admin_auth_controller');
const trainingController=require('../controllers/admin/admin_training_controller');
const userController=require('../controllers/admin/admin_user_controller');
const trainingCourseController= require('../controllers/admin/admin_training_course_controller');
const trainingRoomController= require('../controllers/admin/admin_training_room_controller');
const trainingCategoryController = require('../controllers/admin/admin_training_category_controller');
const trainerController= require('../controllers/admin/admin_trainer_controller');
const traineeController= require('../controllers/admin/admin_trainee_controller');
const trainerProfileController= require('../controllers/trainer/trainer_profile_controller');
const trainerTrainingController= require('../controllers/trainer/trainer_training_controller');
const TrainingEnrollmentController= require('../controllers/admin/admin_training_enrollment_controller');
//AUTH
router.post('/login',upload.none(), authController.login);

//ADMIN ROLE.  ----------------------------------------------
//USER CONTROLLER
router.get('/get-all-roles', authenticate, authorizeRoles('Admin'), upload.none(), userController.getRoles);
router.get('/get-all-district', authenticate, authorizeRoles('Admin'), upload.none(), userController.getDistrict);
router.post('/create-user', authenticate, authorizeRoles('Admin'), upload.none(), userController.createUser);

//DEPARTMENT
router.post('/department', authenticate, authorizeRoles('Admin'), upload.none(), require('../controllers/admin/admin_department_controller').createDepartment);
router.get('/departments', authenticate, authorizeRoles('Admin'), upload.none(), require('../controllers/admin/admin_department_controller').getAllDepartments);
router.delete('/department/:departmentId', authenticate, authorizeRoles('Admin'), upload.none(), require('../controllers/admin/admin_department_controller').deleteDepartment);
//TRAINING ROOM
router.post('/submit-training-room', authenticate, authorizeRoles('Admin'),upload.none(), trainingRoomController.submitTrainingRoom);
router.get('/get-training-room', authenticate, authorizeRoles('Admin'),upload.none(), trainingRoomController.getTrainingRoom);
// router.delete('/delete-training-room/:id', authenticate, authorizeRoles('Admin'),upload.none(), trainingRoomController.deleteTrainingRoom);

//TRAINING CATEGORY
router.get('/get-training-category', authenticate, authorizeRoles('Admin'),upload.none(), trainingCategoryController.getTrainingCategory);
router.post('/submit-training-category', authenticate, authorizeRoles('Admin'), upload.none(), trainingCategoryController.createTrainingCategory);

//TRAINING PROGRAM
router.post('/submit-training-program',authenticate,authorizeRoles('Admin'),upload.none(), trainingController.submitTrainingProgram);
router.get('/get-all-training-program', authenticate, authorizeRoles('Admin'),upload.none(), trainingController.getTraining);

//TRAINING COURSE
router.post('/submit-training-course', authenticate, authorizeRoles('Admin'), upload.none(), trainingCourseController.submitTrainingCourse);
router.get('/get-trainer', authenticate, authorizeRoles('Admin'), upload.none(), trainingCourseController.getTrainer);
router.get('/get-all-training-course', authenticate, authorizeRoles('Admin'), upload.none(), trainingCourseController.getAllTrainingCourse);

//TRAINER
router.post('/trainer', authenticate, authorizeRoles('Admin'), upload.none(), trainerController.createTrainer);
router.get('/trainers', authenticate, authorizeRoles('Admin'), upload.none(), trainerController.getAllTrainers);

//TRAINEE
router.get('/trainees', authenticate, authorizeRoles('Admin'), upload.none(), traineeController.getAllTrainee);
router.post('/trainee', authenticate, authorizeRoles('Admin'), upload.none(), traineeController.createTrainee);

//ENROLLMENT
router.get('/enrollments', authenticate, authorizeRoles('Admin'), upload.none(), TrainingEnrollmentController.getAllEnrollment);
router.get('/enrollment/:enrollmentId', authenticate, authorizeRoles('Admin'), upload.none(), TrainingEnrollmentController.getEnrollmentById);
router.patch('/enrollment/:enrollmentId', authenticate, authorizeRoles('Admin'), upload.none(), TrainingEnrollmentController.updateEnrollmentStatus);

//DOCUMENTS
router.post('/documents', authenticate, authorizeRoles('Admin'), fileUpload.array('documents',1), require('../controllers/admin/admin_document_controller').submitDocument);

//TICKET
router.get('/tickets',authenticate, authorizeRoles('Admin'), upload.none(), require('../controllers/admin/admin_ticket_controller').getAllTickets);
router.get('/tickets/:ticketId',authenticate, authorizeRoles('Admin'), upload.none(), require('../controllers/admin/admin_ticket_controller').getTicketById);
router.post('/tickets/:ticketId/replies',authenticate, authorizeRoles('Admin'), upload.none(), require('../controllers/admin/admin_ticket_controller').replyTicket);
router.patch('/tickets/:ticketId/status',authenticate, authorizeRoles('Admin'), upload.none(), require('../controllers/admin/admin_ticket_controller').changeStatus);

//FAQ
router.post('/faqs', authenticate, authorizeRoles('Admin'), upload.none(), require('../controllers/admin/admin_faq_controller').submitFaq);
router.get('/faqs', authenticate, authorizeRoles('Admin'), upload.none(), require('../controllers/admin/admin_faq_controller').getAllFaq);
router.get('/faqs/:faqId', authenticate, authorizeRoles('Admin'), upload.none(), require('../controllers/admin/admin_faq_controller').getFaqById);
router.put('/faqs/:faqId', authenticate, authorizeRoles('Admin'), upload.none(), require('../controllers/admin/admin_faq_controller').updateFaq);
router.delete('/faqs/:faqId', authenticate, authorizeRoles('Admin'), upload.none(), require('../controllers/admin/admin_faq_controller').deleteFaq);

//-----------------------------------
//TRAINER ROLE
router.get('/trainer/me', authenticate, authorizeRoles('Trainer'), upload.none(), trainerProfileController.me);
router.put('/trainer/proficiency', authenticate, authorizeRoles('Trainer'),fileUpload.single('profile_picture'), trainerProfileController.updateProficiency);
router.get('/trainer/trainings', authenticate, authorizeRoles('Trainer'), upload.none(), trainerTrainingController.getMyTraining);
router.post('/trainer/course/:courseId/materials', authenticate, authorizeRoles('Trainer'), fileUpload.array('materials',5), trainerTrainingController.uploadMaterial);
router.get('/trainer/training/:courseId', authenticate, authorizeRoles('Trainer'), upload.none(), trainerTrainingController.getTrainingById);
router.post('/trainer/document', authenticate, authorizeRoles('Trainer'), fileUpload.array('documents',1), require('../controllers/trainer/trainer_document_controller').submitDocument);

module.exports=router;























