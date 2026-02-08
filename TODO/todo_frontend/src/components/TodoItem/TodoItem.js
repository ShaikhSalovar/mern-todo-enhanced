import React from 'react';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill, BsPencil } from 'react-icons/bs';

const TodoItem = ({
    todo,
    isEditing,
    editText,
    editStatus,
    onEditTextChange,
    onEditStart,
    onEditEnd,
    onEditSave,
    onStatusChange,
    onDelete,
    isStatusDisabled
}) => {
    const handleEditClick = () => {
        if (isEditing) {
            onEditSave();
        } else {
            onEditStart();
        }
    };

    return (
        <div className='task'>
            <div className='task-content'>
                <div className='checkbox'>
                    {todo.status === 'completed' ?
                        <BsFillCheckCircleFill className='icon' /> :
                        <BsCircleFill className='icon' />}
                    {isEditing ?
                        <input
                            type='text'
                            value={editText}
                            onChange={(e) => onEditTextChange(e.target.value)}
                            onBlur={onEditEnd}
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
                    value={isEditing ? editStatus : todo.status}
                    onChange={(e) => onStatusChange(e.target.value)}
                    disabled={todo.status === 'completed'}
                >
                    <option value='pending' disabled={isStatusDisabled('pending')}>Pending</option>
                    <option value='in-progress' disabled={isStatusDisabled('in-progress')}>In Progress</option>
                    <option value='completed' disabled={isStatusDisabled('completed')}>Completed</option>
                </select>
                <span>
                    <BsPencil className='icon' onClick={handleEditClick} />
                    <BsFillTrashFill className='icon' onClick={onDelete} />
                </span>
            </div>
        </div>
    );
};

export default TodoItem;
