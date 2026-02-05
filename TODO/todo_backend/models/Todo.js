const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    completedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

const TodoModel = mongoose.model('tasks', todoSchema);

module.exports = TodoModel;
