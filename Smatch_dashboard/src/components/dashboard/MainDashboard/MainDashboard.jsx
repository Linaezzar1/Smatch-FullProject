import React from 'react';
import './MainDashboard.css';
import dash from "../../../imgs/business-icon-dashboard-3d-illustration-png.png"

const MainDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
      <div className="image-placeholder">
          <img
            src={dash}
            alt="Dashboard Graphic"
            className="dashboard-image"
          />
        </div>
        <h2>Bienvenue sur votre tableau de bord</h2>
        <p>
          Vous pouvez maintenant utiliser notre application pour gérer vos réservations et afficher les statistiques de votre entreprise.
        </p>
        
      </div>
    </div>
  );
};

export default MainDashboard;