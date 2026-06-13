import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import { Provider } from 'react-redux'
import { RouterProvider,createBrowserRouter } from 'react-router-dom'
import store from './store/store.js'
import { AuthLayout } from './components/index.js'
import Home from './pages/Home.jsx'
import Contests from './pages/Contests.jsx'
// import { ThemeProvider } from './contexts/theme.jsx'
const router =createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/login",
        element:(
          <AuthLayout authentication={false}>
            <Login/>
          </AuthLayout>
        ),
      },
      {
        path:"/signup",
        element:(
          <AuthLayout authentication={false}>
            <Signup/>
          </AuthLayout>
        ),
      },
      {
        path:"/contest",
        element:(
            <Contests/>
        )
      },
      {
        path: "*",
        element: <h1>404 Page Not Found</h1>
      }
      
     
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      {/* <ThemeProvider> */}
      <RouterProvider router={router}/>
      {/* </ThemeProvider> */}
    </Provider>
  </StrictMode>,
)
