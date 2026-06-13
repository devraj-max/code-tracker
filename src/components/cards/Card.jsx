import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
function Card() {

//cards form krne ke liye mapping hogi galgat direction me soch liya 
//first simple phel user se input lo bs baki baad me sochna h


  return (
    <div className=' w-full m-auto p-4 flex flex-col sm:flex-row'>
       {/* take input =>problem name topic platform difficulty */}

       {/* problem name */}
       <input 
       type="text" 

       className='text-3xl text-cyan-400 p-4'

       />
    </div>
  )
}

export default Card
