import React, { useEffect } from 'react'
import useMainStore from '../store/MainStore'
import { Outlet } from 'react-router-dom';

function RootLayout() {
    const {fetchUserItself} = useMainStore();

    useEffect(()=>{
       fetchUserItself()
    },[])
  return (
    <div>
        <Outlet />
    </div>
  )
}

export default RootLayout