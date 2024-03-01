const mongoose = require('mongoose');

const subTaskSchema = new mongoose.Schema({
    task_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Task'
    },
    status: {
        type: Number,
        required: true,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: Date,
    deleted_at: Date
});

module.exports = mongoose.model('Subtask', subTaskSchema);