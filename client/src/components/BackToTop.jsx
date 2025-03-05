/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'

export default function BackToTop() {
    const[backToTopButton,setBackToTopButton]=useState(false);

    useEffect(()=>{
     window.addEventListener("scroll",()=>{
        if(window.scrollY>100){
            setBackToTopButton(true);
        }else{
            setBackToTopButton(false);
        }
     })
    },[])

    const scrollUp=()=>{
        window.scrollTo({
            top:0,
            behavior:"smooth"
        })
    }


  return (
    <div>
    {backToTopButton && (
      <button 
        onClick={scrollUp}
        type="button"
        className="z-50 pill fixed bottom-16 right-4 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        <svg
          className="w-8 h-8 my-auto mx-auto text-white"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="ethereum"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
        >
          <path
            fill="currentColor"
            d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"
          />
        </svg>
      &nbsp;
      </button>
    )}
  </div>
  
  )
}
