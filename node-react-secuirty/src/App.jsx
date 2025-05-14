import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]); // State to store user data
  const [error, setError] = useState(null); // State to store errors

  // backend running on http://localhost:3000 Facebook app
  // React app running on http://localhost:5173 Google app
  useEffect(() => {
    fetch('http://localhost:3000/api/users')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json(); // Parse the JSON response
      })
      .then(data => {
        setUsers(data.users); // Update state with user data
      })
      .catch(error => {
        setError(error.message); // Update state with error message
      });
  }, []);

  return (
    <div>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users loaded</p>
      )}
    </div>
  );
}

export default App;
