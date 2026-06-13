import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import authService from '../appwrite/auth'
import service from '../appwrite/config'
import { Input, Button } from './index'
import { toast } from "react-toastify"
function Addproblem({ problem, onAdd, onClose }) {

  const { register, handleSubmit, setValue, reset } = useForm()

  //  Prefill form (only in edit mode)
  useEffect(() => {
    if (problem) {
      setValue("title", problem.title)
      setValue("platform", problem.platform)
      setValue("difficulty", problem.difficulty)
      setValue("status", problem.status)
    }
  }, [problem, setValue])

  // Submit handler
  const onSubmit = async (data) => {
    try {
      const user = await authService.getCurrentUser()

      if (!user) {
       toast.error("Please login first ⚠️")
       
        return
      }

      if (problem) {
        //  EDIT MODE
        await service.updateProblem(problem.$id, {
          ...data,
          userId: user.$id,
        })
        toast.success("Problem updated successfully ✏️")
      } else {
        //  ADD MODE
        await service.createProblem(
          {
            ...data,
            userId: user.$id,
           },
          user.$id
          )
      toast.success("Problem Added 🚀")
      }

      reset()
      //  refresh parent means=>onAdd() home ko batata hai ki data change hua hai, fir fetchProblems() call hota hai, jo state update karta hai aur React automatically re-render kar deta hai
      onAdd && onAdd()
      onClose && onClose()

    } catch (error) {
      console.log("Error", error)
    }
  }

  // return (
  //   // SIMPLE FULL SCREEN
  //   <div className="min-h-screen w-full bg-black text-white px-6 py-10">

  //     {/* TITLE */}
  //     <h2 className="text-3xl font-bold text-blue-400 mb-8">
  //       {problem ? "Edit Problem" : "Add Problem"}
  //     </h2>

  //     {/* FORM */}
  //     <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">

  //       {/* Title */}
  //       <Input
  //         placeholder="Problem name"
  //         {...register("title", { required: true })}
  //         className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
  //       />

  //       {/* Platform */}
  //       <select
  //         {...register("platform", { required: true })}
  //         className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
  //       >
  //         <option value="">Platform</option>
  //         <option value="LeetCode">LeetCode</option>
  //         <option value="CodeForces">CodeForces</option>
  //       </select>

  //       {/* Difficulty */}
  //       <select
  //         {...register("difficulty", { required: true })}
  //         className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
  //       >
  //         <option value="">Difficulty</option>
  //         <option value="Easy">Easy</option>
  //         <option value="Medium">Medium</option>
  //         <option value="Hard">Hard</option>
  //       </select>

  //       {/* Status */}
  //       <select
  //         {...register("status", { required: true })}
  //         className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
  //       >
  //         <option value="">Status</option>
  //         <option value="Solved">Solved</option>
  //         <option value="Unsolved">Unsolved</option>
  //       </select>

  //       {/* BUTTONS */}
  //       <div className="flex gap-4 pt-4">

  //         <Button
  //           type="submit"
  //           className="bg-blue-600 px-5 py-2 rounded hover:bg-blue-700"
  //         >
  //           {problem ? "Update" : "Add"}
  //         </Button>

  //         {problem && (
  //           <button
  //             type="button"
  //             onClick={onClose}
  //             className="bg-gray-600 px-5 py-2 rounded hover:bg-gray-500"
  //           >
  //             Cancel
  //           </button>
  //         )}

  //       </div>

  //     </form>

  //   </div>
  // )
  return (
  <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl mb-6 text-white">

    <h2 className="text-xl font-semibold text-blue-400 mb-4">
      {problem ? "Edit Problem" : "Add Problem"}
    </h2>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Input */}
      <Input
        label="Problem Title"
        placeholder="Enter problem name"
        {...register("title", { required: true })}
      />

      {/* Platform */}
      <select
        {...register("platform", { required: true })}
        className="w-full p-3 rounded-xl bg-black/30 text-white border border-white/10 
        focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        <option value="">Platform</option>
        <option value="LeetCode">LeetCode</option>
        <option value="CodeForces">CodeForces</option>
      </select>

      {/* Difficulty */}
      <select
        {...register("difficulty", { required: true })}
        className="w-full p-3 rounded-xl bg-black/30 text-white border border-white/10 
        focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        <option value="">Difficulty</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      {/* Status */}
      <select
        {...register("status", { required: true })}
        className="w-full p-3 rounded-xl bg-black/30 text-white border border-white/10 
        focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        <option value="">Status</option>
        <option value="Solved">Solved</option>
        <option value="Unsolved">Unsolved</option>
      </select>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">

        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-xl"
        >
          {problem ? "Update" : "Add"}
        </Button>

        {problem && (
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 transition px-4 py-2 rounded-xl text-white"
          >
            Cancel
          </button>
        )}

      </div>

    </form>

  </div>
)
}

export default Addproblem