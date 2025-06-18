// Imports
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <div className="not-found">
        <p>
          404 Not Found
        </p>
        <Link className="" to="/">Go to Home</Link>
      </div>
    </>
  )
}