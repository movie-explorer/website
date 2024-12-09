import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserProvider.js';
import axios from 'axios';
import FavoriteList from '../components/FavoriteList.js';
import '../styles/ProfilePage.css';

function ProfilePage() {
	const { token, logout } = useUser();
	const [userData, setUserData] = useState(null);
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');

	useEffect(() => {
		if (!token) {
			navigate('/login');
			return;
		}

		const fetchUserData = async () => {
			try {
				const response = await axios.get('https://moviexplorer.site/profile', {
					headers: {
						Authorization: token,
					},
				});
				const { username, email, created_at } = response.data;

				setUserData({
					username,
					email,
					createdAt: created_at,
				});
			} catch (error) {
				console.error('Error fetching user data:', error);
				setError('Failed to load user data. Please try again later.');
			}
		};

		fetchUserData();
	}, [token, navigate]);

	const handleDeleteAccount = async () => {
		if (window.confirm('This action cannot be undone')) {
			try {
				const response = await axios.delete(
					'https://moviexplorer.site/deleteme',
					{
						headers: {
							Authorization: token,
						},
					}
				);

				if (response.status === 200) {
					logout();
					navigate('/');
				}
			} catch (error) {
				console.error('Error deleting account:', error);
				setError('Could not delete your account. Please try again later.');
			}
		}
	};

	const handleChangePassword = async () => {
		if (newPassword !== confirmNewPassword) {
			setError('New passwords do not match!');
			return;
		}

		try {
			const response = await axios.post(
				'https://moviexplorer.site/passwordupdate',
				{ currentPassword: oldPassword, newPassword },
				{ headers: { Authorization: token } }
			);
			if (response.status === 200) {
				alert('Password successfully changed!');
				setShowPasswordModal(false);
			}
		} catch (error) {
			console.error('Error changing password:', error);
			setError(error.response?.data?.error || 'Failed to change password.');
		}
	};

	if (error) {
		return <div>{error}</div>;
	}

	if (!userData) {
		return <div>Loading...</div>;
	}

	return (
		<div className='profilePageContainer'>
			<div className='accountInformation'>
				<p>
					<strong>Name:</strong> {userData.username}
				</p>
				<p>
					<strong>Email:</strong> {userData.email}
				</p>
				<p>
					<strong>Account created:</strong> {userData.createdAt}
				</p>
			</div>

			<div className='accountSettings'>
				<p>
					<strong>Account settings:</strong>
				</p>
				<button
					className='change-password-btn'
					onClick={() => setShowPasswordModal(true)}>
					Change Password
				</button>
			</div>

			<div className='favorites-section'>
				<h3>Favorite movies</h3>
				<FavoriteList />
			</div>

			<div className='dangerZone'>
				<button className='delete-btn' onClick={handleDeleteAccount}>
					Delete Account
				</button>
			</div>

			{showPasswordModal && (
				<div className='modal'>
					<div className='modal-content'>
						<h3>Change Password</h3>
						<label>Old Password:</label>
						<input
							type='password'
							value={oldPassword}
							onChange={(e) => setOldPassword(e.target.value)}
						/>
						<label>New Password:</label>
						<input
							type='password'
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
						/>
						<label>Confirm New Password:</label>
						<input
							type='password'
							value={confirmNewPassword}
							onChange={(e) => setConfirmNewPassword(e.target.value)}
						/>
						<div className='modal-buttons'>
							<button className='modal-save-btn' onClick={handleChangePassword}>
								Save
							</button>
							<button
								className='modal-cancel-btn'
								onClick={() => setShowPasswordModal(false)}>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ProfilePage;
