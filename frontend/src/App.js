import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import FileEncryption from './pages/fileEncryption';
import Header from './components/header';
import Footer from './components/footer';
import DigitalSignature from './pages/DigitalSignature';
import DocumentChecker from './pages/DocumentChecker';
import MessageInterface from './pages/MessageInterface';
import Home from './pages/home';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/file-encryption" element={<FileEncryption />} />
          <Route path="/digital-signature" element={<DigitalSignature />} />
          <Route path="/document-checker" element={<DocumentChecker />} />
          <Route path="/message-interface" element={<MessageInterface />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;