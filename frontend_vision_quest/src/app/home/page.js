import Link from "next/link";
import Header from "../../../components/Header";

export default function Page() {
    return (
      <>
        <Header />
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <h1>Hello, Home pageeee!</h1>
        </div>
      </>
    )
  }