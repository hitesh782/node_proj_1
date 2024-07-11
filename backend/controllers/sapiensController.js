const Sapiens = require("../models/Sapiens");
const os = require('os');

// Helper function for error handling
const handlerError = (res, err) => {
    const { errors } = err;

    if (errors) {
        const messages = Object.values(errors).map(error => error.message);
        res.status(400).json({ success: false, message: messages });
    }
    else {
        res.status(500).json({ success: false, message: err.message });
    }
}

exports.getSapiens = async (req, res) => {
    try {
        const sapiens = await Sapiens.find({ isDeleted: false });  // or Sapiens.find()
        res.status(200).json({ success: true, data: sapiens });
    }
    catch (err) {
        handlerError(res, err);
    }
}

exports.createSapiens = async (req, res) => {
    try {
        const sapiens = new Sapiens(req.body);
        const savedSapiens = await sapiens.save();
        res.status(201).json({ success: true, data: savedSapiens });
    }
    catch (err) {
        handlerError(res, err);
    }
}


exports.getSapiensById = async (req, res) => {
    try {
        const sapiens = await Sapiens.findById(req.params.id);
        if (!sapiens || sapiens.isDeleted) {   // or !sapiens
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    }
    catch (err) {
        handlerError(res, err);
    }
}

exports.updateSapiens = async (req, res) => {
    try {
        const sapiens = await Sapiens.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!sapiens || sapiens.isDeleted) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    }
    catch (err) {
        handlerError(res, err);
    }
}

exports.deleteSapiens = async (req, res) => {
    try {
        // const sapiens = await Sapiens.findByIdAndDelete(req.params.id);

        const sapiens = await Sapiens.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true, isActive: false },
            { new: true }
        )

        if (!sapiens) {
            return res.status(404).json({ success: false, message: 'Sapiens not found' });
        }
        res.status(200).json({ success: true, message: 'Sapiens deleted' });
    }
    catch (err) {
        handlerError(res, err);
    }
}


exports.getSystemConfig = (req, res) => {
    const systemInfo = {
        platform: os.platform(),
        arch: os.arch(),
        cpu: os.cpus(),
        memory: {
            total: os.totalmem(),
            free: os.freemem(),
        },
        uptime: os.uptime(),
        hostname: os.hostname(),
        networkInterfaces: os.networkInterfaces(),
        loadAvg: os.loadavg(),
        release: os.release(),
        userInfo: os.userInfo(),
    }

    res.status(200).json({ success: true, data: systemInfo });
}