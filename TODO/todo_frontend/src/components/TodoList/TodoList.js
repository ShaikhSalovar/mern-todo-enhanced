import React from 'react';
import TodoItem from '../TodoItem/TodoItem';

const TodoList = ({
    todos,
    editingId,
    editText,
    editStatus,
    onEditTextChange,
    onEditStart,
    onEditEnd,
    onEditSave,
    onStatusChange,
    onDelete,
    getStatusDisabled
}) => {
    if (todos.length === 0) {
        return <div className='task'>No tasks found</div>;
    }

    return (
        <>
            {todos.map((todo) => (
                <TodoItem
                    key={todo._id}
                    todo={todo}
                    isEditing={editingId === todo._id}
                    editText={editText}
                    editStatus={editStatus}
                    onEditTextChange={onEditTextChange}
                    onEditStart={() => onEditStart(todo)}
                    onEditEnd={onEditEnd}
                    onEditSave={() => onEditSave(todo._id)}
                    onStatusChange={(status) => onStatusChange(todo._id, status)}
                    onDelete={() => onDelete(todo._id)}
                    isStatusDisabled={(optionStatus) => getStatusDisabled(todo.status, optionStatus)}
                />
            ))}
        </>
    );
};

export default TodoList;
