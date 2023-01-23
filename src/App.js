import "./App.scss";
import { useEffect, useState } from "react";
import Player from "./Components/Player";

function App() {
  const getStreams = async () => {
    const getData = await fetch(`${process.env.PUBLIC_URL}/streams.json`);
    const response = await getData.json();
    setStreams(response.streams);
  };

  const [streams, setStreams] = useState();
  useEffect(() => {
    getStreams();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        {streams !== undefined ? <Player streams={streams} /> : null}
      </header>
    </div>
  );
}

export default App;
