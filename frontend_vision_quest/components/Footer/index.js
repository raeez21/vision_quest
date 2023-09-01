
export default function Footer() {
    return (
      <>
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex p-4 items-center">
                    <img
                        src="https://i.ibb.co/MnHCzpJ/visionquest-logo.png" 
                        alt="Logo"
                        className="w-6 h-6 mr-2"
                    />
                    <h2 className="text-2xl font-bold text-gray-100">visionquest</h2>
                </div>
                <p className="text-gray-500 text-sm">© 2023 visionquest. All rights reserved.</p>
                {/* <div>
                    <p className="text-xl font-bold text-gray-400">Stay in touch! Join our Newsletter.</p>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="px-4 py-2 rounded bg-gray-700 text-slate-900 focus:outline-none"
                    />
                    <button className="font-bold bg-slate-500 text-slate-900 px-4 py-2 rounded">
                        Subscribe
                    </button>
                </div> */}
            </div>
        </footer>
      </>
    )
  }