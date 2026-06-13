import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
//we have to create store authslice jo ki teri state ko dekhta rhe ki login h ya nhi aur agr longin hua h toh pure form web page me status ko true krdo
import { Button ,Input} from "./index"
import authService from '../appwrite/auth'
import { useNavigate, Link } from 'react-router-dom'
import { Login } from './index'
import { login } from '../store/authSlice'
function Signup() {
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleSubmit, register } = useForm()




  const create = async (data) => {
    setError("")
    try {
      const userData = await authService.createAccount(data)//authservice->createAccount->account create->call login-> create a session
      if (userData) {
        const userData = await authService.getCurrentUser()
        if (userData) dispatch(login(userData));
        //here is login use to tell the system user is loged in then it change state accordingly we se latter this login
        navigate("/")
      }
    } catch (error) {
      setError(error.message)
    }
  }
  return (
   <div className='flex justify-center items-start h-screen bg-gray-800 px-4 pt-15'>

  <div className='w-full max-w-md p-5 bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 '>

    {error && (
      <p className='text-red-500 text-center mb-3 text-sm'>{error}</p>
    )}

    <form onSubmit={handleSubmit(create)}>
      <div className='space-y-4'>

        <Input label="Full Name" placeholder="Enter your full name" {...register("name", { required: true })} />

        <Input label="Email" placeholder="Enter your email" type="email"
          {...register("email", {
            required: true,
            validate: {
              matchPatern: (value) =>
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Invalid email",
            },
          })}
        />

        <Input label="Password" type="password" placeholder="Enter your password"
          {...register("password", { required: true })}
        />

        <Button type="submit" className="w-full mt-2">
          Create Account
        </Button>

      </div>
    </form>

    <p className='mt-4 text-center text-sm text-gray-300'>
      Already have an account?{" "}
      <Link to="/login" className='text-blue-400 hover:underline'>
        Login
      </Link>
    </p>

  </div>
</div>
  )
}
export default Signup
