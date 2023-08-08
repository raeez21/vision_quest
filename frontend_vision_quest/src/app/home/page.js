import Link from "next/link";

export default function Page() {
    return (
      <>
        <header className="bg-gray-800 text-white py-4">
          <nav className="container mx-auto flex justify-between items-center">
            <Link href="/">Home</Link>
              <div className="space-x-4">
                <Link href="/signin">Sign In</Link>
                <Link href="/signup">Sign Up</Link>
              </div>
          </nav>
        </header>
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <h1>Hello, Home pageeee!</h1>
        </div>
      </>
    )
  }