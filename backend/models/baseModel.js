const { default: mongoose } = require("mongoose");

const baseModelSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

// Middleware to set the updatedAt field
baseModelSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = baseModelSchema;