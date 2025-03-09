"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState } from 'react'


const Navbar = () => {
  const [dropdown, setDropdown] = useState(false)
  const { data: session } = useSession()


  return (
    <div className='bg-white flex justify-between items-center px-10 box-border h-16' >
      <div className="logo text-gray-700 font-bold sm:text-2xl text-lg"><Link href={"/"}>MeetFlow</Link></div>
      {!session && (
        <div className="buttons flex space-x-1">
          <ul className='flex gap-4 sm:text-lg text-sm text-gray-700'>
            <li><Link href={"/"}>About</Link></li>
            <li><Link href={"/"}>Contact</Link></li>
            <li><Link href={"/login"}>Log In</Link></li>
          </ul>
        </div>
      )}
      
      {session && (
        <div className="buttons flex space-x-1">
          <ul className='flex gap-4 sm:text-lg text-sm text-gray-700'>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href={`/${session.user.name}`}>Your Page</Link></li>
            <li><Link href="/login" onClick={() => signOut()}>Sign Out</Link></li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Navbar