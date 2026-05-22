import React from 'react'

function LoadingSpinner() {
  return (
    <div className='loadingskeleton w-full h-full bg-white flex items-center justify-center overflow-hidden '>
      <div className="loader h-12 w-12 rounded-full border-4 border-t-blue-600 border-slate-200 animate-spin  ">
      </div>
   </div>
  )
}

export default LoadingSpinner