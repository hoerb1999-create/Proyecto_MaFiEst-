import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import recordingService from '../../services/recordingService';

const ViewRecordings = () => {
  const [recordings, setRecordings] = useState([]);

  useEffect(() => {
    loadRecordings();
  }, []);

  const loadRecordings = async () => {
    try {
      const data = await recordingService.getAccessibleRecordings();
      setRecordings(data);
    } catch (error) {
      console.error('Error al cargar grabaciones:', error);
    }
  };

  return (
    <Container>
      <h1 className="mb-4">Grabaciones Disponibles</h1>
      
      <Row xs={1} md={2} lg={3} className="g-4">
        {recordings.map((recording) => (
          <Col key={recording.id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="text-primary">{recording.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Por: {recording.creator?.username}
                </Card.Subtitle>
                <Card.Text className="mt-3">{recording.description}</Card.Text>
                <div className="d-grid gap-2">
                  <Button 
                    variant="outline-primary" 
                    href={recording.driveLink} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver Grabación
                  </Button>
                </div>
              </Card.Body>
              <Card.Footer className="text-muted">
                <small>
                  Fecha: {new Date(recording.createdAt).toLocaleDateString()}
                </small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {recordings.length === 0 && (
        <div className="text-center mt-5">
          <h3 className="text-muted">No hay grabaciones disponibles</h3>
        </div>
      )}
    </Container>
  );
};

export default ViewRecordings;