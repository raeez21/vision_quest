'use client'

import Link from "next/link";
import { useAuth } from "../AuthContext";

export default function Header() {
  const { username } = useAuth();

  return (
    <>
      <header className="bg-gray-800 text-white py-4 fixed top-0 w-full shadow-2xl z-10">
        <nav className="container mx-auto flex justify-between items-center">
          <Link className="text-4xl font-bold text-gray-100 p-4 flex" href="/">
            <img
              src="https://i.ibb.co/MnHCzpJ/visionquest-logo.png" 
              alt="Logo"
              className="w-10 h-10 mr-4"
            />
            visionquest
          </Link>
          {username ? (
            <Link href="/profile" className="flex items-center space-x-2">
              <p className="text-gray-400">Hello, </p>
              <p className=" font-bold">{username}</p>
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
                  className="-mx-3 block rounded-md px-3 py-2 text-sm leading-7 text-gray-300 hover:bg-slate-500 hover:text-slate-300" //bg-gray-400 text-slate-700 hover:bg-slate-500 hover:text-slate-300
                  href="/signin"
              >
                Sign In
              </Link>
              <Link 
                  className="-mx-3 block rounded-md px-3 py-2 text-sm leading-7 bg-purple-700 text-white hover:bg-purple-800 transition duration-300" 
                  href="/signup"
                  // style={{
                  //   backgroundColor: 'rgba(103, 6, 206, 1)',
                  //   color: 'rgba(255, 255, 255, 1)'
                  // }}
              >
                Create Account
              </Link>
            </div>
          )}
        </nav>
      </header>
    </>
  )
}