import React, { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import advisoryService from '../../services/advisoryService';

const Advisories = () => {
  const [advisories, setAdvisories] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAdvisories = async () => {
      if (user?.email) {
        const data = await advisoryService.getAdvisoriesByEmail(user.email);
        setAdvisories(data);
      }
    };
    fetchAdvisories();
  }, [user]);

  return (
    <Container>
      <h1 className="my-4">Mis Asesorías</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {advisories.map((advisory) => (
            <tr key={advisory.id}>
              <td>{advisory.title}</td>
              <td>{advisory.description}</td>
              <td>{new Date(advisory.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Advisories;