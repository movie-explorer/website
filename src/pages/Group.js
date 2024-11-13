import React from 'react';
import '../styles/Group.css';

export default function Group() {
    return (
        <div className="container">
            <h1>Group Page</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <div className="group-content">
                <h2>Your Groups</h2>
                <ul className="group-list">
                    <li>Lorem ipsum dolor sit amet</li>
                    <li>Lorem ipsum dolor</li>
                    <li>Lorem ipsum</li>
                </ul>
                <button className="button">Create New Group</button>
            </div>
        </div>
    );
}