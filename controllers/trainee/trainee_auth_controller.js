const mongoose = require('mongoose');
const axios = require('axios');
const User = require('../../models/user_model');
const Role = require('../../models/role_model');
const Department = require('../../models/department_model');
const District = require('../../models/district_model');
const Group = require('../../models/group_model');
const STATUS = require("../../utils/httpStatus");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const NodeCache = require("node-cache");
const path = require('path');
const { sendEmail } = require('../../services/mailer_services');
// Initialize cache with a 5-minute expiration time
const otpCache = new NodeCache({ stdTTL: 300 }); // 300 seconds = 5 minutes

exports.me = async (req, res) => {
    const userId = req.user.user.id;
    const user = await User.findById(userId).select('-password -__v').populate('roles', '-__v').lean();
    if (!user) {
        return res.status(STATUS.OK).json({ message: "User not found", status: STATUS.NOT_FOUND });
    }
    return res.status(STATUS.OK).json({ user, status: STATUS.OK });
}
exports.login = async (req, res) => {
    const { mobile, password, email } = req.body;
    console.log(req.body);
    try {
        let user = await User.findOne({
            $or: [
                { mobile: mobile },
                { email: email }
            ]
        })
            .populate('roles', '-__v');

        if (!user) {
            return res.status(STATUS.OK).json({ message: "User not found", status: STATUS.NOT_FOUND });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(STATUS.OK).json({ message: "Incorrect password", status: STATUS.BAD_REQUEST });
        }

        const roleNames = user.roles.map(role => role.name);
        const restrictedRoles = ["Trainer", "Admin", "Employee", "Director"];
        if (roleNames.some(role => restrictedRoles.includes(role))) {
            return res.status(STATUS.OK).json({
                message: "Access Denied: Not Permitted.",
                status: STATUS.UNAUTHORIZED
            });
        }
        const payload = {
            user: {
                id: user.id,
                mobile: user.mobile,
                roles: user.roles.map(role => role.name),
            },
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                return res.status(STATUS.OK).json({
                    token, status: STATUS.OK, user: {
                        id: user._id,
                        email: user.email,
                        full_name: user.full_name,
                        mobile: user.mobile,
                        roles: user.roles.map(role => role.name)
                    }
                });
            }
        );
    } catch (e) {
        console.log(e);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
}
exports.register = async (req, res) => {
    const roles = await Role.findOne({ name: 'Trainee' });
    const { full_name, email, password, mobile, district, department, gender,
        designation, group, mandatory_completion, dob, recruitment, confirmation,
        is_govt_employee, date_of_entry, date_of_superannuation, service_cadre, date_of_entry_in_present_grade, service, category,
    } = req.body;
    try {
        if (!full_name || !email || !mobile) {
            return res.status(STATUS.OK).json({
                message: "Please fill all required fields",
                status: STATUS.BAD_REQUEST
            });
        }
        const existingUser = await User.findOne({ $or: [{ mobile }, { email }] });
        if (existingUser) {
            return res.status(STATUS.OK).json({
                message: "User with this email or mobile already exists",
                status: STATUS.CONFLICT
            });
        }
        const ngo = await Group.findOne({ group_name: 'NGO' });
        let hashedPassword = null;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const user = new User({
            full_name,
            email,
            password: hashedPassword, // save hashed password
            mobile,
            district,
            department,
            gender,
            designation,
            group: is_govt_employee === false ? ngo._id : group,
            mandatory_completion,
            dob,
            recruitment,
            confirmation,
            is_govt_employee,
            date_of_entry,
            date_of_superannuation,
            service_cadre,
            roles: [roles._id],
            date_of_entry_in_present_grade,
            service,
            category,
        });

        await user.save();

        const payload = {
            user: {
                id: user.id || user._id,
                mobile: user.mobile,
                roles: ['Trainee'],
            },
        };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(STATUS.OK).json({
            message: "User created successfully",
            status: STATUS.CREATED,
            token: token,
            user: {
                id: user._id,
                email: user.email,
                full_name: user.full_name,
                mobile: user.mobile,
                roles: ['Trainee']
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: e.message,
            status: STATUS.INTERNAL_SERVER_ERROR
        });
    }

}
exports.sendOtp = async (req, res) => {
    try {
        const { mobile } = req.body;
        const otp = generateOTP(mobile);
        try {
            const templateId = '1407177545229547887';
            const message = `Your OTP code for ATI is ${otp}.EGOVMZ`;
            await axios.get("https://sms.msegs.in/api/send-sms", {
                headers: {
                    'Authorization': `Bearer ${process.env.SMS_TOKEN}`
                },
                params: {
                    template_id: templateId,
                    message: message,
                    recipient: mobile
                }
            });


        } catch (error) {
            console.log(error)
        }
        try {
            await sendEmail('zuala4@gmail.com', 'OTP', message);
        } catch (ex) {

        }
        return res.status(STATUS.OK).json({ message: 'OTP Sent', status: STATUS.OK, otp: otp })
    } catch (ex) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: ex.message, status: 500 })
    }



}
exports.verifyOtp = async (req, res) => {
    const { mobile, otp } = req.body;
    try {
        if (mobile === '7308002120' && String(otp) === '1234') {
            // Bypass OTP verification for Apple testing
        } else {
            const storedOtp = otpCache.get(`otp_${mobile}`);
            console.log(storedOtp);
            if (!storedOtp) {
                return res.status(STATUS.OK).json({ message: 'OTP has expired or does not exist.', status: 400 });
            }

            if (String(storedOtp) !== String(otp)) {
                return res.status(STATUS.OK).json({ message: 'Invalid OTP.', status: 400 });
            }

            // OTP is valid, remove it from cache to prevent reuse
            otpCache.del(`otp_${mobile}`);
        }

        // Check if user exists in database
        const user = await User.findOne({ mobile: mobile }).populate('roles', '-__v');
        if (user) {
            const payload = {
                user: {
                    id: user.id,
                    mobile: user.mobile,
                    roles: user.roles.map(role => role.name),
                },
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
            return res.status(STATUS.OK).json({
                message: 'OTP is verified',
                status: STATUS.OK,
                userExists: true,
                token: token,
                user: {
                    id: user._id,
                    email: user.email,
                    full_name: user.full_name,
                    mobile: user.mobile,
                    roles: user.roles.map(role => role.name)
                }
            });
        }

        return res.status(STATUS.OK).json({ message: 'OTP is verified', status: STATUS.OK, userExists: false });
    } catch (ex) {
        return res.status(STATUS.OK).json({ message: ex.message, status: 500 });
    }
}
exports.logout = async (req, res) => {
    try {
        const decoded = jwt.decode(req.token);
        if (!decoded || !decoded.exp) {
            return res.status(400).json({ message: "Invalid token", status: 400 });
        }
        return res.status(STATUS.OK).json({ message: 'Logout Success', status: STATUS.OK })
    } catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR })
    }
}

exports.getDepartment = async (req, res) => {
    try {
        const departments = await Department.find().select('-__v').lean();
        return res.status(STATUS.OK).json({ departments, status: STATUS.OK });
    } catch (e) {

    }
}
exports.getDistricts = async (req, res) => {
    try {
        const districts = await District.find().select('-__v').lean();
        return res.status(STATUS.OK).json({ districts, status: STATUS.OK });
    } catch (e) {
        return res.status(STATUS.OK).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
}
exports.getGroups = async (req, res) => {
    try {
        const groups = await Group.find().select('-__v').lean();
        return res.status(STATUS.OK).json({ groups, status: STATUS.OK });
    } catch (e) {
        return res.status(STATUS.OK).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
}
const generateOTP = (phone) => {
    // Generate a 4-digit random OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Store OTP in cache with a 5-minute expiration
    otpCache.set(`otp_${phone}`, otp);

    return otp;
};

exports.getMyProfile = async (req, res) => {
    try {
        const userId = req.user.user.id;
        const user = await User.findById(userId).select('-password').populate('district').populate('group');
        return res.status(STATUS.OK).json({ status: STATUS.OK, user });
    } catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR })
    }
}



exports.updateProfile = async (req, res) => {
    try {
        // get user id from auth middleware (support a few common payload shapes)
        const userId =
            req.user?.user?.id ||
            req.user?.user?._id ||
            req.user?.id ||
            req.user?._id;

        if (!userId) {
            return res.status(STATUS.UNAUTHORIZED).json({ message: 'Unauthorized', status: STATUS.UNAUTHORIZED });
        }
        const {
            full_name,
            email,
            mobile,
            gender,
            designation,
            district,
            department,
            group,
            dob,
            is_govt_employee,
            date_of_entry,
            date_of_entry_in_present_grade,
            date_of_superannuation,
            recruitment,
            confirmation,
            service_cadre,
            mandatory_completion,
            service,
            category,
        } = req.body;

        const update = {};
        if (full_name !== undefined) update.full_name = full_name;
        if (email !== undefined) update.email = email;
        if (mobile !== undefined) update.mobile = mobile;
        if (gender !== undefined) update.gender = gender;
        if (designation !== undefined) update.designation = designation;
        if (district !== undefined && district !== 'null' && district !== '') update.district = district;
        if (department !== undefined && department !== 'null' && department !== '') update.department = department;

        if (dob !== undefined) update.dob = dob ? new Date(dob) : null;
        if (is_govt_employee !== undefined) {
            const isGovt = is_govt_employee === 'true' || is_govt_employee === true;
            update.is_govt_employee = isGovt;
            if (!isGovt) {
                // If not government employee, set group to NGO group
                const ngo = await Group.findOne({ group_name: 'NGO' });
                if (ngo) {
                    update.group = ngo._id;
                }
                update.designation = '';
                update.department = '';
                update.date_of_entry = null;
                update.date_of_entry_in_present_grade = null;
                update.date_of_superannuation = null;
                update.recruitment = '';
                update.confirmation = '';
                update.service_cadre = '';
                update.mandatory_completion = false;
            } else {
                if (group !== undefined && group !== 'null' && group !== '') update.group = group;
                if (date_of_entry !== undefined) update.date_of_entry = date_of_entry ? new Date(date_of_entry) : null;
                if (date_of_entry_in_present_grade !== undefined) update.date_of_entry_in_present_grade = date_of_entry_in_present_grade ? new Date(date_of_entry_in_present_grade) : null;
                if (date_of_superannuation !== undefined) update.date_of_superannuation = date_of_superannuation ? new Date(date_of_superannuation) : null;
                if (recruitment !== undefined) update.recruitment = recruitment;
                if (confirmation !== undefined) update.confirmation = confirmation;
                if (service_cadre !== undefined) update.service_cadre = service_cadre;
                if (mandatory_completion !== undefined) {
                    update.mandatory_completion = mandatory_completion === 'true' || mandatory_completion === true;
                }
            }
        }
        if (service !== undefined) update.service = service;
        if (category !== undefined) update.category = category;

        // handle uploaded profile file (multer -> req.file)
        if (req.file) {
            // store a relative path so you can serve it via /uploads/...
            update.profile_picture = path.join('uploads', req.file.filename);
        }

        // update user and return new document
        const user = await User.findByIdAndUpdate(userId, { $set: update }, { new: true })
            .select('-password -__v');

        if (!user) {
            return res.status(STATUS.OK).json({ message: 'User not found', status: STATUS.NOT_FOUND });
        }

        return res.status(STATUS.OK).json({ status: STATUS.OK, message: 'Profile updated', user });
    } catch (err) {
        console.error('updateProfile error:', err);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message || 'Server error', status: STATUS.INTERNAL_SERVER_ERROR });
    }
};

exports.loginSendOtp = async (req, res) => {
    try {
        const { mobile } = req.body;
        const user = await User.findOne({ mobile: mobile });
        if (!user) {
            return res.status(STATUS.OK).json({ message: 'User not found', status: STATUS.NOT_FOUND });
        }
        const otp = generateOTP(mobile);
        const templateId = '1407173926279603243';
        const message = `Please enter OTP ${otp} to login to ATI.EGOVMZ`;
        try {
            // const response = await axios.get("https://sms.msegs.in/api/send-sms", {
            //     headers: {
            //         'Authorization': `Bearer ${process.env.SMS_TOKEN}`
            //     },
            //     params: {
            //         template_id: templateId,
            //         message: message,
            //         recipient: mobile
            //     }
            // });
            await sendEmail('zuala4@gmail.com', 'OTP', message);
            console.log(otp);
            return res.status(STATUS.OK).json({ message: 'OTP Sent', status: STATUS.OK, otp: otp })
        } catch (error) {

            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to send OTP', status: 500 })

        }

    } catch (ex) { }
}

exports.verifyLoginOtp = async (req, res) => {
    try {
        const { mobile, otp } = req.body;
        if (mobile === '7308002120' && String(otp) === '1234') {
            // Bypass OTP verification for Apple testing
        } else {
            const storedOtp = otpCache.get(`otp_${mobile}`);
            if (!storedOtp) {
                return res.status(STATUS.OK).json({ message: 'OTP has expired or does not exist.', status: 400 });
            }
            if (String(storedOtp) !== String(otp)) {
                return res.status(STATUS.OK).json({ message: 'Invalid OTP.', status: 400 });
            }
            otpCache.del(`otp_${mobile}`);
        }
        return res.status(STATUS.OK).json({ message: 'OTP is verified', status: STATUS.OK });
    } catch (ex) { }
}


