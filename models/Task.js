const mongoose=require("mongoose");
const { Schema } = mongoose;

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    due_date: {
        type: Date,
        required: true
    },
    priority: {
        type: Number,
        // required: true,
        default: function() {
            const now = new Date();
            const due = new Date(this.due_date);
            const diffDays = parseInt((due - now) / (1000 * 60 * 60 * 24), 10);

            if (diffDays <= 0) return 0;
            if (diffDays <= 2) return 1;
            if (diffDays <= 4) return 2;
            return 3;
        }
    },
    status: {
        type: String,
        required: true,
        enum: ['TODO', 'IN_PROGRESS', 'DONE'],
        default: 'TODO'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'usernumber'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: Date,
    deleted_at: Date
});

module.exports = mongoose.model('Task', taskSchema);