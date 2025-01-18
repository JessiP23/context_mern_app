import mongoose from 'mongoose';

// structure of the course model

/**
 * 
 * 
 * Aspects to consider for the course generator:
 * Topic
 * Description
 * Week Content
 * Progress (complete/incomplete)
 * 
 * 
 */


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
    userId: String,
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    weekProgress: [{
        weekId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course.weeks'
        },
        // completed: True/False
        completed: Boolean,
        lastAccessed: Date
    }]
})

export { courseSchema, progressSchema };