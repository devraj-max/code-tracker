import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login as authlogin } from '../store/authSlice'
import { useState } from 'react'
import { Button ,Input} from './index'
import { useForm } from 'react-hook-form'
import authService from '../appwrite/auth'
function Login() {
    const [error,setError]=useState("")
    const {register,handleSubmit}=useForm()
    const navigate=useNavigate()
    const dispatch=useDispatch()


    const login=async(data)=>{
        setError("")
        try{
            const session=await authService.login(data)
            if(session){
                const userData=await authService.getCurrentUser()
                if(userData) dispatch(authlogin(userData));
                navigate("/")
            }
        }
        catch(error){
            setError(error.message)
        }
    }

  return (
    <div className='flex justify-center items-start h-screen bg-gray-800 px-4 pt-15'>
    
  <div className='w-full max-w-md p-5 bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 '>
        {error&& <p className='text-red-600  text-center'>{error}</p>}
        <div >
        <form onSubmit={handleSubmit(login)}>
            <div className='space-y-4'>
            <Input
             label= "Email "
            placeholder='Enter your email'
            type="email"
            {...register("email", {
                    required: true,
                    validate: {
                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                        "Email address must be a valid address",
                    }
             })}
              />
           
            <Input 
            label ="Password "
            placeholder="Enter your password"
            type="password"
            {...register("password",{
                required:true,
            }) } />
            <Button type='submit' className='w-full mt-2'>Login</Button>
            </div>
        </form>
      <p className='mt-4 text-center text-sm text-gray-300'>
            don't have an account?{" "} <Link  className='hover:underline text-blue-400' to="/Signup">Signup</Link>
        </p>
        </div>
      </div>
    </div>
  )
}

export default Login
