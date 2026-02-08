import React, { useState } from 'react';

const CreateTodo = ({ onCreateTodo }) => {
    const [task, setTask] = useState('');
    const [priority, setPriority] = useState('medium');
    const [status, setStatus] = useState('pending');

    const handleSubmit = () => {
        if (!task.trim()) return;
        onCreateTodo(task.trim(), priority, status);
        setTask('');
        setPriority('medium');
        setStatus('pending');
    };

    return (
        <div>
            <h1>Todo List</h1>
            <div className='create-form'>
                <input
                    type='text'
                    placeholder='Enter a task'
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                />
                <select
                    className='priority-select'
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value='low'>Low</option>
                    <option value='medium'>Medium</option>
                    <option value='high'>High</option>
                </select>
                <select
                    className='status-select'
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value='pending'>Pending</option>
                    <option value='in-progress'>In Progress</option>
                    <option value='completed'>Completed</option>
                </select>
                <button onClick={handleSubmit}>ADD</button>
            </div>
        </div>
    );
};

export default CreateTodo;
