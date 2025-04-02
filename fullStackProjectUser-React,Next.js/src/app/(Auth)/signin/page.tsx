import GuestGuard from '@/components/Auth/GuestGuard'
import Signin from '@/components/Auth/signin'
import React from 'react'

const signin = () => {
  return (
    <GuestGuard>
      <div>
        <Signin />
      </div>
    </GuestGuard>
  )
}

export default signin