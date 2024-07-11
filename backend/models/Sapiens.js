const mongoose = require("mongoose");
const baseModelSchema = require("./baseModel");
const bcrypt = require('bcryptjs');

//schema
const sapiensSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true,
        minlength: [5, 'Username must be at least 5 characters'],
        maxlength: [50, 'Username cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters']
    },
    age: {
        type: Number,
        min: [18, 'Age must be at least 18'],
        max: [100, 'Age must be at most 100']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    profile: {
        firstName: {
            type: String,
            trim: true
        },
        lastName: {
            type: String,
            trim: true
        },
        bio: {
            type: String,
            trim: true,
            maxlength: [500, 'Bio cannot exceed 500 characters']
        }
    },
    tags: {
        type: [String],
        validate: {
            validator: function (v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: 'Tags must be a not-empty array'
        }
    },
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // },
    // updatedAt: {
    //     type: Date
    // },
    metadata: {
        type: Map,
        of: String
    }
});

sapiensSchema.add(baseModelSchema);

// // Middleware to set the updatedAt field
// sapiensSchema.pre('save', function (next) {
//     this.updatedAt = Date.now();
//     next();
// })

// Pre-save middleware to hash password
sapiensSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});


// Post-save middleware for logging
sapiensSchema.post('save', function (doc, next) {
    console.log('A sapiens is saved: ', doc);
    next();
})

// Method to compare password
sapiensSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const Sapiens = mongoose.model('Sapiens', sapiensSchema);

module.exports = Sapiens;

