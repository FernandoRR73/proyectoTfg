import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../AuthContext';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';

const UpdateUser = () => {
  const { user, setUser } = useContext(AuthContext);
  const [newEmail, setNewEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put('http://localhost:3001/auth/updateUser', {
        newEmail,
        newUsername,
        newPassword
      }, { withCredentials: true });

      setMessage('Perfil actualizado exitosamente');
      setUser({ ...user, email: newEmail || user.email, username: newUsername || user.username });
    } catch (error) {
      setError('Error al actualizar el perfil');
      console.error('Error al actualizar el perfil:', error);
    }
  };

  return (
    <Container className="d-flex justify-content-center pt-5">
      <Row className="w-100">
        <Col xs={12} md={6} lg={4} className="mx-auto">
          <Form onSubmit={handleSubmit}>
            <h2>Actualizar Perfil</h2>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group controlId="formEmail">
              <Form.Label>Correo Electrónico:</Form.Label>
              <Form.Control
                type="email"
                placeholder={user.email}
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formUsername">
              <Form.Label>Nombre de Usuario:</Form.Label>
              <Form.Control
                type="text"
                placeholder={user.username}
                value={newUsername}
                onChange={(event) => setNewUsername(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Nueva Contraseña:</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="custom-button">
              Actualizar
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdateUser;
