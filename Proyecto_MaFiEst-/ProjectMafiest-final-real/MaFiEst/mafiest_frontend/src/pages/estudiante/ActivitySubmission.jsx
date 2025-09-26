import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Modal } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import activityService from '../../services/activityService';

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
  }, []);

  const fetchActivities = async () => {
    try {
      const data = await activityService.getActivities();
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
      formData.append('file', submission.archivo || submission.solucion);

      await activityService.submitActivity(selectedActivity.id, formData);
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
                <Card.Title>{activity.title}</Card.Title>
                <Card.Text>{activity.description}</Card.Text>
                <Card.Text>
                  <small className="text-muted">
                    Fecha límite: {new Date(activity.dueDate).toLocaleDateString()}
                  </small>
                </Card.Text>
                
                {activity.Submissions?.length > 0 ? (
                  <div>
                    <h6>Estado de la entrega:</h6>
                    <p>Estado: {activity.Submissions[0].status}</p>
                    {activity.Submissions[0].file && (
                      <a href={activity.Submissions[0].file} target="_blank" rel="noopener noreferrer">
                        Ver entrega
                      </a>
                    )}
                    {activity.Submissions[0].teacherComment && (
                      <div className="mt-2">
                        <strong>Comentario del docente: </strong>
                        {activity.Submissions[0].teacherComment}
                      </div>
                    )}
                  </div>
                ) : (
                  <Button variant="primary" onClick={() => handleSubmitModal(activity)}>
                    Enviar Entrega
                  </Button>
                )}
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <Modal show={showSubmitModal} onHide={() => setShowSubmitModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enviar Entrega</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>URL o texto de la entrega</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={submission.solucion}
                onChange={(e) => setSubmission(prev => ({ ...prev, solucion: e.target.value }))}
                placeholder="Ingresa la URL o texto de tu entrega"
                required={!submission.archivo}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>O sube un archivo</Form.Label>
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