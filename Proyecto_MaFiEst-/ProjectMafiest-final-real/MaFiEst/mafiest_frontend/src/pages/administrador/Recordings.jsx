import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import recordingService from '../../services/recordingService';
import AddRecordingButton from '../../components/AddRecordingButton';

const Recordings = () => {
  const [recordings, setRecordings] = useState([]);

  useEffect(() => {
    const fetchRecordings = async () => {
      const data = await recordingService.getGeneralRecordings();
      setRecordings(data);
    };
    fetchRecordings();
  }, []);

  return (
    <Container>
      <h1 className="my-4">Grabaciones Generales</h1>
      <Row xs={1} md={2} lg={3} className="g-4">
        {recordings.map((recording) => (
          <Col key={recording.id}>
            <Card>
              <Card.Body>
                <Card.Title>{recording.title}</Card.Title>
                <Card.Text>{recording.description}</Card.Text>
                <Card.Link href={recording.driveLink} target="_blank" rel="noopener noreferrer">
                  Ver Grabación
                </Card.Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <AddRecordingButton />
    </Container>
  );
};

export default Recordings;