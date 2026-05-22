import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

import LoginPage from './pages/Login.jsx'
import SignUpPage from './pages/SignUp.jsx'
import DashboardProtectedRoute from './components/DashboardProtectedRoute.jsx'
//const DashboardProtectedRoute = lazy(()=> import ('./components/DashboardProtectedRoute.jsx'));
import Dashboard from './pages/Dashboard.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';

function App() {
 //<Route path="/" element={<Dashboard/>} ></Route>
  return (
    <>
<Suspense fallback={<LoadingSpinner/>}>
<Routes>
  <Route path="/login" element={<LoginPage />} ></Route>
  <Route path="/signup" element={<SignUpPage />} ></Route>
  <Route element={<DashboardProtectedRoute/>}>
    <Route path="/" element={<Dashboard/>} ></Route>
  </Route>
</Routes>
</Suspense>
    </>
  )
}

export default App
