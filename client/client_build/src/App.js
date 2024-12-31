import React, { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    fetch("http://localhost:3000/")
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <p>Hello world! Andrew</p>
        <h2>This is my project</h2>
      </header>
    </div>
  );
}

export default App;
