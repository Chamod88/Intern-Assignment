import React, { useState, useEffect } from 'react';

const EmployeeDashboard = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaves, setLeaves] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }

      console.log('Fetching leaves with token:', token.substring(0, 20) + '...');
      
      const response = await fetch('/leaves/my-leaves', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Fetch leaves response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        setLeaves(data);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch leaves:', errorData.message);
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('No authentication token found. Please log in again.');
        window.location.href = '/login';
        return;
      }

      console.log('=== LEAVE SUBMISSION DEBUG ===');
      console.log('Token exists:', !!token);
      console.log('Token preview:', token.substring(0, 20) + '...');
      console.log('Request data:', { startDate, endDate, reason });
      
      // Validate form data
      if (!startDate || !endDate || !reason) {
        alert('Please fill in all fields');
        return;
      }

      const response = await fetch('/leaves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          startDate: startDate.trim(), 
          endDate: endDate.trim(), 
          reason: reason.trim() 
        })
      });
      
      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);
      
      let responseData;
      try {
        responseData = await response.json();
        console.log('Response data:', responseData);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        responseData = { message: 'Invalid server response' };
      }
      
      if (response.ok) {
        console.log('Leave submitted successfully!');
        setStartDate('');
        setEndDate('');
        setReason('');
        fetchLeaves(); // refresh the list
        alert('Leave request submitted successfully!');
      } else {
        console.error('Server error response:', responseData);
        alert(`Failed to submit leave request: ${responseData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('=== NETWORK ERROR ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      alert(`Network error: ${error.message}. Please check your connection and try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>Employee Dashboard</h1>
      <button 
        onClick={handleLogout} 
        style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        Logout
      </button>
      
      <form onSubmit={handleSubmit} style={{ margin: '20px 0' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Start Date: </label>
          <input 
            type="date" 
            value={startDate} 
            onChange={e => setStartDate(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} 
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>End Date: </label>
          <input 
            type="date" 
            value={endDate} 
            onChange={e => setEndDate(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} 
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Reason: </label>
          <textarea 
            value={reason} 
            onChange={e => setReason(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px', height: '100px' }} 
          />
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: isSubmitting ? '#cccccc' : '#4CAF50', 
            color: 'white', 
            border: 'none', 
            cursor: isSubmitting ? 'not-allowed' : 'pointer' 
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Leave Request'}
        </button>
      </form>
      
      <h2>My Leave Requests</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Start Date</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>End Date</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Reason</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Status</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Total Days</th>
          </tr>
        </thead>
        <tbody>
          {leaves.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                No leave requests found
              </td>
            </tr>
          ) : (
            leaves.map(leave => (
              <tr key={leave._id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {new Date(leave.startDate).toLocaleDateString()}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {new Date(leave.endDate).toLocaleDateString()}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{leave.reason}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px',
                    backgroundColor: leave.status === 'Approved' ? '#4CAF50' : 
                                   leave.status === 'Rejected' ? '#f44336' : '#ff9800',
                    color: 'white'
                  }}>
                    {leave.status}
                  </span>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{leave.totalDays || 'N/A'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeDashboard;