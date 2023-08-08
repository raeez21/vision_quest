import Link from "next/link";

export default function Header() {
    return (
      <>
        <header className="bg-gray-800 text-white py-4">
          <nav className="container mx-auto flex justify-between items-center">
            <Link href="/">Vision Quest</Link>
              <div className="space-x-4">
                <Link href="/signin">Sign In</Link>
                <Link href="/signup">Sign Up</Link>
              </div>
          </nav>
        </header>
      </>
    )
  }