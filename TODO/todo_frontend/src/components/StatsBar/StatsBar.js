import React from 'react';

const StatsBar = ({ stats }) => {
    return (
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
    );
};

export default StatsBar;
