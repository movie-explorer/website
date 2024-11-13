import { Link } from "react-router-dom";
import React from 'react';

export default function Auth() {
    return (
        <div>
            <h3>Sign in</h3>
            <form>
                <div>
                    <label>Email</label>
                    <input type="email" />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" />
                </div>
                <div>
                    <button type="submit">Login</button>
                </div>
                <div>
                    <Link to='/signup'>No account? Sign up</Link>
                </div>
            </form>
        </div>
    );
}