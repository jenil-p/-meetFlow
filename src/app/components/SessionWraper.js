"use client"
import { SessionProvider } from "next-auth/react"

export default function SessionWraper({children}) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}