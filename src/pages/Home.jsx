import React, { useState, useEffect, use } from 'react'
import { Container } from '../components'
import service from '../appwrite/config'
import Addproblem from '../components/Addproblem'

import Edit from '../components/Edit'
import { toast } from 'react-toastify'
import { FiFileText } from "react-icons/fi"
function Home() {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editProblem, setEditProblem] = useState(null)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("All")
  const [sortBy, setSortBy] = useState("none")
  const [openNoteId, setOpenNoteId] = useState(null)
  const [noteText, setNoteText] = useState("")




  //  fetch function (reusable)

  
const fetchProblems = async () => {
  setLoading(true)

  const user = await authService.getCurrentUser()

  if (!user) {
    setProblems([])
    setLoading(false)
    return
  }

  const res = await service.getProblems(user.$id)

  if (res) {
    setProblems(res.documents)
  } else {
    setProblems([])
  }

  setLoading(false)
}







  useEffect(() => {
    fetchProblems()
  }, [])

  // handelDelete =>when user delete system ask for confirmation

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this problem ?")

    if (!confirmDelete) return
    try {
      await service.deleteProblem(id)
      toast.success("Problem deleted successfully 🗑️")
      fetchProblems()
    } catch (error) {
      toast.error("Failed to delete problem ❌")
    }
  }




  //stats
  const total = problems.length
  const solved = problems.filter(p => p.status === "Solved").length
  const unsolved = problems.filter(p => p.status === "Unsolved").length


  // filter logic
  // filteredProblems ek new array banata hai
  // phir usko .map() karke UI render hota hai  =>pehle array filter hota hai → phir us array ko map karke UI banate hain
  // search logic


  // jab title null h tb tolower case crash ho rha h tb hme kuch addtional condtion lagani hogi
  // const filterdProblems =
  //  problems.filter(p => {
  //   if (filter == "All") return true;
  //   else return p.status === filter
  //  }).filter((p) =>
  //   p.title.toLowerCase().includes(search.toLowerCase())
  //  )







  const filteredProblems = problems.filter(p =>
    (filter === "All" || p.status === filter) &&
    (difficultyFilter === "All" ||
      (p.difficulty || "").toLowerCase() === difficultyFilter.toLowerCase()) &&
    ((p.title || "").toLowerCase().includes((search || "").toLowerCase()))
  )


  //for sorting we make a copy of original data to preserve original data 
  // SORT
  const finalProblems = [...filteredProblems]

  if (sortBy === "title") {
    finalProblems.sort((a, b) =>
      (a.title || "").localeCompare(b.title || "")
    )
  }

  if (sortBy === "status") {
    finalProblems.sort((a, b) =>
      (a.status || "").localeCompare(b.status || "")
    )
  }

  if (sortBy === "difficulty") {
    const order = { Easy: 1, Medium: 2, Hard: 3 }
    finalProblems.sort(
      (a, b) => (order[a.difficulty] || 0) - (order[b.difficulty] || 0)
    )
  }


  //user active data
  const dates = problems.map(p =>
    (p.$createdAt || "").slice(0, 10)
  )

  const uniqueDates = [...new Set(dates)].sort()
  const totalActiveDays = uniqueDates.length

  let maxStreak = 0
  let currentStreak = 1

  // logic for store maxstreak 
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1])
    const cur = new Date(uniqueDates[i])
    const diff = (prev - cur) / (1000 * 60 * 60 * 24)
    if (diff === 1) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }
    maxStreak = Math.max(maxStreak, currentStreak)
  }

  // for last 30 days active
  const now = new Date()
  //filter jo conditon statisfy kre usko return kr do
  const last30 = uniqueDates.filter(d => {
    const diff = (now - new Date(d)) / (1000 * 60 * 60 * 24)
    return diff <= 30
  })

  const last30ActiveDays = last30.length

  //  loading state
  if (loading) {
    return (
      <div className="w-full text-center py-10">
        <h1 className="text-xl">Loading...</h1>
      </div>
    )
  }

  //  empty state
  // if (problems.length === 0) {
  //   return (
  //     <div className='w-full py-8 mt-4 text-center'>
  //       <Container>
  //         <h1 className='text-2xl text-gray-300'>
  //           No problems added yet!
  //         </h1>

  //         {/* Add form even when empty */}
  //         <div className="mt-6">
  //           <Addproblem onAdd={fetchProblems} />
  //         </div>
  //       </Container>
  //     </div>
  //   )
  // }

  //  main UI
  return (
    <div className="py-6">
      <Container>

        {/* STATS SECTION */}
        {/* Ye section total, solved, unsolved problems ka summary dikhata hai */}

        <div className="space-y-6 mb-6">

          {/* 📊 Problem Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="bg-gray-900 border border-gray-800 text-center p-4 rounded-xl
      transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl">
              <h2 className="text-gray-300 text-sm">Total</h2>
              <p className="text-blue-400 text-2xl font-semibold">{total}</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 text-center p-4 rounded-xl
      transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl">
              <h2 className="text-gray-300 text-sm">Solved</h2>
              <p className="text-green-400 text-2xl font-semibold">{solved}</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 text-center p-4 rounded-xl
      transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl">
              <h2 className="text-gray-300 text-sm">Unsolved</h2>
              <p className="text-red-400 text-2xl font-semibold">{unsolved}</p>
            </div>

          </div>

          {/* 🔥 Activity Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="bg-gray-900 border border-gray-800 text-center p-4 rounded-xl
      transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10">
              <h2 className="text-gray-300 text-sm">Active Days</h2>
              <p className="text-blue-400 text-2xl font-semibold">{totalActiveDays}</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 text-center p-4 rounded-xl
      transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/10">
              <h2 className="text-gray-300 text-sm">Last 30 Days</h2>
              <p className="text-green-400 text-2xl font-semibold">{last30ActiveDays}</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 text-center p-4 rounded-xl
      transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-500/10">
              <h2 className="text-gray-300 text-sm">Max Streak 🔥</h2>
              <p className="text-yellow-400 text-2xl font-semibold">{maxStreak}</p>
            </div>

          </div>

        </div>


        {/* SEARCH BAR  */}
        {/* Ye input user ko problems search karne deta hai */}

        <div className="mb-6 flex justify-center sm:justify-start">

          {/*  onchange=>Jab user type kare -> state update hoti hai */}
          {/*  value=>Controlled input -> value state se aa rahi hai */}
          <input
            type="text"
            placeholder="Search Problem..."
            value={search || ""}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-md p-3 rounded-xl bg-gray-900 text-white 
    border border-gray-700 
    focus:outline-none focus:ring-2 focus:ring-blue-500 
    transition-all duration-300"
          />

        </div>





        <div className="flex flex-col gap-4 mb-6">

          {/*  STATUS FILTER */}
          <div className="flex gap-2 flex-wrap">
            {["All", "Solved", "Unsolved"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-3 py-1 rounded ${filter === item
                  ? item === "Solved"
                    ? "bg-green-600 text-white"
                    : item === "Unsolved"
                      ? "bg-red-600 text-white"
                      : "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/*  DIFFICULTY FILTER */}
          <div className="flex gap-2 flex-wrap">
            {["All", "Easy", "Medium", "Hard"].map((item) => (
              <button
                key={item}
                onClick={() => setDifficultyFilter(item)}
                className={`px-3 py-1 rounded ${difficultyFilter === item
                  ? item === "Easy"
                    ? "bg-green-500 text-black"
                    : item === "Medium"
                      ? "bg-yellow-500 text-black"
                      : item === "Hard"
                        ? "bg-red-500 text-white"
                        : "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/*  SORT */}
          <div className="flex gap-2 flex-wrap">
            {["none", "title", "status", "difficulty"].map((item) => (
              <button
                key={item}
                onClick={() => setSortBy(item)}
                className={`px-3 py-1 rounded ${sortBy === item
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>

        </div>



        {/*  ADD / EDIT FORM */}
        {!editProblem && (
          <Addproblem onAdd={fetchProblems} />
        )}

        {editProblem && (
          <Addproblem
            problem={editProblem}
            onAdd={fetchProblems}
            onClose={() => setEditProblem(null)}
          />
        )}
        {/* Problem List */}
        <div className="mt-6 space-y-3 ">
          {finalProblems.length === 0 ? (

            // EMPTY STATE
            <div className="text-center text-gray-400 py-10">
              <h2 className="text-xl">No problems found</h2>
              <p className="text-sm mt-2">
                Try changing filter or search
              </p>
            </div>

          ) : (

            finalProblems.map((problem) => (
              <div
                key={problem.$id}
                className="p-4 bg-gray-900 border border-gray-800 rounded-xl 
    flex flex-col gap-3 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >

                {/* TOP ROW */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

                  {/* Title */}
                  <div className="flex-1">
                    <h2 className="text-white text-lg font-semibold">
                      {problem.title}
                    </h2>
                  </div>

                  {/* Platform */}
                  <div className="flex-1 text-gray-400 text-sm">
                    {problem.platform}
                  </div>

                  {/* Status */}
                  <div className="flex-1">
                    <p className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${problem.status === "Solved"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                      }`}>
                      {problem.status}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-3 sm:ml-auto items-center">

                    {/* NOTE ICON */}
                    <button
                      onClick={() => {
                        setOpenNoteId(
                          openNoteId === problem.$id ? null : problem.$id
                        )
                        setNoteText(problem.note || "")
                      }}
                      className="text-gray-400 hover:text-blue-400 text-xl"
                    >
                      📝
                    </button>

                    {/* EDIT */}
                    <button
                      onClick={() => setEditProblem(problem)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm"
                    >
                      Edit
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => handleDelete(problem.$id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm"
                    >
                      Delete
                    </button>

                  </div>
                </div>

                {/* NOTE SECTION (IMPORTANT: OUTSIDE ROW) */}
                {openNoteId === problem.$id && (
                  <div className="bg-gray-800 p-3 rounded-lg">

                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Write your note..."
                      className="w-full p-2 rounded bg-gray-900 text-white"
                    />

                    <button
                      onClick={async () => {
                        try {
                          await service.updateProblem(problem.$id, {
                            ...problem,
                            note: noteText
                          })

                          setProblems((prev) =>
                            prev.map((p) =>
                              p.$id === problem.$id
                                ? { ...p, note: noteText }
                                : p
                            )
                          )

                          setOpenNoteId(null)
                          toast.success("Note saved ✅")

                        } catch (err) {
                          toast.error("Failed to save note ❌")
                        }
                      }}
                      className="bg-blue-600 px-3 py-1 rounded mt-2 text-white"
                    >
                      Save
                    </button>

                  </div>
                )}

              </div>
            ))

          )}

        </div>


      </Container>
    </div>
  )
}

export default Home