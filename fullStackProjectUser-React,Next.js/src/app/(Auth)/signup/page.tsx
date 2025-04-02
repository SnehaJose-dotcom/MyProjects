import GuestGuard from '@/components/Auth/GuestGuard'
import Signup from '@/components/Auth/signup'
import React from 'react'

const SignUp = () => {
  return (
    <GuestGuard>
      <div>
        <Signup />
      </div>
    </GuestGuard>
  )
}

export default SignUp