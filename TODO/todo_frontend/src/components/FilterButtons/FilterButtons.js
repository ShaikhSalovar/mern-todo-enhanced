import React from 'react';

const FilterButtons = ({ filter, onFilterChange }) => {
    const filters = [
        { value: 'all', label: 'All' },
        { value: 'pending', label: 'Pending' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' }
    ];

    return (
        <div className='filter-container'>
            {filters.map(({ value, label }) => (
                <button
                    key={value}
                    className={`filter-btn ${filter === value ? 'active' : ''}`}
                    onClick={() => onFilterChange(value)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

export default FilterButtons;
