import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, Navigate, RouterProvider, Outlet } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Planet from './Planet';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path='/planet' element={<Planet></Planet>} />
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
