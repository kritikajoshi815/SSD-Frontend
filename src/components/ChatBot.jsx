import React, { useState } from "react";
import "../css/chatbot.css";

const ChatBot = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [conversationName, setConversationName] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!userInput.trim()) return; // Prevent empty messages

    const newMessage = { sender: "user", text: userInput };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setUserInput("");

    // Simulating bot response
    const botReply = await getBotResponse(userInput);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "bot", text: botReply },
    ]);
  };

  // Simulate bot's response based on user input
  const getBotResponse = async (input) => {
    const response = "I'm a simple bot! You said: " + input;
    return new Promise((resolve) => {
      setTimeout(() => resolve(response), 500); // Simulate a delay
    });
  };
  const newConvo = () => {
    setConversationName("");
    setMessages([]);
  };
  const saveConversation = () => {
    if (conversationName.trim()) {
      const newConversation = {
        name: conversationName,
        messages,
        status: "Not Sent", // Initialize with 'Not Sent' status
        summary: "", // To hold the conversation summary
      };

      setConversations((prevConversations) => [
        ...prevConversations,
        newConversation,
      ]);
      // setConversationName("");
      // setMessages([]); // Start a fresh conversation
    }
  };

  const loadConversation = (index) => {
    const conversation = conversations[index];
    setSelectedConversation(index);
    setMessages(conversation.messages);
    setConversationName(conversation.name);
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

  return (
    <div className="chatbot-app">
      {/* Side Panel for Conversations */}
      <div className="side-panel">
        <h3>Conversations</h3>
        <button onClick={newConvo} className="save-button">
          New Conversation
        </button>
        <ul className="conversation-list">
          {conversations.map((conversation, index) => (
            <li
              key={index}
              className={`conversation-item ${
                selectedConversation === index ? "active" : ""
              }`}
              onClick={() => loadConversation(index)}
            >
              {conversation.name} - {conversation.status}
            </li>
          ))}
        </ul>

        <button onClick={saveConversation} className="save-button">
          Save Conversation
        </button>
      </div>

      {/* Chat Box */}
      <div className="chatbox-container">
        <div className="chat-header">
          <div className="conversation-name">
            <input
              type="text"
              value={conversationName}
              onChange={(e) => setConversationName(e.target.value)}
              placeholder="Conversation Name"
              className="conversation-name-input"
            />
          </div>
          {/* //should be given by backend */}
          <div className="user-id">User ID: User123</div>
        </div>

        <div className="chatbox">
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.sender === "user" ? "user" : "bot"
                }`}
              >
                <p>{message.text}</p>
              </div>
            ))}
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
              Generate & Send Summary
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
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
