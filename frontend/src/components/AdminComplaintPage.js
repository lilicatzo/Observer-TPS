import React, { useEffect, useState } from "react";

function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/complaints/see-complaints", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", 
        });

        if (response.ok) {
          const data = await response.json();
          setComplaints(data);
        } else {
          const errorText = await response.text();
          setErrorMessage(errorText || "Failed to fetch complaints");
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
        setErrorMessage("Error fetching complaints");
      }
    };

    fetchComplaints();
  }, []);




  const renderMedia = (url) => {
    if (!url) return null;
  
    const fullUrl = `http://localhost:3001${url}`;  
    const lowerCaseUrl = fullUrl.toLowerCase();
  
    if (lowerCaseUrl.endsWith(".jpg") || lowerCaseUrl.endsWith(".jpeg") || lowerCaseUrl.endsWith(".png") || lowerCaseUrl.endsWith(".gif")) {
      return <img src={fullUrl} alt="Media" style={{ maxWidth: "1000px", maxHeight: "1000px" }} />;
    } else if (lowerCaseUrl.endsWith(".pdf")) {
      return <embed src={fullUrl} type="application/pdf" width="1000px" height="1000px" />;
    } else if (lowerCaseUrl.endsWith(".mp4") || lowerCaseUrl.endsWith(".webm")) {
      return <video controls src={fullUrl} style={{ maxWidth: "1000px", maxHeight: "1000px" }} />;
    } else if (lowerCaseUrl.endsWith(".txt")) {
      return <iframe src={fullUrl} style={{ width: "1000px", height: "1000px" }}></iframe>;
    } else {
      return <a href={fullUrl} target="_blank" rel="noopener noreferrer">Open file</a>;
    }
  };
  

  return (
    <div style={{ padding: "70px", color: "white" }}>
      <h2>User Complaints</h2>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      <table style={{ width: "100%", borderCollapse: "collapse", color: "white" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid white", padding: "8px" }}>ID</th>
            <th style={{ border: "1px solid white", padding: "8px" }}>User ID</th>
            <th style={{ border: "1px solid white", padding: "8px" }}>Complaint Text</th>
            <th style={{ border: "1px solid white", padding: "8px" }}>Media URL</th>
            <th style={{ border: "1px solid white", padding: "8px" }}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map(complaint => (
            <tr key={complaint.id}>
              <td style={{ border: "1px solid white", padding: "8px" }}>{complaint.id}</td>
              <td style={{ border: "1px solid white", padding: "8px" }}>{complaint.user_id}</td>
              <td style={{ border: "1px solid white", padding: "8px" }}>{complaint.complaint_text}</td>
              <td style={{ border: "1px solid white", padding: "8px" }}>
                {renderMedia(complaint.media_url)}
              </td>

              <td style={{ border: "1px solid white", padding: "8px" }}>{complaint.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminComplaintsPage;

