import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, Navigate, RouterProvider, Outlet } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import SolarSystem from './SolarSystem';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path='/solar-system' element={<SolarSystem></SolarSystem>} />
    </Route>
  )
);

const App = () => {
  
  return (
    <>
      <SpeedInsights />
      <RouterProvider router={router} />
    </>
  );
}

export default App
