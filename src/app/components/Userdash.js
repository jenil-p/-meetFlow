// "use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState } from 'react'

const Userdash = () => {
    const { data: session } = useSession()
    return (
        <>
            <div className='font-bold text-2xl text-center py-5'>
                Welcome {session.user.name} !
            </div>
            <div className="numbers">
                <div className="attend">
                    <div className="text-white font-semibold">Atteneded</div>
                    <div className="number_of_attened">10</div>
                </div>
                <div className="upcoming"></div>
                <div className="reviewed"></div>
            </div>
        </>
    )
}

export default Userdash
