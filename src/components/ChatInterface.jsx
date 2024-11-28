import React, { useState, useEffect, useRef } from "react";
import { useNavigate,useLocation } from 'react-router-dom';
import "../css/chatbot.css";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
} from "@mui/material";
import AccordionActions from '@mui/material/AccordionActions';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const departments = [
    "Underwriting", "Claims", "Actuarial", "Sales and Marketing", "Customer Service", "Policy Administration", "Finance and Accounting", "Legal and Compliance", "Information Technology (IT)", "Human Resources (HR)", "Risk Management", "Reinsurance", "Product Development"
];

const ChatInterface = () => {
    const [userEmail, setUserEmail] = useState("");
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const startConvo = location.state?.startConvo || false;
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [conversationName, setConversationName] = useState("");
    const [department, setDepartment] = useState("");
    const [isStartingConversation, setIsStartingConversation] = useState(startConvo);
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef(null);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:6001/api/isAuth', {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.ok) {
                    const userSession = await response.json();
                    //console.log(userSession);
                    setUserEmail(userSession.email);
                    setUserName(userSession.name);
                    return;
                } else {
                    const errorData = await response.text(); // Get the raw text to see the error
                    navigate("/");
                    console.log('User is not authenticated:', errorData);
                }
            } catch (error) {
                console.log(error);
                navigate('/')
                setError('An error occurred during Authentication');
            }
        }
        checkAuth();
    }, [navigate]);


    useEffect(() => {
        const loadPrevConversations = async () => {
            if (!userEmail) return; // Wait until userEmail is set

            try {
                const response = await fetch(
                    `http://localhost:6001/api/prevChats?userEmail=${encodeURIComponent(userEmail)}`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (response.ok) {
                    const previousChats = await response.json();
                    const chats = previousChats.map(chat => ({
                        id: chat._id,
                        name: chat.logName,
                        userEmail: chat.userEmail,
                        department: chat.metaModelName,
                        status: "Not Sent", // Initialize with 'Not Sent' status
                    }));
                    setConversations(chats);
                    setIsStartingConversation(startConvo);
                    // Here you can set previous chats into your state if needed, e.g., setPrevChats(previousChats);
                } else {
                    console.log("Failed to load previous chats");
                }
            } catch (error) {
                console.log(error);
            }
        };

        loadPrevConversations();
    }, [userEmail]);

    useEffect(() => {
        //console.log(isStartingConversation,conversations.length);
        if (!isStartingConversation && conversations && conversations.length > 0) {
            setExpanded(0); // Expand the first accordion
            loadConversation(0); // Load the first conversation
        } else {
            setIsStartingConversation(true); // No conversations available
        }
    }, [conversations]);


    // Scroll to the bottom whenever messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping]); // Include `isTyping` to account for the loading state

    // Typewriter effect for responses
    const typewriterEffect = (text) => {
        return new Promise(async (resolve) => {
            let currentText = "";
            for (const element of text) {
                currentText += element;
                setMessages((prevMessages) => [
                    ...prevMessages.slice(0, -1), // Replace the last message
                    { role: "model", parts: [{ text: currentText }] },
                ]);
                await new Promise((resolve) => setTimeout(resolve, 25)); // Adjust speed
            }
            resolve();
        });
    };


    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!userInput.trim()) return; // Prevent empty messages

        const newMessage = {
            role: "user",
            parts: [{ text: userInput }],
        };
        console.log(newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setUserInput("");
        try {
            setIsTyping(true);
            const response = await fetch('http://localhost:6001/api/userMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    logName: conversationName, userEmail, metaModelName: department, userMessage: newMessage.parts[0].text
                }),
            });
            const data = await response.json();
            console.log(data.apiResponse);

            setIsTyping(false);
            // Simulating model response
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: "model", parts: [{ text: "" }] }, // Placeholder for typing effect
            ]);
            await typewriterEffect(data.apiResponse);
        } catch (error) {
            console.log(error);
        }


    };

    const handleStartConversation = async (e) => {
        e.preventDefault();
        console.log("NEW Conversation started");
        console.log(conversationName, userEmail, department);
        try {
            const response = await fetch('http://localhost:6001/api/createChatLog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    logName: conversationName, userEmail, metaModelName: department
                }),
            });
            if (response.status === 400) {
                const errorData = await response.json();
                alert(errorData.error); // Alert message for duplicate conversation
                return;
            }

            if (response.ok) {
                const chat = await response.json();
                const newConvo = {
                    id: chat._id,
                    name: chat.logName,
                    userEmail: chat.userEmail,
                    department: chat.metaModelName,
                    status: "Not Sent",
                };
                setConversations((prevConversations) => [
                    ...prevConversations,
                    newConvo,
                ]);
                setIsStartingConversation(false);
            }
            else {
                console.log("Failed to start a new conversation.");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const startNewConversation = () => {
        setConversationName("");
        setDepartment("");
        setMessages([]);
        setIsStartingConversation(true); // Show the conversation setup form
    };

    const saveConversation = () => {
        if (conversationName.trim() && department) {
            const newConversation = {
                name: conversationName,
                department,
                messages,
                status: "Not Sent", // Initialize with 'Not Sent' status
                summary: "", // To hold the conversation summary
            };

            setConversations((prevConversations) => [
                ...prevConversations,
                newConversation,
            ]);
            setIsStartingConversation(false);
            // setConversationName("");
            // setMessages([]); // Start a fresh conversation
        }
    };

    const loadConversation = async (index) => {
        setIsStartingConversation(false);
        const conversation = conversations[index];
        setSelectedConversation(index);
        setConversationName(conversation.name);
        setDepartment(conversation.department);
        try {
            const response = await fetch(`http://localhost:6001/api/chatHistory/${conversation.id}`, {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const chatHistory = await response.json();
                setMessages(chatHistory); // Assuming `setMessages` is used to display the chat history
            } else {
                console.log("Failed to load chat history");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const generateSummary = () => {
        // Create a summary of the conversation messages
        const summary = messages
            .map((msg) => `${msg.sender}: ${msg.text}`)
            .join("\n");
        updateConversationStatus("Sent", summary); // Mark as sent and add summary
    };

    const updateConversationStatus = (status, summary = "") => {
        setConversations((prevConversations) =>
            prevConversations.map((conv, index) =>
                index === selectedConversation
                    ? { ...conv, status, summary } // Update the status and summary
                    : conv
            )
        );
    };

    // Simulate response for accepting/rejecting summary
    const simulateReviewResponse = (accepted) => {
        const status = accepted ? "Accepted" : "Rejected";
        updateConversationStatus(status); // Update based on response
    };

    const goBackToHome = () => {
        navigate('/');
    }

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null); // Toggles the expanded state
        if (isExpanded) {
            loadConversation(panel); // Calls the function to load the conversation
        }
    };

    return (<div className="chatbot-app">
        {/* Side Panel for Conversations */}
        <div className="side-panel">
            <h3 className="sideHeading">Conversations</h3>
            <button onClick={startNewConversation} className="save-button">
                New Conversation
            </button>
            <ul className="conversation-list" style={{ listStyleType: "none", padding: 0 }}>
                {conversations.map((conversation, index) => (
                    <Accordion
                        key={`${conversation.name}-${conversation.id}`}
                        expanded={expanded === index}
                        onChange={handleAccordionChange(index)}
                        sx={{
                            backgroundColor: "black",
                            color: "white",
                            fontFamily: "Poppins",
                            transition: "background-color 0.3s",
                            borderRadius: "10px",
                            marginBottom: "10px",
                            ":hover": { backgroundColor: "rgb(75, 72, 72)" },
                            padding: 0, // Ensure compact initial spacing
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                            aria-controls={`panel${index}-content`}
                            id={`panel${index}-header`}
                            sx={{
                                padding: "10px 15px", // Adds some spacing for the header
                                minHeight: 40, // Makes the accordion header compact
                                "& .MuiAccordionSummary-content": {
                                    margin: 0, // Ensures content stays compact
                                },
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{ fontWeight: 500, }}
                            >
                                {conversation.name} - {conversation.status}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            sx={{
                                backgroundColor: "rgb(51, 50, 50)",
                                borderRadius: "0 0 10px 10px",
                                padding: "10px 15px",
                            }}
                        >
                            <Typography variant="body2" sx={{ marginBottom: 1 }}>
                                <strong>Department:</strong> {conversation.department || "N/A"}
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: 1 }}>
                                <strong>Summary:</strong> {conversation.summary || "N/A"}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Comments:</strong> {conversation.comments || "None"}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </ul>


            <button onClick={goBackToHome} className="save-button">
                Back to Home
            </button>
        </div>

        {/* Chat Box */}
        <div className="chatbox-container">
            {isStartingConversation ? (<div className="conversation-setup">
                <h3>Start a new Conversation.</h3>
                <input
                    type="text"
                    value={conversationName}
                    onChange={(e) => setConversationName(e.target.value)}
                    placeholder="Conversation Name"
                    className="conversation-name-input"
                />
                <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="department-select"
                >
                    <option value="" disabled>Select Department</option>
                    {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>
                <button
                    onClick={handleStartConversation}
                    className="start-button"
                    disabled={!conversationName || !department}
                >
                    Start Conversation
                </button>
            </div>
            ) :
                <><div className="chat-header">
                    <div className="user-id">
                        {conversationName}
                    </div>
                    {/* //should be given by backend */}
                    <div className="user-id">Username: {userName}</div>
                </div>

                    <div className="chatbox">
                        <div className="chat-messages" ref={chatContainerRef}>
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`message ${message.role === "user" ? "user" : "model"
                                        }`}
                                >
                                    <p>{message.parts[0].text}</p>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="message model">
                                    <p>Typing...</p>
                                </div>
                            )}
                        </div>
                        <form className="input-container" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                className="input-field"
                            />
                            <button type="submit" className="send-button">
                                Send
                            </button>
                        </form>

                        <div className="summary-actions">
                            <button onClick={generateSummary} className="summary-button">
                                Send Summary
                            </button>
                            {/* <button
            onClick={() => simulateReviewResponse(true)}
            className="accept-button"
          >
            Accept Summary
          </button>
          <button
            onClick={() => simulateReviewResponse(false)}
            className="reject-button"
          >
            Reject Summary
          </button> */}
                        </div>
                    </div></>}
        </div>
    </div>);
}

export default ChatInterface;