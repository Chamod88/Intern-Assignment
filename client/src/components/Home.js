import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to the Leave Management System</h1>
        <div className="button-group">
          <Link to="/login">
            <button className="home-button login-button">Login</button>
          </Link>
          <Link to="/signup">
            <button className="home-button signup-button">Sign Up</button>
          </Link>
        </div>
      </div>
      <style jsx>{`
        .home-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f5f5f5;
        }
        .home-content {
          text-align: center;
          background: white;
          padding: 3rem;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          width: 400px;
        }
        h1 {
          margin-bottom: 2rem;
          color: #333;
        }
        .button-group {
          display: flex;
          justify-content: space-around;
        }
        .home-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          text-decoration: none;
          display: inline-block;
        }
        .login-button {
          background-color: #007bff;
          color: white;
        }
        .login-button:hover {
          background-color: #0056b3;
        }
        .signup-button {
          background-color: #28a745;
          color: white;
        }
        .signup-button:hover {
          background-color: #1e7e34;
        }
      `}</style>
    </div>
  );
};

export default Home;