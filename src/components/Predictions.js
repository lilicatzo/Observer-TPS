import React, { useState, useEffect } from "react";
import { Form, Button, Container, Card, Badge, Modal, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import aniesImage from "./images/anies1.png";
import prabowoImage from "./images/prabowo1.png";
import ganjarImage from "./images/ganjar1.png";
import "./Predictions.css";

const VotingComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [userName] = useState(localStorage.getItem("userName") || "");
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [reason, setReason] = useState("");
  const [users, setUsers] = useState([]);
  const [votes, setVotes] = useState({
    "Anies-Muhaimin": 0,
    Prabowo: 0,
    "Ganjar-Mahfud": 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [filter, setFilter] = useState("newest");
  const [numToShow, setNumToShow] = useState("all");
  const [hasVoted, setHasVoted] = useState(false);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!isLoggedIn) {
      console.log("User is not logged in. Redirecting to login page.");
      navigate("/login");
    } else {
      console.log("User is logged in.");
      setShowWelcomeModal(true);
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await fetch("http://localhost:3001/votes");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();

        setUsers(
          data.map((vote) => {
            const userName = vote.anonymous ? (vote.username ? `${vote.username.substring(0, 3)}******` : "Anonymous") : vote.username || "Anonymous";
            return {
              userName,
              selectedCandidate: vote.paslon === 1 ? "Anies-Muhaimin" : vote.paslon === 2 ? "Prabowo" : "Ganjar-Mahfud",
              reason: vote.reason,
              timestamp: new Date(vote.timestamp),
            };
          })
        );

        const votesCount = { "Anies-Muhaimin": 0, Prabowo: 0, "Ganjar-Mahfud": 0 };
        data.forEach((vote) => {
          const candidate = vote.paslon === 1 ? "Anies-Muhaimin" : vote.paslon === 2 ? "Prabowo" : "Ganjar-Mahfud";
          votesCount[candidate]++;
        });
        setVotes(votesCount);
      } catch (error) {
        console.error("Error fetching votes:", error);
      }
    };

    fetchVotes();
  }, []);

  useEffect(() => {
    const checkIfVoted = async () => {
      try {
        const response = await fetch(`http://localhost:3001/vote-status/${userId}`);
        const data = await response.json();
        setHasVoted(data.is_voted);
      } catch (error) {
        console.error("Error checking vote status:", error);
      }
    };

    checkIfVoted();
  }, [userId]);

  const handleCandidateSelection = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleSubmit = () => {
    if (hasVoted) {
      setShowModal(true);
    } else {
      setShowModal(true);
    }
  };

  const handleConfirmModal = async (anonymous) => {
    const newUserName = anonymous ? `${userName.substring(0, 3)}******` : userName;
    const selectedPaslon = selectedCandidate === "Anies-Muhaimin" ? 1 : selectedCandidate === "Prabowo" ? 2 : 3;

    try {
      const user_id = localStorage.getItem("userId");

      const response = await fetch("http://localhost:3001/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          paslon: selectedPaslon,
          reason,
          anonymous,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        const updatedVotes = { ...votes, [selectedCandidate]: votes[selectedCandidate] + 1 };
        setVotes(updatedVotes);

        const newUser = {
          userName: newUserName,
          selectedCandidate,
          reason,
          timestamp: new Date(result.timestamp),
        };
        setUsers([newUser, ...users]);

        setReason("");
        setShowModal(false);
        setHasVoted(true);
      } else {
        const errorData = await response.json();
        console.error("Failed to submit vote:", errorData.error);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  const toggleFilter = (filter) => {
    setFilter(filter);
  };

  const toggleNumToShow = (numToShow) => {
    setNumToShow(numToShow);
  };

  const sortedUsers = users.slice().sort((a, b) => {
    return filter === "newest" ? b.timestamp - a.timestamp : a.timestamp - b.timestamp;
  });

  let displayedUsers = sortedUsers;
  if (numToShow !== "all") {
    displayedUsers = sortedUsers.slice(0, parseInt(numToShow, 10));
  }

  return (
    <div className="election-data-container container mt-5">
      <h1 className="election-data-header text-center" style={{ margin: 50 }}>Prediction Data</h1>
      <div className="d-flex justify-content-center">
        <div className="form-group">
          <h2 style={{ margin: 20 }}>{selectedCandidate ? `You selected: ${selectedCandidate}` : "Choose your candidate:"}</h2>
        </div>
      </div>
      <div className="candidates-container">
        <div className="candidate" onClick={() => handleCandidateSelection("Anies-Muhaimin")}>
          <img src={aniesImage} alt="Anies-Muhaimin" />
          <Badge variant="primary" className="vote-badge">
            Votes: {votes["Anies-Muhaimin"]}
          </Badge>
        </div>
        <div className="candidate" onClick={() => handleCandidateSelection("Prabowo")}>
          <img src={prabowoImage} alt="Prabowo" />
          <Badge variant="primary" className="vote-badge">
            Votes: {votes["Prabowo"]}
          </Badge>
        </div>
        <div className="candidate" onClick={() => handleCandidateSelection("Ganjar-Mahfud")}>
          <img src={ganjarImage} alt="Ganjar-Mahfud" />
          <Badge variant="primary" className="vote-badge">
            Votes: {votes["Ganjar-Mahfud"]}
          </Badge>
        </div>
      </div>
      {selectedCandidate && (
        <div className="d-flex justify-content-center">
          <Form.Group controlId="formReason" className="form-group w-50">
            <Form.Label>Reason for your choice:</Form.Label>
            <Form.Control as="textarea" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
          </Form.Group>
        </div>
      )}
      {selectedCandidate && (
        <div className="d-flex justify-content-center">
          <Button variant="primary" onClick={handleSubmit} className="mt-3">Submit</Button>
        </div>
      )}
      <h3 className="text-center mt-5">Current Votes</h3>
      <Dropdown className="d-flex justify-content-center">
        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
          {filter === "newest" ? "Show Newest First" : "Show Oldest First"}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => toggleFilter("newest")}>Show Newest First</Dropdown.Item>
          <Dropdown.Item onClick={() => toggleFilter("oldest")}>Show Oldest First</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => toggleNumToShow("5")}>Show 5</Dropdown.Item>
          <Dropdown.Item onClick={() => toggleNumToShow("10")}>Show 10</Dropdown.Item>
          <Dropdown.Item onClick={() => toggleNumToShow("all")}>Show All</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Container>
        <div className="card-columns mt-5">
          {displayedUsers.map((user, index) => (
            <Card key={index} className="mb-4">
              <Card.Body>
                <Card.Title>{user.userName}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{user.selectedCandidate}</Card.Subtitle>
                <Card.Text>{user.reason}</Card.Text>
                <Card.Text>
                  <small className="text-muted">{user.timestamp.toLocaleString()}</small>
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Container>
      <Modal show={showWelcomeModal} onHide={() => setShowWelcomeModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Welcome , {userName}!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Welcome to the Election Prediction Page. Make sure to cast your support and share your reasons for your choice.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowWelcomeModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{hasVoted ? "Sorry, you may only choose once" : "Confirm Your Vote"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {hasVoted ? (
            <p>You have already voted. You may only choose once.</p>
          ) : (
            <>
              <p>Are you sure you want to vote for {selectedCandidate}?</p>
              <p>Warning: You can only vote once.</p>
              <p>Do you want to vote anonymously?</p>
            </>
          )}
        </Modal.Body>
        {!hasVoted && (
          <Modal.Footer>
            <Button variant="secondary" onClick={() => handleConfirmModal(true)}>
              Yes, Vote Anonymously
            </Button>
            <Button variant="primary" onClick={() => handleConfirmModal(false)}>
              No, Vote with my name
            </Button>
          </Modal.Footer>
        )}
        {hasVoted && (
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </div>
  );
};

export default VotingComponent;
