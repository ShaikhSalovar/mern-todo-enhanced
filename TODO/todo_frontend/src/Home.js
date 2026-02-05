import React, { useEffect, useState } from 'react';
import Create from './Create';
import './App.css';
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill, BsPencil } from 'react-icons/bs';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [updatetask, setUpdatetask] = useState('');
    const [updatestatus, setUpdatestatus] = useState('');
    const [taskid, setTaskid] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
    const limit = 5;

    const filteredTodos = todos.filter(todo =>
        todo.task.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fetchTodos = (statusFilter, pageNum, search = '') => {
        let url = `http://localhost:5000/get?page=${pageNum}&limit=${limit}`;
        if (statusFilter !== 'all') url += `&status=${statusFilter}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        axios.get(url)
            .then(result => {
                setTodos(result.data.todos);
                setTotalPages(result.data.totalPages);
                setStats(result.data.stats);
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchTodos(filter, page, searchTerm);
    }, [filter, page]);

    useEffect(() => {
        setPage(1);
        const timer = setTimeout(() => {
            fetchTodos(filter, 1, searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const isStatusDisabled = (currentStatus, optionStatus) => {
        if (currentStatus === 'completed') return true;
        if (currentStatus === 'pending' && optionStatus === 'completed') return true;
        if (currentStatus === 'in-progress' && optionStatus === 'pending') return true;
        return false;
    };

    const handleStatusChange = (id, newStatus) => {
        axios.put(`http://localhost:5000/status/${id}`, { status: newStatus })
            .then(result => {
                const updatedTodos = todos.map(todo => {
                    if (todo._id === id) {
                        return result.data;
                    }
                    return todo;
                });
                setTodos(updatedTodos);
                if (taskid === id) {
                    setUpdatestatus(newStatus);
                }
                fetchTodos(filter, page, searchTerm);
            })
            .catch(err => console.log(err));
    };

    const Update = (id, updatedTask) => {
        axios.put(`http://localhost:5000/update/${id}`, { task: updatedTask })
            .then(result => {
                const updatedTodos = todos.map(todo => {
                    if (todo._id === id) {
                        return result.data;
                    }
                    return todo;
                });
                setTodos(updatedTodos);
                setTaskid('');
                setUpdatetask('');
                setUpdatestatus('');
            })
            .catch(err => console.log(err));
    };

    const Hdelete = (id) => {
        axios.delete(`http://localhost:5000/delete/${id}`)
            .then(result => {
                console.log(result.data);
                const updatedTodos = todos.filter(todo => todo._id !== id);
                setTodos(updatedTodos);
            })
            .catch(err => console.log(err));
    };

    return (
        <main>
            <Create />
            <div className='search-container'>
                <input
                    type='text'
                    className='search-input'
                    placeholder='Search tasks...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className='stats-container'>
                <div className='stat-item total'>
                    <span className='stat-number'>{stats.total}</span>
                    <span className='stat-label'>Total</span>
                </div>
                <div className='stat-item pending'>
                    <span className='stat-number'>{stats.pending}</span>
                    <span className='stat-label'>Pending</span>
                </div>
                <div className='stat-item in-progress'>
                    <span className='stat-number'>{stats.inProgress}</span>
                    <span className='stat-label'>In Progress</span>
                </div>
                <div className='stat-item completed'>
                    <span className='stat-number'>{stats.completed}</span>
                    <span className='stat-label'>Completed</span>
                </div>
            </div>
            <div className='filter-container'>
                <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => { setFilter('all'); setPage(1); }}>All</button>
                <button className={`filter-btn ${filter === 'pending' ? 'active' : ''}`} onClick={() => { setFilter('pending'); setPage(1); }}>Pending</button>
                <button className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`} onClick={() => { setFilter('in-progress'); setPage(1); }}>In Progress</button>
                <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => { setFilter('completed'); setPage(1); }}>Completed</button>
            </div>
            {
                filteredTodos.length === 0 ? <div className='task'>No tasks found</div> :
                    filteredTodos.map((todo) => (
                        <div className='task' key={todo._id}>
                            <div className='task-content'>
                                <div className='checkbox'>
                                    {todo.status === 'completed' ?
                                        <BsFillCheckCircleFill className='icon' /> :
                                        <BsCircleFill className='icon' />}
                                    {taskid === todo._id ?
                                        <input
                                            type='text'
                                            value={updatetask}
                                            onChange={e => setUpdatetask(e.target.value)}
                                            onBlur={() => { setTaskid(''); setUpdatetask(''); setUpdatestatus(''); }}
                                            autoFocus
                                        />
                                        :
                                        <p className={todo.status === 'completed' ? 'through' : 'normal'}>{todo.task}</p>
                                    }
                                </div>
                                <div className='task-timestamps'>
                                    <span>Created: {new Date(todo.createdAt).toLocaleString()}</span>
                                    {todo.status === 'completed' && todo.completedAt && (
                                        <span>Completed: {new Date(todo.completedAt).toLocaleString()}</span>
                                    )}
                                </div>
                            </div>
                            <div className='task-actions'>
                                <span className={`priority-badge priority-${todo.priority || 'medium'}`}>
                                    {todo.priority || 'medium'}
                                </span>
                                <select
                                    className={`status-select status-select-${todo.status}`}
                                    value={taskid === todo._id ? updatestatus : todo.status}
                                    onChange={(e) => handleStatusChange(todo._id, e.target.value)}
                                    disabled={todo.status === 'completed'}
                                >
                                    <option value='pending' disabled={isStatusDisabled(todo.status, 'pending')}>Pending</option>
                                    <option value='in-progress' disabled={isStatusDisabled(todo.status, 'in-progress')}>In Progress</option>
                                    <option value='completed' disabled={isStatusDisabled(todo.status, 'completed')}>Completed</option>
                                </select>
                                <span>
                                    <BsPencil className='icon' onClick={() => {
                                        if (taskid === todo._id) {
                                            Update(todo._id, updatetask);
                                        } else {
                                            setTaskid(todo._id);
                                            setUpdatetask(todo.task);
                                            setUpdatestatus(todo.status);
                                        }
                                    }} />
                                    <BsFillTrashFill className='icon' onClick={() => Hdelete(todo._id)} />
                                </span>
                            </div>
                        </div>
                    ))
            }
            {totalPages > 1 && (
                <div className='pagination'>
                    <button
                        className='page-btn'
                        onClick={() => setPage(p => p - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span className='page-info'>Page {page} of {totalPages}</span>
                    <button
                        className='page-btn'
                        onClick={() => setPage(p => p + 1)}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </main>
    );
};

export default Home;
