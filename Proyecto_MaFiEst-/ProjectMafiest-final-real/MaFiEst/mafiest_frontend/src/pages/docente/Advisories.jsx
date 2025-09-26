import React, { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import advisoryService from '../../services/advisoryService';

const Advisories = () => {
  const [advisories, setAdvisories] = useState([]);

  useEffect(() => {
    const fetchAdvisories = async () => {
      const data = await advisoryService.getAllAdvisories();
      setAdvisories(data);
    };
    fetchAdvisories();
  }, []);

  return (
    <Container>
      <h1 className="my-4">Todas las Asesorías</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {advisories.map((advisory) => (
            <tr key={advisory.id}>
              <td>{advisory.fullName}</td>
              <td>{advisory.email}</td>
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