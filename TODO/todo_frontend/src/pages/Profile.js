import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as authApi from '../services/authApi';
import '../styles/Profile.css';

const Profile = () => {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [stats, setStats] = useState({ totalTasks: 0, completedTasks: 0, successRate: 0 });

    // Profile form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [bio, setBio] = useState('');

    // Password form state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await authApi.getProfile();
            const { user: userData, stats: userStats } = data;

            setName(userData.name || '');
            setEmail(userData.email || '');
            setPhone(userData.phone || '');
            setLocation(userData.location || '');
            setBio(userData.bio || '');
            setStats(userStats);
            setLoading(false);
        } catch (err) {
            setError('Failed to load profile');
            setLoading(false);
        }
    };

    const getInitials = () => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (name.length < 3) {
            setError('Name must be at least 3 characters');
            return;
        }

        setSaving(true);
        try {
            const data = await authApi.updateProfile({ name, email, phone, location, bio });
            updateUser(data.user);
            setSuccess('Profile updated successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
        setSaving(false);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setError('Please fill in all password fields');
            return;
        }

        if (newPassword.length < 8) {
            setError('New password must be at least 8 characters');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match');
            return;
        }

        setChangingPassword(true);
        try {
            await authApi.changePassword(currentPassword, newPassword);
            setSuccess('Password changed successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        }
        setChangingPassword(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="profile-container">
                <div className="profile-loading">
                    <div className="loading-spinner large"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <Link to="/dashboard" className="back-link">
                    ← Back to Dashboard
                </Link>
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>

            <div className="profile-content">
                <div className="profile-sidebar">
                    <div className="avatar-section">
                        <div className="avatar-circle">
                            {getInitials()}
                        </div>
                        <h2>{name}</h2>
                        <p className="user-email">{email}</p>
                    </div>

                    <div className="stats-section">
                        <h3>Your Statistics</h3>
                        <div className="stat-grid">
                            <div className="stat-box">
                                <span className="stat-value">{stats.totalTasks}</span>
                                <span className="stat-label">Tasks Created</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-value">{stats.completedTasks}</span>
                                <span className="stat-label">Completed</span>
                            </div>
                            <div className="stat-box full-width">
                                <span className="stat-value">{stats.successRate}%</span>
                                <span className="stat-label">Success Rate</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-main">
                    {error && (
                        <div className="profile-message error">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="profile-message success">
                            {success}
                        </div>
                    )}

                    <div className="profile-card">
                        <h3>Profile Information</h3>
                        <form onSubmit={handleUpdateProfile}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your full name"
                                        disabled={saving}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Your email"
                                        disabled={saving}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number (Optional)</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Your phone number"
                                        disabled={saving}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="location">Location (Optional)</label>
                                    <input
                                        type="text"
                                        id="location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="City, Country"
                                        disabled={saving}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="bio">Bio (Optional)</label>
                                <textarea
                                    id="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell us about yourself..."
                                    rows="4"
                                    maxLength="500"
                                    disabled={saving}
                                />
                                <span className="char-count">{bio.length}/500</span>
                            </div>

                            <button type="submit" className="update-btn" disabled={saving}>
                                {saving ? <span className="loading-spinner"></span> : 'Update Profile'}
                            </button>
                        </form>
                    </div>

                    <div className="profile-card">
                        <h3>Change Password</h3>
                        <form onSubmit={handleChangePassword}>
                            <div className="form-group">
                                <label htmlFor="currentPassword">Current Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        id="currentPassword"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password"
                                        disabled={changingPassword}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="newPassword">New Password</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            id="newPassword"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password"
                                            disabled={changingPassword}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmNewPassword">Confirm New Password</label>
                                    <input
                                        type="password"
                                        id="confirmNewPassword"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        disabled={changingPassword}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="update-btn" disabled={changingPassword}>
                                {changingPassword ? <span className="loading-spinner"></span> : 'Change Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
