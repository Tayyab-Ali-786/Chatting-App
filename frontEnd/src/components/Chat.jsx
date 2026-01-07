import React, { useEffect, useState, useRef } from 'react';
import { Send, Hash, User, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const scrollRef = useRef();

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
        return () => socket.off("receive_message");
    }, [socket]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messageList]);

    return (
        <div className="chat-window glass rounded-2xl flex flex-col w-[400px] h-[600px] overflow-hidden">
            <div className="chat-header p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                        <MessageCircle size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Live Chat</h3>
                        <p className="text-xs text-indigo-300 flex items-center gap-1">
                            <Hash size={12} /> {room}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    Online
                </div>
            </div>

            <div className="chat-body flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {messageList.map((messageContent, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={index}
                        className={`flex flex-col ${username === messageContent.author ? "items-end" : "items-start"}`}
                    >
                        <div className={`max-w-[80%] p-3 rounded-2xl ${username === messageContent.author
                                ? "bg-indigo-600 rounded-tr-none"
                                : "bg-white/10 rounded-tl-none"
                            }`}>
                            <p className="text-sm">{messageContent.message}</p>
                        </div>
                        <div className="flex gap-2 mt-1 px-1">
                            <span className="text-[10px] text-slate-500 font-bold">{messageContent.author}</span>
                            <span className="text-[10px] text-slate-500">{messageContent.time}</span>
                        </div>
                    </motion.div>
                ))}
                <div ref={scrollRef} />
            </div>

            <div className="chat-footer p-4 border-t border-white/10 bg-white/5">
                <div className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={currentMessage}
                        placeholder="Type your message..."
                        className="w-full bg-white/5 border-white/10 focus:border-indigo-500 pl-4 pr-12"
                        onChange={(event) => setCurrentMessage(event.target.value)}
                        onKeyPress={(event) => {
                            event.key === "Enter" && sendMessage();
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        className="absolute right-1 text-indigo-400 hover:text-white p-2"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Chat;
