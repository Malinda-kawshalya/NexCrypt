import React, { useState, useEffect, useRef } from 'react';
import '../style/encryptedMessaging.css';

const MessageInterface = () => {
  // State for users
  const [users, setUsers] = useState([
    { id: 'user1', name: 'Alice', color: '#3498db' },
    { id: 'user2', name: 'Bob', color: '#2ecc71' }
  ]);
  
  // State for current user
  const [currentUser, setCurrentUser] = useState('user1');
  
  // State for messages
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  // State for keys
  const [keys, setKeys] = useState({
    user1: null,
    user2: null
  });
  
  // State for key visualization
  const [showKeys, setShowKeys] = useState(false);
  
  // Ref for messages container
  const messagesEndRef = useRef(null);

  // Generate RSA key pair for a user
  const generateKeys = async (userId) => {
    try {
      // Generate RSA key pair
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true, // whether the key is extractable
        ["encrypt", "decrypt"] // key usage
      );
      
      // Export public key
      const publicKey = await window.crypto.subtle.exportKey(
        "spki",
        keyPair.publicKey
      );
      
      // Export private key
      const privateKey = await window.crypto.subtle.exportKey(
        "pkcs8",
        keyPair.privateKey
      );
      
      // Convert ArrayBuffer to base64 string for storage/display
      const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKey)));
      const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKey)));
      
      // Store keys
      setKeys(prev => ({
        ...prev,
        [userId]: {
          publicKey: keyPair.publicKey,
          privateKey: keyPair.privateKey,
          publicKeyBase64,
          privateKeyBase64
        }
      }));
      
      return true;
    } catch (error) {
      console.error("Error generating keys:", error);
      return false;
    }
  };

  // Encrypt a message
  const encryptMessage = async (message, recipientId) => {
    try {
      if (!keys[recipientId] || !keys[recipientId].publicKey) {
        throw new Error("Recipient doesn't have a public key");
      }
      
      // Convert message to ArrayBuffer
      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      
      // Encrypt the message with recipient's public key
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP"
        },
        keys[recipientId].publicKey,
        data
      );
      
      // Convert ArrayBuffer to base64 string
      return btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
    } catch (error) {
      console.error("Error encrypting message:", error);
      throw error;
    }
  };

  // Decrypt a message
  const decryptMessage = async (encryptedMessage, userId) => {
    try {
      if (!keys[userId] || !keys[userId].privateKey) {
        throw new Error("You don't have a private key");
      }
      
      // Convert base64 to ArrayBuffer
      const encryptedData = new Uint8Array(
        atob(encryptedMessage)
          .split('')
          .map(char => char.charCodeAt(0))
      ).buffer;
      
      // Decrypt the message with user's private key
      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: "RSA-OAEP"
        },
        keys[userId].privateKey,
        encryptedData
      );
      
      // Convert ArrayBuffer to string
      const decoder = new TextDecoder();
      return decoder.decode(decryptedData);
    } catch (error) {
      console.error("Error decrypting message:", error);
      return "[Encrypted message - cannot decrypt]";
    }
  };

  // Send a message
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      const sender = currentUser;
      const recipient = currentUser === 'user1' ? 'user2' : 'user1';
      
      // Check if keys exist
      if (!keys[sender] || !keys[recipient]) {
        alert("Both users need key pairs to send encrypted messages.");
        return;
      }
      
      // Encrypt the message
      const encryptedContent = await encryptMessage(newMessage, recipient);
      
      const message = {
        id: Date.now(),
        sender,
        recipient,
        content: newMessage,
        encryptedContent,
        timestamp: new Date().toISOString(),
        sent: true,
        received: false
      };
      
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Simulate message delivery with a delay
      setTimeout(() => {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === message.id ? { ...msg, received: true } : msg
          )
        );
      }, 1000);
    } catch (error) {
      alert("Failed to send message: " + error.message);
    }
  };

  // Generate keys for both users on component mount
  useEffect(() => {
    const initializeKeys = async () => {
      await generateKeys('user1');
      await generateKeys('user2');
    };
    
    initializeKeys();
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get user by ID
  const getUser = (userId) => {
    return users.find(user => user.id === userId);
  };

  // Determine if a message can be decrypted by current user
  const canDecrypt = (message) => {
    return message.recipient === currentUser;
  };

  // Format a compact version of a key for display
  const formatKeyPreview = (keyBase64) => {
    if (!keyBase64) return 'Not available';
    return `${keyBase64.substring(0, 10)}...${keyBase64.substring(keyBase64.length - 10)}`;
  };

  return (
    <div className="encrypted-messaging-container">
      <div className="messaging-header">
        <h1>Encrypted Messaging Demo</h1>
        <p>Experience end-to-end encryption similar to WhatsApp</p>
      </div>
      
      {/* User selection */}
      <div className="user-selection">
        <p>You are currently:</p>
        <div className="user-buttons">
          {users.map(user => (
            <button
              key={user.id}
              className={`user-button ${currentUser === user.id ? 'active' : ''}`}
              style={{ 
                backgroundColor: currentUser === user.id ? user.color : 'transparent',
                borderColor: user.color
              }}
              onClick={() => setCurrentUser(user.id)}
            >
              {user.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Key management section */}
      <div className="key-management">
        <div className="key-header">
          <h3>Cryptographic Keys</h3>
          <button 
            className="toggle-keys-button" 
            onClick={() => setShowKeys(!showKeys)}
          >
            {showKeys ? 'Hide Keys' : 'Show Keys'}
          </button>
        </div>
        
        {showKeys && (
          <div className="keys-container">
            {users.map(user => (
              <div key={user.id} className="user-keys">
                <h4>{user.name}'s Keys:</h4>
                <div className="key-info">
                  <div className="key-row">
                    <span className="key-label">Public Key:</span>
                    <span className="key-value">
                      {keys[user.id] ? formatKeyPreview(keys[user.id].publicKeyBase64) : 'Generating...'}
                    </span>
                  </div>
                  <div className="key-row">
                    <span className="key-label">Private Key:</span>
                    <span className="key-value">
                      {keys[user.id] ? formatKeyPreview(keys[user.id].privateKeyBase64) : 'Generating...'}
                    </span>
                    {user.id === currentUser && (
                      <span className="key-note">
                        (you have access to this)
                      </span>
                    )}
                  </div>
                </div>
                {user.id !== currentUser && (
                  <div className="regenerate-key">
                    <button 
                      onClick={() => generateKeys(user.id)}
                      disabled={!keys[user.id]}
                    >
                      Regenerate Keys
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            <div className="encryption-explanation">
              <h4>How End-to-End Encryption Works:</h4>
              <ol>
                <li>Each user has a public key and a private key</li>
                <li>Messages are encrypted with the recipient's public key</li>
                <li>Only the recipient's private key can decrypt the message</li>
                <li>Even if messages are intercepted, they cannot be read without the private key</li>
              </ol>
            </div>
          </div>
        )}
      </div>
      
      {/* Chat window */}
      <div className="chat-window">
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="no-messages">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isCurrentUserSender = message.sender === currentUser;
              const messageUser = getUser(message.sender);
              
              return (
                <div 
                  key={message.id} 
                  className={`message-bubble ${isCurrentUserSender ? 'sent' : 'received'}`}
                  style={{ backgroundColor: isCurrentUserSender ? messageUser.color : '#f0f0f0' }}
                >
                  <div className="message-content">
                    {message.content}
                  </div>
                  
                  <div className="message-metadata">
                    <span className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                    {message.received && (
                      <span className="message-status">✓</span>
                    )}
                  </div>
                  
                  <div className="encrypted-data">
                    <div className="encrypted-label">Encrypted data:</div>
                    <div className="encrypted-content">
                      {message.encryptedContent.substring(0, 20)}...
                    </div>
                  </div>
                  
                  {!isCurrentUserSender && canDecrypt(message) && (
                    <div className="decryption-note">
                      Decrypted with {getUser(currentUser).name}'s private key
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form className="message-input-form" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type an encrypted message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!keys[currentUser] || !keys[currentUser === 'user1' ? 'user2' : 'user1']}
          />
          <button 
            type="submit"
            disabled={!newMessage.trim() || !keys[currentUser] || !keys[currentUser === 'user1' ? 'user2' : 'user1']}
          >
            Send Encrypted
          </button>
        </form>
      </div>
      
      <div className="encryption-flow">
        <h3>Live Encryption Flow</h3>
        <div className="flow-diagram">
          <div className="user-node">
            <div className="user-avatar" style={{ backgroundColor: getUser('user1').color }}>A</div>
            <div className="user-label">Alice</div>
            <div className="key-pair">
              <div className="key-icon">🔑</div>
              <div className="key-text">Public Key</div>
            </div>
            <div className="key-pair">
              <div className="key-icon">🗝️</div>
              <div className="key-text">Private Key</div>
            </div>
          </div>
          
          <div className="flow-arrows">
            <div className="arrow encrypted">
              <div className="arrow-line"></div>
              <div className="arrow-label">Encrypted with recipient's public key</div>
            </div>
            <div className="arrow decrypted">
              <div className="arrow-line"></div>
              <div className="arrow-label">Decrypted with recipient's private key</div>
            </div>
          </div>
          
          <div className="user-node">
            <div className="user-avatar" style={{ backgroundColor: getUser('user2').color }}>B</div>
            <div className="user-label">Bob</div>
            <div className="key-pair">
              <div className="key-icon">🔑</div>
              <div className="key-text">Public Key</div>
            </div>
            <div className="key-pair">
              <div className="key-icon">🗝️</div>
              <div className="key-text">Private Key</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="security-features">
        <h3>Security Features</h3>
        <ul>
          <li>
            <strong>RSA-2048 Encryption</strong>
            <span>Industry-standard asymmetric encryption algorithm</span>
          </li>
          <li>
            <strong>End-to-End Encryption</strong>
            <span>Only the intended recipient can decrypt messages</span>
          </li>
          <li>
            <strong>No Server Storage</strong>
            <span>Messages exist only on the sender and receiver devices</span>
          </li>
          <li>
            <strong>Zero-Knowledge Architecture</strong>
            <span>The server never has access to unencrypted message content</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MessageInterface;