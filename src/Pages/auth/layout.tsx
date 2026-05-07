import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useMainStore from '../../store/MainStore'

function AuthLayout() {
  const {user} = useMainStore()

  if(user){
   return <Navigate to={'/'} />
  }
  return (
    <div>
        <Outlet />
    </div>
  )
}

export default AuthLayout