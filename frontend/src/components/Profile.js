import React, { useEffect, useState, useRef } from "react";
import AuthService from "../services/auth.service";
import socketIOClient from "socket.io-client";
import { Form, Button } from "react-bootstrap";

const Profile = (props) => {
  const currentUser = AuthService.getCurrentUser();
  const [text, setText] = useState("");
  const [check, setCheck] = useState(false);
  const ENDPOINT = "http://127.0.0.1:8080";
  const socket = useRef(null);

  useEffect(() => {
    // const { socket } = props;
    socket.current = socketIOClient(ENDPOINT);
    socket.current.emit("profile", currentUser.username);
    socket.current.emit("newUser", currentUser.username);
    socket.current.on("user", (d) => {
      console.log("Now user");
      console.log(d);
    });
    return () => socket.current.disconnect();
  }, []);

  function handleChange(event) {
    console.log("handleChange: " + event.target.value);
    setText(event.target.value);
    socket.current.emit("PartName", {
      text: event.target.value,
      user: currentUser.username,
    });
    socket.current.on("result", (data) => {
      console.log("Get result: ");
      console.log(data);
    });
  }

  function handleCheckClick(event) {
    setCheck(event.target.checked);
    socket.current.emit("check", {
      check: event.target.checked,
      user: currentUser.username,
    });
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.username}</strong> Profile
        </h3>
      </header>
      <p>
        <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}
        {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
      </p>
      <p>
        <strong>Id:</strong> {currentUser.id}
      </p>
      <p>
        <strong>Email:</strong> {currentUser.email}
      </p>
      <strong>Authorities:</strong>
      <ul>
        {currentUser.roles &&
          currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
      </ul>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Part Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter email"
            value={text}
            onInput={(e) => handleChange(e)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            label="Check me out"
            checked={check}
            onChange={(e) => handleCheckClick(e)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default Profile;
