import mongoose from 'mongoose';

// structure of the course model

/**
 * 
 * 
 * Aspects to consider for the course generator:
 * User Schema
 * Topic
 * Description
 * Week Content
 * Progress (complete/incomplete)
 * 
 * 
 */


const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    }],
}, {
    timestamps: true
});

const weekSchema = new mongoose.Schema({
    title: String,
    description: String,
    topics: [{
        title: String,
        description: String,
        content: String,
        learningObjectives: [String],
    }],
    order: Number,
});


const courseSchema = new mongoose.Schema({
    name: String,
    description: String,
    weeks: [weekSchema],
    lastUpdated: {type: Date, default: Date.now}
}, {
    timestamps: true
});


const progressSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    courseId: {type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true},
    weekProgress: [{
        weekId: {type: mongoose.Schema.Types.ObjectId, ref: 'Course.weeks', required: true},
        completed: {type: Boolean, default: false},
        lastAccessed: {type: Date, default: Date.now}
    }],
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);
const Progress = mongoose.model('Progress', progressSchema);

export { User, Course, Progress };