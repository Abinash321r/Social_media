import React, { useState, useEffect } from 'react'
import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from './LoadingSpinner';
import { useSelector, useDispatch }from "react-redux";
import { checkAuth } from '../store/authSlice';

function DashboardProtectedRoute() { 
  const { userinfo, loading} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("useeffect call from protected route", userinfo)
    if(userinfo?.user == null){
       console.log('useeffect call from protected route',userinfo)
     dispatch(checkAuth())
    }
  }, []);

  if(loading){
    return <LoadingSpinner/>
  }
    return userinfo?.isAuthenticated ? <Outlet /> : <Navigate to="/login"/> ;
}

export default DashboardProtectedRoute
