import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/ComplaintForm.css';

function ComplaintForm() {
    const [complaintText, setComplaintText] = useState('');
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if (!isLoggedIn || isLoggedIn !== 'true') {
            alert("You need to be logged in first");
            navigate('/login'); // Redirect to login page 
        }
    }, [navigate]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('complaint_text', complaintText);
        formData.append('media', file);

        const userId = localStorage.getItem('userId'); 

        try {
            const response = await fetch('http://localhost:3001/api/complaints/submit-complaint', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${userId}`, // Include user ID in headers
                }
            });

            if (response.ok) {
                const data = await response.json();
                setSuccessMessage('Complaint submission successful, thank you!');
                setComplaintText('');
                setFile(null);
                setErrorMessage('');
            } else if (response.status === 401) {
                alert("You need to log in first");
                navigate('/login'); // Redirect to login page
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.error || 'An error occurred. Please try again later.');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Error submitting complaint. Please try again later.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="complaint-container" style={{ paddingTop: '75px' }}>
            <h2>Did you witness any suspicious activities surrounding the election? File a report here:</h2>
            {successMessage && <div className="success-message">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <label>Complaint Text:</label>
                <textarea value={complaintText} onChange={(e) => setComplaintText(e.target.value)} required />

                <label>Upload File:</label>
                <input type="file" onChange={handleFileChange} />

                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <button type="submit">Submit Complaint</button>
            </form>
        </div>
    );
}

export default ComplaintForm;
