// import logo from './logo.svg';
import { SocketProvider } from "@hilma/socket.io-react";
import './App.css';
import Chat from "./components/Chat";

function App() {
  return (
    <div className="App">
      <SocketProvider
        uri={process.env.REACT_APP_DOMAIN_NAME}
        options={{
          transports: ["websocket"],
          token: "klklkl"
        }}
      >
        <Chat />
      </SocketProvider>
    </div>
  );
}

export default App;
