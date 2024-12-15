import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from '../pages/DashboardPage';
import { TableDetailsPage } from '../pages/TableDetailsPage';
import { ProdPipelinePage } from '../pages/ProdPipelinePage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/table/:tableType" element={<TableDetailsPage />} />
      <Route path="/prod-pipeline" element={<ProdPipelinePage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}