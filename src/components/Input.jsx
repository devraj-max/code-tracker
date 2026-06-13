import React, { useId } from 'react'

const Input = React.forwardRef(function Input(
  {
    label,
    type = "text",
    className = "",
    id,
    ...props
  },
  ref
) {
  const generatedId = useId()
  const inputId = id || generatedId

  return (
    <div className='w-full'>
      {label && (
        <label htmlFor={inputId} className='inline-block mb-1 pl-1 text-gray-300'>
          {label}
        </label>
      )}

      <input
        type={type}
        id={inputId}
        ref={ref}
        className={`
          w-full p-3 rounded-2xl text-white
          bg-linear-to-r from-white/5 to-white/10
          backdrop-blur-xl
          border border-white/10

          hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10
          focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30

          transition-all duration-300 outline-none
          ${className}
        `}
        {...props}
      />
    </div>
  )
})

export default Input