import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import recordingService from '../../services/recordings';
import AddRecordingButton from '../../components/AddRecordingButton';

const Recordings = () => {
  const [recordings, setRecordings] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecordings = async () => {
      if (user?.groupId) {
        const data = await recordingService.getRecordingsByGroup(user.groupId);
        setRecordings(data);
      }
    };
    fetchRecordings();
  }, [user]);

  return (
    <Container>
      <h1 className="my-4">Grabaciones del Grupo</h1>
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