import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import FileEncryption from './pages/fileEncryption';
import Header from './components/header';
import Footer from './components/footer';
import DigitalSignature from './pages/DigitalSignature';
function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        
        <Routes>
          <Route path="/" element={<FileEncryption />} />
          <Route path="/file-encryption" element={<FileEncryption />} />
          <Route path="/digital-signature" element={<DigitalSignature />} />
          {/* 
          <Route path="/digital-signature" element={<DigitalSignature />} />
          <Route path="/secure-notes" element={<SecureNotes />} />
          <Route path="/integrity-checker" element={<IntegrityChecker />} />
          <Route path="/encrypted-messaging" element={<EncryptedMessaging />} />
          */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;