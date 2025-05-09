import React, { useState } from 'react';
import { PenTool, Upload, CheckCircle, XCircle, Key, Download, Loader, FileOutput } from 'lucide-react';
import '../style/DigitalSignature.css';

const DigitalSignature = () => {
  const [activeTab, setActiveTab] = useState('sign');
  const [keysGenerated, setKeysGenerated] = useState(false);
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [signature, setSignature] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [contentType, setContentType] = useState('text');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerateKeys = async () => {
    setIsProcessing(true);

    try {
      // Simulate key generation delay (in a real app, this would be actual RSA key generation)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Dummy public and private keys (in a real app, these would be actual RSA keys)
      setPublicKey(`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz7R6Fz8AsgHuQA6hNr1l
UTG3j3NOtwt90IxuyfgyK2jxQsTFKJcP/3fGcBdFUu6XFbLTUBFDzZrPTwzVnT9D
7NpVBzFnB52g0JQ6zHW7Jglo3vRs/jAciPRKlcq/RUg+tOUz1EM9CdzyHAvPPc7X
M4F+UWFimC7dCE5i34jLsXSRGKVcH9nLQeWrBJyCmN5T8bWQycgcy7dJybmt1Rn8
KwNqOE2pHgqmvFTmwncMz4v5jdW1eSRmO7X1F+aHVxnVwC9F+FCiJ+3yFxQKCWnx
JCFxD+FZT1hyZrT0ApJJzArlpBGMg/NUTVIwIizj6B/0odceCIZBZqW+zHg4fCnx
JQIDAQAB
-----END PUBLIC KEY-----`);
      
      setPrivateKey(`-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDPtHoXPwCyAe5A
DqE2vWVRMbePc063C33QjG7J+DIraPFCxMUolw//d8ZwF0VS7pcVstNQEUPNms9P
DNP0Ps2lUHMWcHnaDQlDrMdbsmCWje9Gz+MByI9EqVyr9FSD605TPUQz0J3PIcC8
89ztczgX5RYWKYLt0ITmLfiMuxdJEYpVwf2ctB5asEnIKY3lPxtZDJyBzLt0nJua
3VGfwrA2o4TakeKma8VObCdwzPi/mN1bV5JGY7tfUX5odXGdXAL0X4UKIn7fIXFA
oJafEkIXEP4VlPWHJmtPQCkknMCuWkEYyD81RNUjAiLOPoH/Sh15wIRgEGmpb7Me
Dh8KfElAgMBAAECggEAK3nzTcAK40rnCgXiQJCUFjToi9HKO3aFQYSif1P9RhzlR7
-----END PRIVATE KEY-----`);
      
      setKeysGenerated(true);
      setResult({
        success: true,
        action: 'generated',
        message: 'RSA key pair generated successfully!'
      });
    } catch (error) {
      setResult({
        success: false,
        message: error.message || 'Failed to generate keys'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setContentType('file');
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (e.target.value) {
      setContentType('text');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate signing/verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (activeTab === 'sign') {
        // In a real app, this would be actual signing using private key
        const fakeSignature = 'AbCdEfG123456789+/=XyZaBcDeF';
        setSignature(fakeSignature);
        
        setResult({
          success: true,
          action: 'signed',
          message: 'Content signed successfully!',
          signature: fakeSignature
        });
      } else {
        // In a real app, this would be actual verification using public key
        const isValid = Math.random() > 0.2; // Simulate 80% success rate
        
        setResult({
          success: isValid,
          action: 'verified',
          message: isValid 
            ? 'Signature is valid! Document integrity confirmed.' 
            : 'Invalid signature. Document may have been tampered with.'
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error.message || 'An unexpected error occurred'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    alert(`${type} copied to clipboard!`);
  };

  const handleDownloadKey = (key, type) => {
    const element = document.createElement('a');
    const file = new Blob([key], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${type.toLowerCase()}-key.pem`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="digital-signature-container">
      <div className="tabs">
        <button
          className={activeTab === 'sign' ? 'active' : ''}
          onClick={() => {
            setActiveTab('sign');
            setResult(null);
          }}
        >
          <PenTool size={16} /> Sign Document
        </button>
        <button
          className={activeTab === 'verify' ? 'active' : ''}
          onClick={() => {
            setActiveTab('verify');
            setResult(null);
          }}
        >
          <CheckCircle size={16} /> Verify Signature
        </button>
      </div>

      <div className="key-management">
        <h3>Key Management</h3>
        {!keysGenerated ? (
          <button 
            className="generate-keys-button" 
            onClick={handleGenerateKeys}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader size={16} className="spinning" /> Generating Keys...
              </>
            ) : (
              <>
                <Key size={16} /> Generate RSA Key Pair
              </>
            )}
          </button>
        ) : (
          <div className="keys-container">
            <div className="key-box">
              <h4>Public Key</h4>
              <div className="key-content">
                <textarea 
                  value={publicKey} 
                  readOnly 
                />
              </div>
              <div className="key-actions">
                <button onClick={() => handleCopy(publicKey, 'Public Key')}>
                  Copy
                </button>
                <button onClick={() => handleDownloadKey(publicKey, 'Public')}>
                  <Download size={14} /> Download 
                </button>
              </div>
            </div>
            
            <div className="key-box">
              <h4>Private Key</h4>
              <div className="key-content">
                <textarea 
                  value={privateKey} 
                  readOnly 
                />
              </div>
              <div className="key-actions">
                <button onClick={() => handleCopy(privateKey, 'Private Key')}>
                  Copy
                </button>
                <button onClick={() => handleDownloadKey(privateKey, 'Private')}>
                  <Download size={14} /> Download
                </button>
              </div>
              <div className="key-warning">
                <strong>Warning:</strong> Keep your private key secure! Never share it with others.
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="content-input">
          <h3>{activeTab === 'sign' ? 'Content to Sign' : 'Content to Verify'}</h3>
          
          <div className="input-tabs">
            <button 
              type="button"
              className={contentType === 'text' ? 'active' : ''}
              onClick={() => setContentType('text')}
            >
              Text
            </button>
            <button 
              type="button"
              className={contentType === 'file' ? 'active' : ''}
              onClick={() => setContentType('file')}
            >
              File
            </button>
          </div>

          {contentType === 'text' ? (
            <textarea
              placeholder={activeTab === 'sign' 
                ? "Enter the text you want to sign..." 
                : "Enter the text you want to verify..."}
              value={text}
              onChange={handleTextChange}
              required={contentType === 'text'}
            />
          ) : (
            <div className="file-input">
              <Upload size={16} />
              <input
                type="file"
                id="doc-file"
                onChange={handleFileChange}
                required={contentType === 'file'}
              />
              <label htmlFor="doc-file">Choose File</label>
              {file && <span className="file-name">{file.name}</span>}
            </div>
          )}
        </div>

        {activeTab === 'verify' && (
          <div className="signature-input">
            <h3>Signature to Verify</h3>
            <textarea
              placeholder="Paste the signature here..."
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              required
            />
          </div>
        )}

        <button 
          type="submit" 
          className="submit-button"
          disabled={isProcessing || (!text && !file) || (activeTab === 'sign' && !keysGenerated) || (activeTab === 'verify' && !signature)}
        >
          {isProcessing ? (
            <>
              <Loader size={16} className="spinning" /> Processing...
            </>
          ) : (
            <>
              {activeTab === 'sign' ? <PenTool size={16} /> : <CheckCircle size={16} />}
              {activeTab === 'sign' ? 'Sign' : 'Verify'}
            </>
          )}
        </button>
      </form>

      {result && (
        <div className={`result-box ${result.success ? 'success' : 'error'}`}>
          <h3>{result.success ? (
            result.action === 'generated' ? (
              <>
                <CheckCircle size={20} /> Keys Generated Successfully
              </>
            ) : result.action === 'signed' ? (
              <>
                <CheckCircle size={20} /> Signed Successfully
              </>
            ) : (
              <>
                <CheckCircle size={20} /> Verification Complete
              </>
            )
          ) : (
            <>
              <XCircle size={20} /> Error
            </>
          )}
          </h3>
          
          <p>{result.message}</p>
          
          {result.action === 'signed' && result.signature && (
            <div className="signature-result">
              <h4>Generated Signature:</h4>
              <div className="signature-container">
                <code>{result.signature}</code>
                <button onClick={() => handleCopy(result.signature, 'Signature')}>
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="info-box">
        <h4>How Digital Signatures Work:</h4>
        <ul>
          <li>
            <strong>Signing:</strong> The signer uses their private key to create a unique signature for a document.
          </li>
          <li>
            <strong>Verification:</strong> Anyone with the signer's public key can verify the signature's authenticity.
          </li>
          <li>
            <strong>Security:</strong> If the document is altered after signing, the verification will fail.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DigitalSignature;