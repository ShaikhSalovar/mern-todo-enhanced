const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/Todo');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/TODO',
    console.log('MongoDB connected')
)

app.listen(5000,
    console.log('Server listening on port: 5000')
)

app.post('/add', (req, res) => {
  const { task, priority, status } = req.body;
  const todoData = {
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

app.get('/get', async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    const filter = {};
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
  
app.put('/status/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

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

app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { task, priority } = req.body;

  const updateData = {};
  if (task) updateData.task = task;
  if (priority) updateData.priority = priority;

  TodoModel.findByIdAndUpdate(id, updateData, { new: true })
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err));
});

app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  TodoModel.findByIdAndDelete(id)
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err));
}); 

module.exports=app;
