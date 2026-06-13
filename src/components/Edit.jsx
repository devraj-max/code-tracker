import React, { useEffect, useState } from 'react'
import service from '../appwrite/config'
import { useNavigate,useParams } from 'react-router-dom'
import Container from './container/Container'
import Addproblem from './Addproblem'
function Edit() {
    const [problem,setproblem]=useState(null)
    const navigate=useNavigate()
    const {slug}=useParams()

    useEffect(()=>{
        if(slug){
            service.getProblem(slug).then((problem)=>{
                if(problem){
                    setproblem(problem)
                }
            })
        }else{
            navigate('/')
        }

    },[slug,navigate])

    if (!problem) {
    return <h1>Loading...</h1>
  }

  return  problem?(
    <div className='py-8'>
        <Container>
            <Addproblem problem={problem}/>
        </Container>
      
    </div>
  ):null
}

export default Edit
