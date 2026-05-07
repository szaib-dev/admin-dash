import React, { useEffect } from 'react'
import useMainStore from '../store/MainStore'
import { Outlet } from 'react-router-dom';

function RootLayout() {
    const {fetchUserItself, user} = useMainStore();

    useEffect(()=>{
       fetchUserItself()
    },[user])
  return (
    <div>
        <Outlet />
    </div>
  )
}

export default RootLayout