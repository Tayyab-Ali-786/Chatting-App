import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./components/Chat";
import { MessageSquare, User, Hash, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://parental-bass-tayyabalirashid-cc4644f1.koyeb.app/";
const socket = io(BACKEND_URL, {
  path: "/ws/",
  transports: ["websocket"]
});

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App min-h-screen flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {!showChat ? (
          <motion.div
            key="join"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="joinChatContainer glass p-8 rounded-3xl w-full max-w-md"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
                <MessageSquare size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Nexus Chat</h1>
              <p className="text-slate-400">Connect instantly with anyone, anywhere.</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Your Name..."
                  className="w-full pl-12"
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>
              <div className="relative">
                <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Room ID..."
                  className="w-full pl-12"
                  onChange={(event) => setRoom(event.target.value)}
                />
              </div>
              <button
                onClick={joinRoom}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 group"
              >
                Join Room
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Chat socket={socket} username={username} room={room} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
