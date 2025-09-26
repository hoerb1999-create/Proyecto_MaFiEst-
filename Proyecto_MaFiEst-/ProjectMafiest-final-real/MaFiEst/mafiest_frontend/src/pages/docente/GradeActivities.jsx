import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Table } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import activityService from '../../services/activityService';

const GradeActivities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeForm, setGradeForm] = useState({
    status: '',
    teacherComment: ''
  });

  useEffect(() => {
    loadActivities();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const data = await teacherActivityService.getGroupSubmissions(user.groupId);
      setSubmissions(data);
    } catch (error) {
      console.error('Error al cargar las entregas:', error);
    }
  };

  const handleGradeModal = (submission) => {
    setSelectedSubmission(submission);
    setGradeForm({
      nota: submission.nota || '',
      feedback: submission.feedback || ''
    });
    setShowGradeModal(true);
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    try {
      await teacherActivityService.gradeSubmission(selectedSubmission.id, {
        nota: parseFloat(gradeForm.nota),
        feedback: gradeForm.feedback
      });
      setShowGradeModal(false);
      fetchSubmissions(); // Recargar las entregas para ver los cambios
    } catch (error) {
      console.error('Error al calificar la entrega:', error);
    }
  };

  return (
    <Container className="my-4">
      <h1>Calificar Actividades</h1>

      <div className="mb-4">
        <Card>
          <Card.Body>
            <Table responsive striped>
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Actividad</th>
                  <th>Fecha de Entrega</th>
                  <th>Estado</th>
                  <th>Nota</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>{submission.studentName}</td>
                    <td>{submission.activityTitle}</td>
                    <td>{new Date(submission.submittedAt).toLocaleDateString()}</td>
                    <td>{submission.nota ? 'Calificado' : 'Pendiente'}</td>
                    <td>{submission.nota || '-'}</td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleGradeModal(submission)}
                      >
                        {submission.nota ? 'Editar' : 'Calificar'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>

      <Modal show={showGradeModal} onHide={() => setShowGradeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Calificar Entrega</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSubmission && (
            <>
              <div className="mb-3">
                <h6>Detalles de la entrega:</h6>
                <p><strong>Estudiante:</strong> {selectedSubmission.studentName}</p>
                <p><strong>Actividad:</strong> {selectedSubmission.activityTitle}</p>
                <div className="border p-3 mb-3 bg-light">
                  <h6>Solución del estudiante:</h6>
                  <p>{selectedSubmission.solucion}</p>
                  {selectedSubmission.archivo && (
                    <a
                      href={selectedSubmission.archivo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-secondary"
                    >
                      Ver archivo adjunto
                    </a>
                  )}
                </div>
              </div>

              <Form onSubmit={handleSubmitGrade}>
                <Form.Group className="mb-3">
                  <Form.Label>Nota (0-5)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={gradeForm.nota}
                    onChange={(e) => setGradeForm(prev => ({ ...prev, nota: e.target.value }))}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Feedback</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={gradeForm.feedback}
                    onChange={(e) => setGradeForm(prev => ({ ...prev, feedback: e.target.value }))}
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-end gap-2">
                  <Button variant="secondary" onClick={() => setShowGradeModal(false)}>
                    Cancelar
                  </Button>
                  <Button variant="primary" type="submit">
                    Guardar Calificación
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default GradeActivities;