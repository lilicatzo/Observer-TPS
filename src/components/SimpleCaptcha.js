// import React, { useState } from "react";
// import { Modal, Button } from "react-bootstrap";

// const CaptchaModal = ({ show, onClose, onVerify }) => {
//   const [captcha, setCaptcha] = useState("");
//   const [input, setInput] = useState("");

//   // Function to generate a random alphanumeric sequence for the CAPTCHA
//   const generateCaptcha = () => {
//     const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let result = "";
//     const length = 6; // Change this to adjust the length of the CAPTCHA
//     for (let i = 0; i < length; i++) {
//       result += characters.charAt(Math.floor(Math.random() * characters.length));
//     }
//     setCaptcha(result);
//   };

//   const handleChange = (e) => {
//     setInput(e.target.value);
//   };

//   const handleVerify = () => {
//     if (input.toUpperCase() === captcha.toUpperCase()) {
//       onVerify(true);
//       onClose();
//     } else {
//       onVerify(false);
//       generateCaptcha();
//       setInput("");
//     }
//   };

//   return (
//     <Modal show={show} onHide={onClose}>
//       <Modal.Header closeButton>
//         <Modal.Title>Verify CAPTCHA</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <div style={{ fontSize: "20px", marginBottom: "10px" }}>{captcha}</div>
//         <input type="text" value={input} onChange={handleChange} style={{ marginBottom: "10px" }} />
//         <Button variant="primary" onClick={handleVerify}>
//           Verify
//         </Button>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default CaptchaModal;
