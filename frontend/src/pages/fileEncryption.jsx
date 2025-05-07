import React, { useState } from 'react';
import { Upload, Lock, Unlock, Key, FileOutput, Loader } from 'lucide-react';
import '../style/fileEncryption.css';

const FileEncryption = () => {
  const [activeTab, setActiveTab] = useState('encrypt');
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [encryptionMethod, setEncryptionMethod] = useState('aes');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate processing delay (in a real app, this would be actual encryption/decryption)
      await new Promise(resolve => setTimeout(resolve, 1500));

      setResult({
        success: true,
        action: activeTab === 'encrypt' ? 'encrypted' : 'decrypted',
        fileName: file ? file.name : 'sample.txt',
        downloadUrl: '#'
      });
    } catch (error) {
      setResult({
        success: false,
        message: error.message || 'An unexpected error occurred'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderEncryptionMethodInputs = () => {
    if (encryptionMethod === 'aes') {
      return (
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <Lock size={16} />
            <input
              type="password"
              id="password"
              placeholder="Enter a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="input-group">
          <label htmlFor="pubkey">
            {activeTab === 'encrypt' ? 'Public Key' : 'Private Key'}
          </label>
          <div className="key-textarea">
            <Key size={16} />
            <textarea
              id="pubkey"
              placeholder={activeTab === 'encrypt' 
                ? "Paste recipient's public RSA key" 
                : "Paste your private RSA key"}
              value={activeTab === 'encrypt' ? publicKey : privateKey}
              onChange={(e) => activeTab === 'encrypt' 
                ? setPublicKey(e.target.value) 
                : setPrivateKey(e.target.value)}
              required
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="file-encryption-container">
      <div className="tabs">
        <button
          className={activeTab === 'encrypt' ? 'active' : ''}
          onClick={() => {
            setActiveTab('encrypt');
            setResult(null);
          }}
        >
          <Lock size={16} /> Encrypt
        </button>
        <button
          className={activeTab === 'decrypt' ? 'active' : ''}
          onClick={() => {
            setActiveTab('decrypt');
            setResult(null);
          }}
        >
          <Unlock size={16} /> Decrypt
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="file">Select File</label>
          <div className="file-input">
            <Upload size={16} />
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              required
            />
            {file && <span className="file-name">{file.name}</span>}
          </div>
        </div>

        <div className="input-group">
          <label>Encryption Method</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="encryptionMethod"
                value="aes"
                checked={encryptionMethod === 'aes'}
                onChange={() => setEncryptionMethod('aes')}
              />
              AES (Password)
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="encryptionMethod"
                value="rsa"
                checked={encryptionMethod === 'rsa'}
                onChange={() => setEncryptionMethod('rsa')}
              />
              RSA (Public/Private Key)
            </label>
          </div>
        </div>

        {renderEncryptionMethodInputs()}

        <button 
          type="submit" 
          className="submit-button"
          disabled={isProcessing || !file}
        >
          {isProcessing ? (
            <>
              <Loader size={16} className="spinning" /> Processing...
            </>
          ) : (
            <>
              {activeTab === 'encrypt' ? <Lock size={16} /> : <Unlock size={16} />}
              {activeTab === 'encrypt' ? 'Encrypt File' : 'Decrypt File'}
            </>
          )}
        </button>
      </form>

      {result && (
        <div className={`result-box ${result.success ? 'success' : 'error'}`}>
          {result.success ? (
            <>
              <h3>File {result.action} successfully!</h3>
              <p>Filename: {result.fileName}</p>
              <a href={result.downloadUrl} className="download-button">
                <FileOutput size={16} /> Download {result.action} file
              </a>
            </>
          ) : (
            <>
              <h3>Error</h3>
              <p>{result.message}</p>
            </>
          )}
        </div>
      )}

      <div className="info-box">
        <h4>How It Works:</h4>
        <ul>
          <li>
            <strong>AES Encryption:</strong> Your file is encrypted with a password using AES-256 algorithm.
          </li>
          <li>
            <strong>RSA Encryption:</strong> Uses asymmetric cryptography with public and private keys.
          </li>
          <li>
            All encryption/decryption happens in your browser - files are never sent to a server.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FileEncryption;