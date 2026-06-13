import React, { useEffect, useState } from 'react'

function Contests() {
    const [contests, setContests] = useState([])
    const [time, setTime] = useState(Date.now())




    //useEffect ka use isliye kiya taki component mount hone par API se data ek baar fetch ho jaye, fir us data ko state me store kiya aur map karke UI me show kiya.
    useEffect(() => {
        const fetchContests = async () => {
            try {
                // 🔹 Codeforces
                const cfRes = await fetch("https://codeforces.com/api/contest.list")
                const cfData = await cfRes.json()

                const cfUpcoming = cfData.result
                    .filter(c => c.phase === "BEFORE")
                    .map(c => ({
                        name: c.name,
                        site: "Codeforces",
                        start_time: new Date(c.startTimeSeconds * 1000),
                        url: `https://codeforces.com/contest/${c.id}`
                    }))

                // 🔹 LeetCode
                // const lcRes = await fetch("https://lccn.lbao.site/api/contest")
                // const lcData = await lcRes.json()

                // const lcUpcoming = lcData.data.contestUpcomingContests.map(c => ({
                //   name: c.title,
                //   site: "LeetCode",
                //   start_time: new Date(c.startTime * 1000),
                //   url: `https://leetcode.com/contest/${c.titleSlug}`
                // }))

                // 🔹 CodeChef
                // const ccRes = await fetch("https://www.codechef.com/api/list/contests/all")
                // const ccData = await ccRes.json()

                // const ccUpcoming = ccData.future_contests.map(c => ({
                //   name: c.contest_name,
                //   site: "CodeChef",
                //   start_time: new Date(c.contest_start_date),
                //   url: `https://www.codechef.com/${c.contest_code}`
                // }))

                // 🔥 Merge + Sort
                const all = [...cfUpcoming]
                all.sort((a, b) => a.start_time - b.start_time)

                setContests(all)

            } catch (err) {
                console.error("Error fetching contests:", err)
            }
        }

        fetchContests()
    }, [])


    //update coutdown time for contest
    const getTimeLeft = (startTime) => {
        const now = new Date()
        const diff = startTime - now

        if (diff <= 0) return "Started"

        const seconds = Math.floor(diff / 1000) % 60
        const minutes = Math.floor(diff / (1000 * 60)) % 60
        const hours = Math.floor(diff / (1000 * 60 * 60)) % 24
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))

        return `${days}d ${hours}h ${minutes}m ${seconds}s`
    }

    //hr sec me re-render hoga update hoga ise live countdown
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(Date.now())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    //agar useEffect me contests dependency me rakhenge, to har state update ke baad useEffect dobara run hoga, aur kyunki useEffect ke andar hi setContests ho raha hai, ye infinite loop create kar dega
    const getBadgeColor = (site) => {
        if (site === "Codeforces") return "bg-blue-600"
        if (site === "LeetCode") return "bg-yellow-500 text-black"
        if (site === "CodeChef") return "bg-orange-600"
        return "bg-gray-600"
    }

    return (
        <div className="p-4 sm:p-6 text-white">

            <h1 className="text-2xl sm:text-3xl font-bold mb-6">
                Upcoming Contests 🚀
            </h1>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">

                {contests.map((contest, index) => (
                    <a
                        key={index}
                        href={contest.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-full"
                    >
                        <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl
              hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300
              hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer
              flex flex-col justify-between h-full"
                        >

                            <div>
                                <span className={`text-xs px-2 py-1 rounded mb-2 inline-block ${getBadgeColor(contest.site)}`}>
                                    {contest.site}
                                </span>

                                <h2 className="text-lg font-semibold text-blue-400 mb-2 line-clamp-2">
                                    {contest.name}
                                </h2>

                                <p className="text-sm text-gray-300">
                                    📅 {contest.start_time.toLocaleDateString()}
                                </p>

                                <p className="text-sm text-gray-400">
                                    ⏰ {contest.start_time.toLocaleTimeString()}
                                </p>
                                <p className="text-sm text-green-400 mt-2">
                                    ⏳ {getTimeLeft(contest.start_time)}
                                </p>
                            </div>

                            <p className="text-xs text-gray-600 mt-2">
                                Click to open →
                            </p>

                        </div>
                    </a>
                ))}

            </div>
        </div>
    )
}

export default Contests