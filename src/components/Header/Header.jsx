import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container } from '../index'
import { useSelector } from 'react-redux'
import LogoutBtn from './LogoutBtn'
import Contests from '../../pages/Contests'
import useTheme from '../../contexts/theme'

function Header() {

  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const location = useLocation()

  // theme mode
  const { themeMode, lightTheme, darkTheme } = useTheme()

  const toggleTheme = () => {
    if (themeMode === "dark") lightTheme()
    else darkTheme()
  }

  const navItems = [
    { name: 'Home', slug: "/", active: true },
    { name:'Contests', slug:"/contest", active:true },
    { name: 'Login', slug: "/login", active: !authStatus },
    { name: 'Signup', slug: "/signup", active: !authStatus },
  ]

  return (
    <header className="
      sticky top-0 z-50 
      bg-white dark:bg-gray-900 
      backdrop-blur-md 
      border-b border-gray-200 dark:border-white/10 
      transition-all duration-300
    ">

      <Container>
        <nav className="flex items-center justify-between h-16">

          {/* Logo */}
          <div
            className="text-black dark:text-white font-bold text-xl cursor-pointer hidden sm:block"
            onClick={() => navigate("/")}
          >
            CodeTracker
          </div>

          {/* Nav Items */}
          <ul className="flex items-center gap-8">

            {navItems.map((item) =>
              item.active ? (
                <li key={item.name} className="group relative">

                  <button
                    onClick={() => navigate(item.slug)}
                    className={`relative py-1 transition-colors duration-300 ${
                      location.pathname === item.slug
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    {item.name}

                    {/*  Animated underline */}
                    <span
                      className={`absolute left-0 -bottom-1 h-[2px] bg-blue-500 dark:bg-blue-400 transition-all duration-300
                      ${
                        location.pathname === item.slug
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    />
                  </button>

                </li>
              ) : null
            )}

            {/* THEME TOGGLE */}
           

            {/* Logout Button */}
            {authStatus && (
              <li className="relative group text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white cursor-pointer">

                {/* Logout Button */}
                <LogoutBtn />

                {/* Animated underline */}
                <span
                  className="absolute left-0 -bottom-1 h-[2px] bg-blue-500 dark:bg-blue-400 
                  w-0 group-hover:w-full transition-all duration-300"
                />

              </li>
            )}

          </ul>

        </nav>
      </Container>

    </header>
  )
}

export default Header