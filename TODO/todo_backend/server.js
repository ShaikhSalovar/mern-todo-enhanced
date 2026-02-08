require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/Todo');
const authRoutes = require('./routes/auth');
const auth = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/TODO')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});

// Auth routes
app.use('/api/auth', authRoutes);

// Protected Todo routes
app.post('/add', auth, (req, res) => {
    const { task, priority, status } = req.body;
    const todoData = {
        userId: req.userId,
        task,
        priority: priority || 'medium',
        status: status || 'pending',
    };
    if (status === 'completed') {
        todoData.completedAt = new Date();
    }
    TodoModel.create(todoData)
        .then(result => res.json(result))
        .catch(err => res.status(500).json(err));
});

app.get('/get', auth, async (req, res) => {
    try {
        const { status, page = 1, limit = 10, search } = req.query;
        const filter = { userId: req.userId };
        if (status) filter.status = status;
        if (search) filter.task = { $regex: search, $options: 'i' };

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const [todos, total, pending, inProgress, completed] = await Promise.all([
            TodoModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
            TodoModel.countDocuments(filter),
            TodoModel.countDocuments({ ...filter, status: 'pending' }),
            TodoModel.countDocuments({ ...filter, status: 'in-progress' }),
            TodoModel.countDocuments({ ...filter, status: 'completed' })
        ]);

        res.json({
            todos,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            stats: { total, pending, inProgress, completed }
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

app.put('/status/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Verify todo belongs to user
    const todo = await TodoModel.findOne({ _id: id, userId: req.userId });
    if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
    }

    const updateData = { status };
    if (status === 'completed') {
        updateData.completedAt = new Date();
    } else {
        updateData.completedAt = null;
    }

    TodoModel.findByIdAndUpdate(id, updateData, { new: true })
        .then(result => res.json(result))
        .catch(err => res.status(500).json(err));
});

app.put('/update/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { task, priority } = req.body;

    // Verify todo belongs to user
    const todo = await TodoModel.findOne({ _id: id, userId: req.userId });
    if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
    }

    const updateData = {};
    if (task) updateData.task = task;
    if (priority) updateData.priority = priority;

    TodoModel.findByIdAndUpdate(id, updateData, { new: true })
        .then(result => res.json(result))
        .catch(err => res.status(500).json(err));
});

app.delete('/delete/:id', auth, async (req, res) => {
    const { id } = req.params;

    // Verify todo belongs to user
    const todo = await TodoModel.findOne({ _id: id, userId: req.userId });
    if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
    }

    TodoModel.findByIdAndDelete(id)
        .then(result => res.json(result))
        .catch(err => res.status(500).json(err));
});

module.exports = app;
