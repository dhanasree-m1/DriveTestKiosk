import Controller from "../controllers/userController.js";
import g2Controller from "../controllers/g2Controller.js";
import gController from "../controllers/gController.js";
import appointmentController from "../controllers/appointmentController.js";
import examinerController from "../controllers/examinerController.js";
import express from 'express'
import isAuthenticUser from "../middlewares/authenticate.js";
import isAdmin from "../middlewares/admin.js";
import isExaminer from "../middlewares/examiner.js";
const router = express.Router()
//User creation
router.get('/signup',Controller.signup_get)

router.get('/login',Controller.login_get)

router.get('/dashboard',Controller.dashboard_get)

// router.get('/home',Controller.home_get)

router.post('/logout',Controller.logout_post)

router.post('/signup',Controller.signup_post)

router.post('/login',Controller.login_post)
//g2 routes
router.get('/g2_test',isAuthenticUser,g2Controller.g2_get)
router.post('/edit_g2_test/:user_id',g2Controller.g2_post)
router.get('/edit/:user_id',isAuthenticUser,g2Controller.edit_g2user_get)
router.post('/edit/:user_id_to_update',g2Controller.edit_guser_post)

//g routes
router.get('/home',gController.home)
router.get('/',gController.home)
router.get('/g_test',isAuthenticUser,gController.g_get)
router.post('/search',gController.search_post)


//admin routes
router.get('/appointment',isAdmin,appointmentController.appointment_get)
router.post('/appointment_post',isAdmin,appointmentController.appointment_post)
router.post('/available_time_slots',isAdmin, appointmentController.getAvailableTimeSlots);
router.post('/available_time_slots_for_drivers', isAuthenticUser,appointmentController.getAvailableTimeSlotsForDrivers);
router.post('/appointment_book_post',isAuthenticUser,appointmentController.appointmentBookDriver);//G2 booking by driver
router.post('/appointment_book_post_gtest',isAuthenticUser,appointmentController.appointmentBookDriverGTest);//G2 booking by driver

router.get('/listallexams',isAdmin,appointmentController.getAllexams)
//examiner routes
router.get('/examiner',isExaminer,examinerController.examiner_get)
router.post('/fetch_appointment_type',examinerController.fetchAppointmentType)
router.get('/view-appointment/:ap_id',examinerController.viewAppointment)
router.post('/updateAppointment/:ap_id',examinerController.updateAppointment)

export default router