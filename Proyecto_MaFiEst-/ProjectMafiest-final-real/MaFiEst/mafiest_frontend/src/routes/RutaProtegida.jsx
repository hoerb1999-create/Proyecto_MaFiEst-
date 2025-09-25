
import React from "react";
import { Navigate } from "react-router-dom";

// children = el componente protegido
// roles = array con los roles permitidos
const RutaProtegida = ({ children, roles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // guardas user en login

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Si se pasaron roles y el del usuario no está en la lista
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />; // lo mandamos al inicio o página "no autorizado"
  }

  return children;
};

export default RutaProtegida;