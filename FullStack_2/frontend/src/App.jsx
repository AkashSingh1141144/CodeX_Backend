import { useState } from 'react'
import axios from 'axios'
import './App.css'
import { useEffect } from 'react'

function App() {
  
  const [data, setData] = useState([])

  useEffect(() => {
    axios.get('/api/user')
    .then((response) => {
      setData(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
  })

  return (
    <>
     <div>
        <h1>Connecting Frontend to Backend</h1>
        <p>User's Data: {data.length}</p>

        {data.map((user) => (

          <div key={user.id}>
            <h3>Name: {user.name}</h3>
            <p>Email: {user.email}</p>
            <p style={{
              'color' : 'red'
            }}>City: {user.city}</p>
            <p>Age: {user.age}</p>
          </div>

        ))}
     </div>
    </>
  )
}

export default App
