import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await fetch('/leaves/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setLeaves(data);
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`/leaves/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'Approved' })
      });
      if (response.ok) {
        fetchLeaves(); // refresh the list
      } else {
        alert('Failed to approve leave request');
      }
    } catch (error) {
      console.error('Error approving leave:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`/leaves/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'Rejected' })
      });
      if (response.ok) {
        fetchLeaves(); // refresh the list
      } else {
        alert('Failed to reject leave request');
      }
    } catch (error) {
      console.error('Error rejecting leave:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}>Logout</button>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Employee Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Start Date</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>End Date</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Reason</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Status</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(leave => (
            <tr key={leave._id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{leave.employee.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{leave.startDate}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{leave.endDate}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{leave.reason}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{leave.status}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button onClick={() => handleApprove(leave._id)} style={{ padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', marginRight: '5px' }}>Approve</button>
                <button onClick={() => handleReject(leave._id)} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;