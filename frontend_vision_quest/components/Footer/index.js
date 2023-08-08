
export default function Footer() {
    return (
      <>
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-bold text-gray-400">Vision Quest</h2>
                </div>
                <div>
                    <p className="text-xl font-bold text-gray-400">Stay in touch! Join our Newsletter.</p>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="px-4 py-2 rounded bg-gray-700 text-slate-900 focus:outline-none"
                    />
                    <button className="font-bold bg-slate-500 text-slate-900 px-4 py-2 rounded">
                        Subscribe
                    </button>
                </div>
            </div>
        </footer>
      </>
    )
  }