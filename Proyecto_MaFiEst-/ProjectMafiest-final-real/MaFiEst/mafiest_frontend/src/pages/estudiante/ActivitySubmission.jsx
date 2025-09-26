import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Modal } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import activitySubmissionService from '../../services/activitySubmissionService';

const ActivitySubmission = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [submission, setSubmission] = useState({
    solucion: '',
    archivo: null
  });

  useEffect(() => {
    fetchActivities();
  }, [user]);

  const fetchActivities = async () => {
    try {
      const data = await activitySubmissionService.getStudentActivities(user.groupId);
      setActivities(data);
    } catch (error) {
      console.error('Error al cargar actividades:', error);
    }
  };

  const handleSubmitModal = (activity) => {
    setSelectedActivity(activity);
    setShowSubmitModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('solucion', submission.solucion);
      if (submission.archivo) {
        formData.append('archivo', submission.archivo);
      }

      await activitySubmissionService.submitActivity(selectedActivity.id, formData);
      setShowSubmitModal(false);
      setSubmission({ solucion: '', archivo: null });
      fetchActivities(); // Recargar actividades para ver la actualización
    } catch (error) {
      console.error('Error al enviar la actividad:', error);
    }
  };

  const handleFileChange = (e) => {
    setSubmission(prev => ({
      ...prev,
      archivo: e.target.files[0]
    }));
  };

  return (
    <Container className="my-4">
      <h1>Mis Actividades</h1>
      
      <div className="row g-4">
        {activities.map((activity) => (
          <div key={activity.id} className="col-md-6 col-lg-4">
            <Card>
              <Card.Body>
                <Card.Title>{activity.titulo}</Card.Title>
                <Card.Text>{activity.descripcion}</Card.Text>
                
                {activity.submission ? (
                  <div>
                    <h6>Tu envío:</h6>
                    <p>{activity.submission.solucion}</p>
                    {activity.submission.archivo && (
                      <a href={activity.submission.archivo} target="_blank" rel="noopener noreferrer">
                        Ver archivo adjunto
                      </a>
                    )}
                    {activity.submission.nota && (
                      <div className="mt-2">
                        <strong>Nota: </strong>{activity.submission.nota}
                      </div>
                    )}
                    {activity.submission.feedback && (
                      <div className="mt-2">
                        <strong>Feedback: </strong>{activity.submission.feedback}
                      </div>
                    )}
                  </div>
                ) : (
                  <Button variant="primary" onClick={() => handleSubmitModal(activity)}>
                    Enviar Solución
                  </Button>
                )}
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <Modal show={showSubmitModal} onHide={() => setShowSubmitModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enviar Solución</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tu solución</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={submission.solucion}
                onChange={(e) => setSubmission(prev => ({ ...prev, solucion: e.target.value }))}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Archivo (opcional)</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowSubmitModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Enviar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ActivitySubmission;