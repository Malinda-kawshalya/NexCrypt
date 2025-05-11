import React, { useState, useEffect } from 'react';
import '../style/documentIntegrity.css';

const DocumentChecker = () => {
  const [files, setFiles] = useState([]);
  const [hashChain, setHashChain] = useState([]);
  const [loading, setLoading] = useState(false);

  // Generate SHA-256 hash
  const generateHash = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target.result;
          const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          resolve(hashHex);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = error => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  // Handle file upload and hash generation
  const handleFileUpload = async (e) => {
    const uploadedFiles = Array.from(e.target.files);
    if (uploadedFiles.length === 0) return;
    
    setLoading(true);
    
    try {
      const newFiles = [];
      const newHashChain = [...hashChain];
      
      for (const file of uploadedFiles) {
        const fileHash = await generateHash(file);
        const timestamp = new Date().toISOString();
        
        // Link to previous hash if it exists (blockchain style)
        const previousHash = newHashChain.length > 0 ? newHashChain[newHashChain.length - 1].hash : '0'.repeat(64);
        const chainedHash = await generateChainedHash(fileHash, previousHash);
        
        const fileEntry = {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: new Date(file.lastModified).toLocaleString(),
          hash: fileHash,
          chainedHash: chainedHash,
          timestamp: timestamp
        };
        
        newFiles.push(fileEntry);
        newHashChain.push({
          fileId: newHashChain.length,
          fileName: file.name,
          hash: chainedHash,
          previousHash: previousHash,
          timestamp: timestamp
        });
      }
      
      setFiles([...files, ...newFiles]);
      setHashChain(newHashChain);
    } catch (error) {
      console.error("Error processing files:", error);
      alert("Error processing files. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate chained hash (combining file hash with previous hash)
  const generateChainedHash = async (fileHash, previousHash) => {
    const combinedString = previousHash + fileHash;
    const encoder = new TextEncoder();
    const data = encoder.encode(combinedString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Verify the integrity of the hash chain
  const verifyHashChain = async () => {
    if (hashChain.length <= 1) {
      alert("Need at least two documents to verify chain integrity.");
      return;
    }
    
    setLoading(true);
    
    try {
      let isValid = true;
      let invalidIndex = -1;
      
      for (let i = 1; i < hashChain.length; i++) {
        const currentBlock = hashChain[i];
        const previousBlock = hashChain[i - 1];
        
        const calculatedHash = await generateChainedHash(files[i].hash, previousBlock.hash);
        
        if (calculatedHash !== currentBlock.chainedHash) {
          isValid = false;
          invalidIndex = i;
          break;
        }
      }
      
      if (isValid) {
        alert("Document chain integrity verified! All hashes match.");
      } else {
        alert(`Chain integrity broken at document ${invalidIndex + 1} (${hashChain[invalidIndex].fileName})`);
      }
    } catch (error) {
      console.error("Error verifying chain:", error);
      alert("Error verifying document chain.");
    } finally {
      setLoading(false);
    }
  };

  // Clear all files and hash chain
  const clearAll = () => {
    setFiles([]);
    setHashChain([]);
  };

  // Simulate tampering with a document for demonstration
  const simulateTampering = (index) => {
    if (index >= 0 && index < files.length) {
      const newFiles = [...files];
      const newHashChain = [...hashChain];
      
      // Modify the hash to simulate tampering
      newFiles[index] = {
        ...newFiles[index],
        hash: newFiles[index].hash.replace(/^.{4}/, '1234')
      };
      
      setFiles(newFiles);
      alert(`Simulated tampering with document: ${newFiles[index].name}`);
    }
  };

  return (
    <div className="document-integrity-container">
      <div className="title-section">
        <h1>Document Integrity Checker</h1>
        <p>Upload documents to generate and chain cryptographic hashes, similar to blockchain technology.</p>
      </div>
      
      <div className="upload-section">
        <input 
          type="file" 
          multiple 
          onChange={handleFileUpload} 
          id="file-upload"
          className="file-input"
        />
        <label htmlFor="file-upload" className="file-upload-label">
          {loading ? 'Processing...' : 'Choose Files to Hash'}
        </label>
        
        <div className="action-buttons">
          <button onClick={verifyHashChain} disabled={hashChain.length < 2 || loading}>
            Verify Chain Integrity
          </button>
          <button onClick={clearAll} disabled={hashChain.length === 0 || loading}>
            Clear All
          </button>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="files-section">
          <h2>Document Hash Chain</h2>
          <div className="table-container">
            <table className="hash-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Document Name</th>
                  <th>Size</th>
                  <th>Last Modified</th>
                  <th>Document Hash (SHA-256)</th>
                  <th>Chained Hash</th>
                  <th>Timestamp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{file.name}</td>
                    <td>{(file.size / 1024).toFixed(2)} KB</td>
                    <td>{file.lastModified}</td>
                    <td className="hash-cell">
                      <div className="hash-value">{file.hash}</div>
                    </td>
                    <td className="hash-cell">
                      <div className="hash-value">{hashChain[index]?.chainedHash || file.chainedHash}</div>
                    </td>
                    <td>{new Date(file.timestamp).toLocaleString()}</td>
                    <td>
                      <button 
                        className="tamper-button" 
                        onClick={() => simulateTampering(index)}
                      >
                        Simulate Tampering
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {hashChain.length > 0 && (
            <div className="blockchain-visualization">
              <h3>Blockchain-style Visualization</h3>
              <div className="blockchain">
                {hashChain.map((block, index) => (
                  <div key={index} className="block">
                    <div className="block-header">Block #{index}</div>
                    <div className="block-content">
                      <div><strong>File:</strong> {block.fileName}</div>
                      <div className="hash-display">
                        <strong>Hash:</strong> 
                        <span>{block.hash.substring(0, 10)}...</span>
                      </div>
                      {index > 0 && (
                        <div className="previous-hash">
                          <strong>Previous:</strong> 
                          <span>{block.previousHash.substring(0, 10)}...</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="explanation-section">
        <h3>How It Works</h3>
        <ol>
          <li>Upload a document to generate its unique SHA-256 hash</li>
          <li>Upload another document, and its hash will be linked to the previous one</li>
          <li>This creates a chain of hashes, similar to blockchain technology</li>
          <li>If any document is modified, its hash will change</li>
          <li>This breaks the chain integrity, revealing document tampering</li>
          <li>Use "Simulate Tampering" to see this in action</li>
        </ol>
      </div>
    </div>
  );
};

export default DocumentChecker;