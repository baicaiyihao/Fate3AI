import React, { useState } from 'react'
export default function Title() {
  const [title, setTitle] = useState('Fate3AI')
  

  return (
    <div className="flex flex-col text-left w-full">
        <div className='text-4xl'>
        The first AI-powered fortune-telling platform built on Sui.
        </div>
        <div className='text-title text-nav'>
           {title} 
        </div>
        <div className='text-2xl'>
        Built on Sui, Eliza combines blockchain wisdom with AI divination
        to predict market trends
        </div>
        
    </div>
  )
}
