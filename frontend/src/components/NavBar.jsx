import { Link } from "react-router";
import {PlusIcon} from "lucide-react"

const NavBar = () => {
  return (
    <header className="bg-base-300 border-b border-base-content/25">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-4xl font-bold text-primary font-mono tracking-tight">My-Notes</h1>
          <div className="flex items-center gap-4">
            <Link to={"/create"} className="btn btn-primary">
                          <PlusIcon className="size-6" />
                          <span className="font-semibold font-mono text-xl tracking-tight">New Note</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default NavBar
