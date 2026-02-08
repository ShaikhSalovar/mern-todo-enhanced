import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import CreateTodo from '../components/CreateTodo/CreateTodo';
import SearchBar from '../components/SearchBar/SearchBar';
import StatsBar from '../components/StatsBar/StatsBar';
import FilterButtons from '../components/FilterButtons/FilterButtons';
import TodoList from '../components/TodoList/TodoList';
import Pagination from '../components/Pagination/Pagination';
import * as todoApi from '../services/todoApi';
import '../App.css';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [editingId, setEditingId] = useState('');
    const [editText, setEditText] = useState('');
    const [editStatus, setEditStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
    const limit = 5;

    const filteredTodos = todos.filter(todo =>
        todo.task.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fetchTodos = async (statusFilter, pageNum, search = '') => {
        try {
            const data = await todoApi.getTodos(statusFilter, pageNum, limit, search);
            setTodos(data.todos);
            setTotalPages(data.totalPages);
            setStats(data.stats);
        } catch (err) {
            console.log(err);
        }
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

    const handleCreateTodo = async (task, priority, status) => {
        try {
            await todoApi.createTodo(task, priority, status);
            fetchTodos(filter, page, searchTerm);
        } catch (err) {
            console.log(err);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const updatedTodo = await todoApi.updateTodoStatus(id, newStatus);
            setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
            if (editingId === id) {
                setEditStatus(newStatus);
            }
            fetchTodos(filter, page, searchTerm);
        } catch (err) {
            console.log(err);
        }
    };

    const handleEditStart = (todo) => {
        setEditingId(todo._id);
        setEditText(todo.task);
        setEditStatus(todo.status);
    };

    const handleEditEnd = () => {
        setEditingId('');
        setEditText('');
        setEditStatus('');
    };

    const handleEditSave = async (id) => {
        try {
            const updatedTodo = await todoApi.updateTodoTask(id, editText);
            setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
            handleEditEnd();
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await todoApi.deleteTodo(id);
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setPage(1);
    };

    return (
        <>
            <Navbar />
            <main>
                <CreateTodo onCreateTodo={handleCreateTodo} />
            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />
            <StatsBar stats={stats} />
            <FilterButtons
                filter={filter}
                onFilterChange={handleFilterChange}
            />
            <TodoList
                todos={filteredTodos}
                editingId={editingId}
                editText={editText}
                editStatus={editStatus}
                onEditTextChange={setEditText}
                onEditStart={handleEditStart}
                onEditEnd={handleEditEnd}
                onEditSave={handleEditSave}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                getStatusDisabled={isStatusDisabled}
            />
            <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </main>
        </>
    );
};

export default Home;
