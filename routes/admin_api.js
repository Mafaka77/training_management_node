const express=require('express');
const router=express.Router();
const multer = require("multer");
const upload = multer();
const {authenticate, authorizeRoles} = require("../middlewares/auth_middleware");
const authController=require('../controllers/admin/admin_auth_controller');
const trainingController=require('../controllers/admin/admin_training_controller');
const userController=require('../controllers/admin/admin_user_controller');
const trainingCourseController= require('../controllers/admin/admin_training_course_controller');
const trainingRoomController= require('../controllers/admin/admin_training_room_controller');
const trainingCategoryController = require('../controllers/admin/admin_training_category_controller');
const trainerController= require('../controllers/admin/admin_trainer_controller');

//AUTH
router.post('/login',authController.login);


//USER CONTROLLER
router.get('/get-all-roles', authenticate, authorizeRoles('Admin'), upload.none(), userController.getRoles);
router.get('/get-all-district', authenticate, authorizeRoles('Admin'), upload.none(), userController.getDistrict);
router.post('/create-user', authenticate, authorizeRoles('Admin'), upload.none(), userController.createUser);


//TRAINING ROOM
router.post('/submit-training-room', authenticate, authorizeRoles('Admin'),upload.none(), trainingRoomController.submitTrainingRoom);
router.get('/get-training-room', authenticate, authorizeRoles('Admin'),upload.none(), trainingRoomController.getTrainingRoom);

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
router.post('/submit-trainer', authenticate, authorizeRoles('Admin'), upload.none(), trainerController.createTrainer);
router.get('/get-all-trainers', authenticate, authorizeRoles('Admin'), upload.none(), trainerController.getAllTrainers);

//TRAINEE


module.exports=router;