import React from 'react';
import '../styles/ErrorPage.css';


export default function ErrorPage() {
    return (
        <div className="error-page">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <img src="https://i.pinimg.com/originals/0d/07/cf/0d07cf84059453d99e93c2352eb20dbc.gif" alt="Error GIF" />
        </div>
    );
}