'use client'

import Link from "next/link";
import { useAuth } from "../AuthContext";

export default function Header() {
  const { authToken } = useAuth()

  return (
    <>
      <header className="bg-gray-800 text-white py-4">
        <nav className="container mx-auto flex justify-between items-center">
          <Link className="text-4xl font-bold text-gray-400 p-4" href="/">Vision Quest</Link>
          {authToken ? (
            <Link href="/profile" className="flex items-center space-x-2">
            <p className="text-gray-400">Hello, </p>
            <p className="text-gray-400 font-bold">Raeez </p>
            <img
              width={60}
              src='https://cdn-icons-png.flaticon.com/512/6596/6596121.png' // Use the user's avatar URL
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
          </Link>
          ) : (
            <div className="space-x-4 flex">
              <Link 
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-400 hover:bg-gray-50" 
                  href="/signin"
              >
                Sign In
              </Link>
              <Link 
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-400 hover:bg-gray-50" 
                  href="/signup"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </header>
    </>
  )
}