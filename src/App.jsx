import { useEffect, useState } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import authService from './appwrite/auth'
import { login ,logout} from './store/authSlice'
import Header from './components/Header/Header'
//for toast import 
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"



function App() {
  const [loading, setLoading] = useState(true)
  const [themeMode,setThemeMode]=useState("dark")

//theme mode
const lightTheme=()=>{
  setThemeMode("light")
}
const darkTheme=()=>{
  setThemeMode("dark")
}

useEffect(() => {
  const root = document.documentElement;

  root.classList.remove("dark", "light");
  root.classList.add(themeMode);
}, [themeMode]);


  const dispatch=useDispatch()
  useEffect(()=>{
    // if page is refresh then page login sessinon restore by appwrite make a cokkie session from if statement below
    authService.getCurrentUser().then((userData)=>{
      if(userData){
        dispatch(login({
          userData:{
            $id: userData.$id,
            email:userData.email,
            name:userData.name
          }
        }))
      }else{
        dispatch(logout())
      }
    }).finally(()=>setLoading(false))
  },[])

  return !loading? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-800'>
      
    {/* Toast container (ADD THIS) */}
    <ToastContainer position="top-right" autoClose={2000} />


      <div className='w-full block'>
        <Header/>
        <main>
          <Outlet/>
        </main>
      </div>
      
    </div>
  ) :(<h1> Loading...</h1>)
}

export default App
