import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import recordingService from '../../services/recordingService';

const Recordings = () => {
  const [groupRecordings, setGroupRecordings] = useState([]);
  const [generalRecordings, setGeneralRecordings] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecordings = async () => {
      if (user?.groupId) {
        const groupData = await recordingService.getRecordingsByGroup(user.groupId);
        setGroupRecordings(groupData);
      }
      const generalData = await recordingService.getGeneralRecordings();
      setGeneralRecordings(generalData);
    };
    fetchRecordings();
  }, [user]);

  return (
    <Container>
      <h1 className="my-4">Grabaciones</h1>

      <h2 className="my-3">Grabaciones del Grupo</h2>
      <Row xs={1} md={2} lg={3} className="g-4 mb-5">
        {groupRecordings.map((recording) => (
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

      <h2 className="my-3">Grabaciones Generales</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {generalRecordings.map((recording) => (
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
    </Container>
  );
};

export default Recordings;