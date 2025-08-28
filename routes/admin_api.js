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
//AUTH
router.post('/login',upload.none(), authController.login);

//ADMIN ROLE.  ----------------------------------------------
//USER CONTROLLER
router.get('/get-all-roles', authenticate, authorizeRoles('Admin'), upload.none(), userController.getRoles);
router.get('/get-all-district', authenticate, authorizeRoles('Admin'), upload.none(), userController.getDistrict);
router.post('/create-user', authenticate, authorizeRoles('Admin'), upload.none(), userController.createUser);


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
router.post('/submit-trainer', authenticate, authorizeRoles('Admin'), upload.none(), trainerController.createTrainer);
router.get('/get-all-trainers', authenticate, authorizeRoles('Admin'), upload.none(), trainerController.getAllTrainers);

//TRAINEE
router.get('/get-all-trainee', authenticate, authorizeRoles('Admin'), upload.none(), traineeController.getAllTrainee);
router.post('/submit-trainee', authenticate, authorizeRoles('Admin'), upload.none(), traineeController.createTrainee);

//-----------------------------------
//TRAINER ROLE
router.get('/trainer/me', authenticate, authorizeRoles('Trainer'), upload.none(), trainerProfileController.me);
router.put('/trainer/update-proficiency', authenticate, authorizeRoles('Trainer'),fileUpload.single('profile_picture'), trainerProfileController.updateProficiency);
router.get('/trainer/get-my-training', authenticate, authorizeRoles('Trainer'), upload.none(), trainerTrainingController.getMyTraining);
router.post('/trainer/upload-material/:courseId', authenticate, authorizeRoles('Trainer'), fileUpload.array('materials',5), trainerTrainingController.uploadMaterial);
router.get('/trainer/get-training-by-id/:courseId', authenticate, authorizeRoles('Trainer'), upload.none(), trainerTrainingController.getTrainingById);


module.exports=router;