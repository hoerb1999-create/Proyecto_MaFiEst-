import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import recordingService from '../../services/recordingService';

const TeacherRecordings = () => {
  const { user } = useAuth();
  const [recordings, setRecordings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    driveLink: '',
    type: 'class',
    teacherId: user?.id
  });

  useEffect(() => {
    loadRecordings();
  }, []);

  const loadRecordings = async () => {
    try {
      const data = await recordingService.getTeacherRecordings(user.id);
      setRecordings(data);
    } catch (error) {
      console.error('Error al cargar grabaciones:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await recordingService.createRecording(formData);
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        driveLink: '',
        type: 'class',
        teacherId: user?.id
      });
      loadRecordings();
    } catch (error) {
      console.error('Error al crear grabación:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta grabación?')) {
      try {
        await recordingService.deleteRecording(id);
        loadRecordings();
      } catch (error) {
        console.error('Error al eliminar grabación:', error);
      }
    }
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Mis Grabaciones de Clase</h1>
        <Button 
          variant="primary" 
          className="rounded-circle" 
          style={{ width: '50px', height: '50px', fontSize: '24px' }}
          onClick={() => setShowModal(true)}
        >
          +
        </Button>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {recordings.map((recording) => (
          <Col key={recording.id}>
            <Card>
              <Card.Body>
                <Card.Title>{recording.title}</Card.Title>
                <Card.Text>{recording.description}</Card.Text>
                <div className="d-flex justify-content-between">
                  <Button 
                    variant="primary" 
                    href={recording.driveLink} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver Grabación
                  </Button>
                  <Button 
                    variant="danger"
                    onClick={() => handleDelete(recording.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva Grabación de Clase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Link de Drive</Form.Label>
              <Form.Control
                type="url"
                value={formData.driveLink}
                onChange={(e) => setFormData(prev => ({ ...prev, driveLink: e.target.value }))}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Guardar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default TeacherRecordings;