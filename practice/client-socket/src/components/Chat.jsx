import React, { useEffect, useState } from 'react';
import { useSocket } from '@hilma/socket.io-react';
import MessageCard from "./MessageCard";
import ConnectCard from "./ConnectCard";
import SendIcon from '@material-ui/icons/Send';
import { IconButton } from '@material-ui/core'
import "../styles/chat.scss";

// events to do:
//     emit: "send_message" 
//          data for the emit - object that includes: content, sender and date (use current time function)
//     on: "received_message", "received_connect", "received_disconnect"
//          data to receive: name, ip, message
//     off: to all the on events

/**
 * messeges state below has 2 types of messages-
 * connection message type:
 *  { id, type: 'connection', ip, action: 'connect' | 'disconnect' }
 * message type:
 *  { id, type: 'message', ip, content, sender, date }
*/

const Chat = () => {
    const [messages, setMessages] = useState([
        { type: 'message', ip: '192.168.0.47', content: "שלום כולם", sender: 'מעין', date: '19:00' },
        { type: 'message', ip: '192.168.0.74', content: "ברוכים הבאים לתרגול", sender: 'תמר', date: '19:01' },
        { type: 'message', ip: '192.168.0.185', content: 'בהצלחה D:', sender: 'אריאלה', date: '19:03' },
    ]);

    const [ipAddress, setIpAddress] = useState('')
    const [input, setInput] = useState("");
    const socket = useSocket();

    useEffect(() => {
        if (!localStorage.getItem('name')) {
            getUserName()
        }
    }, [])

    useEffect(() => {
        // todo - write your code here
        // use the functions - addConnectionMessage and addMessage

        socket.on('connected', ({ ip }) => {
            setIpAddress(ip)
        })
        
        // don't forget to clean up 😉

    }, []);

    useEffect(() => {
        if (!messages.length) return
        scrollToNewMessage(messages[messages.length - 1].id)
    }, [messages])

    function getUserName() {
        let userName;
        while (!userName) {
            userName = prompt("enter your name:");
        }
        localStorage.setItem('name', userName)
    }

    function onChange(e) {
        const { value } = e.target;
        setInput(value);
    }

    function sendMessage() {
        if (!input.trim()) return
        // todo - write your code here
        setInput("")
    }

    function currentTime() {
        const date = new Date()
        return date.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })
    }

    function handleKeyDown({ which }) {
        if (which !== 13) return
        sendMessage();
    }

    function addConnectionMessage({ action, ip, id }) {
        const message = { id, type: "connection", action, ip }
        setMessages(prev => {
            return [...prev, message]
        })
    }

    function addMessage({ ip, date, content, sender, id }) {
        const message = { id, type: "message", ip, sender, date, content }
        setMessages(prev => {
            return [...prev, message]
        })
    }

    const scrollToNewMessage = (id) => {
        const el = document.getElementById(String(id))
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
    }

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map((message, i) =>
                    message.type === 'connection' ?
                        <ConnectCard
                            key={i}
                            isMe={ipAddress === message.ip}
                            {...message} /> :
                        <MessageCard
                            key={i}
                            isMe={ipAddress === message.ip}
                            {...message} />
                )}
            </div>

            <div className="input">
                <input type="text" placeholder="הקלד/י הודעה" onChange={onChange} value={input || ""} onKeyDown={handleKeyDown} />
                <div className="send">
                    <IconButton onClick={sendMessage}>
                        <SendIcon className='send-icon' />
                    </IconButton>
                </div>
            </div>
        </div>
    )
}
export default Chat