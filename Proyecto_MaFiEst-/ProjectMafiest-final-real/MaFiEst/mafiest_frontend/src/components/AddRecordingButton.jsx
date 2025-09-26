import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import recordingService from '../services/recordings';

const AddRecordingButton = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    driveLink: '',
    type: user?.role === 'administrador' ? 'general' : 'group',
    groupId: user?.groupId || ''
  });

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await recordingService.createRecording(formData);
      handleClose();
      // Aquí puedes agregar una notificación de éxito
    } catch (error) {
      console.error('Error al crear la grabación:', error);
      // Aquí puedes agregar una notificación de error
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Solo mostrar el botón para administrador y docente
  if (!user || (user.role !== 'administrador' && user.role !== 'docente')) {
    return null;
  }

  return (
    <>
      <Button
        variant="primary"
        className="rounded-circle"
        style={{
          width: '50px',
          height: '50px',
          fontSize: '24px',
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 1000
        }}
        onClick={handleShow}
      >
        +
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva Grabación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Link de Drive</Form.Label>
              <Form.Control
                type="url"
                name="driveLink"
                value={formData.driveLink}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {user.role === 'docente' && (
              <Form.Group className="mb-3">
                <Form.Label>ID del Grupo</Form.Label>
                <Form.Control
                  type="text"
                  name="groupId"
                  value={formData.groupId}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Guardar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddRecordingButton;