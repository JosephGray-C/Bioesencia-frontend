// Imports
import { useEffect, useState } from "react";
import { getUsers } from "../services/userService";

export default function UsersPage() {

    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => { 
        console.log("Component mounted");
        const loadData = async () => {
            try {
                const response = await getUsers();
                setUsers(response.results);
            } catch (err) {
                setError("Error loading Users Page data");
            }
        };
        loadData();
    }, []);

    console.log(error)
    console.log(users);

  return (
    <>
        <div className="center">
            <h1>
                Users Page
            </h1>

            <div className="root-container">
                {
                    users.map((user) => (
                            <div key={user.id} className="user-container">
                                <h2>{user.name.first}</h2>
                                <p>{user.email}</p>
                            </div>
                    ))
                }
            </div>

        </div>
    </>
  )
}