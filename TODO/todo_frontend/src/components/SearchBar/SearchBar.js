import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange }) => {
    return (
        <div className='search-container'>
            <input
                type='text'
                className='search-input'
                placeholder='Search tasks...'
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;
