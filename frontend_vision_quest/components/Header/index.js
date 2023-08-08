import Link from "next/link";

export default function Header() {
    return (
      <>
        <header className="bg-gray-800 text-white py-4">
          <nav className="container mx-auto flex justify-between items-center">
            <Link className="text-4xl font-bold text-white-700" href="/">Vision Quest</Link>
              <div className="space-x-4">
                <Link 
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white-900 hover:bg-gray-50" 
                    href="/signin"
                >
                        Sign In
                </Link>
                <Link 
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white-900 hover:bg-gray-50" 
                    href="/signin"
                >
                        Sign Up
                </Link>
              </div>
          </nav>
        </header>
      </>
    )
  }