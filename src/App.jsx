import React from 'react';
import { useRef, useState, useEffect } from 'react';
import logo from './assets/invoice-logo.svg';
import srkLogo from './assets/srikrg-logo.svg';
import './App.css';

function App() {
  const [mode, setMode] = useState('edit');
  const [invoice, setInvoice] = useState({
    // Invoice metadata
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    
    // Vendor information
    vendorName: '',
    vendorEmail: '',
    vendorPhone: '',
    vendorAddress: '',
    vendorCity: '',
    vendorState: '',
    vendorZip: '',
    vendorCountry: '',
    vendorPAN: '',
    
    // Customer information
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    customerCity: '',
    customerState: '',
    customerZip: '',
    customerCountry: '',
    
    // Payment information
    accountDetails: '',
    
    // Invoice items
    items: [
      { description: '', quantity: 1, rate: 0, amount: 0 }
    ]
  });

  const printRef = useRef();

  // Helper: format numbers in Indian grouping.
  // Default behavior: no decimals (rounded to nearest rupee). Pass withDecimals=true to keep two decimals.
  const formatIndianNumber = (num, withDecimals = false) => {
    if (num === null || num === undefined) return withDecimals ? '0.00' : '0';
    const n = Number(num);
    if (isNaN(n)) return withDecimals ? '0.00' : '0';

    const value = withDecimals ? n.toFixed(2) : String(Math.round(n));
    if (withDecimals) {
      const parts = value.split('.');
      let intPart = parts[0];
      const decPart = parts[1];
      if (intPart.length > 3) {
        const last3 = intPart.slice(-3);
        let rest = intPart.slice(0, -3);
        rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
        intPart = rest + ',' + last3;
      }
      return intPart + '.' + decPart;
    } else {
      let intPart = value;
      if (intPart.length > 3) {
        const last3 = intPart.slice(-3);
        let rest = intPart.slice(0, -3);
        rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
        intPart = rest + ',' + last3;
      }
      return intPart;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoice.items];
    newItems[index][field] = value;
    
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    
    setInvoice(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const calculateTotal = () => {
    return invoice.items.reduce((total, item) => total + item.amount, 0);
  };

  const handlePrint = () => {
    window.print();
  };

  const switchToView = () => {
    setMode('view');
  };

  const switchToPrint = () => {
    // Directly open print dialog from view mode
    handlePrint();
  };

  const goBack = () => {
    // Always go back to edit when user presses back from view
    setMode('edit');
  };

  return (
    <div className="app-container">
      <div className="invoice-container" ref={printRef}>
        {/* Inline SVG background so gradients/colors print as document content */}
        <svg className="invoice-bg" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5f7fa" />
              <stop offset="100%" stopColor="#c3cfe2" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#bgGradient)" />
        </svg>
        {/* Watermark */}
        <div className="watermark">
            <svg width="180" height="180" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
              <defs>
                <linearGradient id="wmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e9eef6" />
                  <stop offset="100%" stopColor="#d9e6f2" />
                </linearGradient>
              </defs>
              {/* outer circle */}
              <circle cx="100" cy="100" r="78" stroke="#000" strokeWidth="2" fill="none" opacity="0.08" />

              {/* clock tick marks (12/3/6/9) */}
              <text x="100" y="44" fontSize="16" fill="#000" textAnchor="middle" opacity="0.12">12</text>
              <text x="156" y="104" fontSize="16" fill="#000" textAnchor="middle" opacity="0.12">3</text>
              <text x="100" y="168" fontSize="16" fill="#000" textAnchor="middle" opacity="0.12">6</text>
              <text x="44" y="104" fontSize="16" fill="#000" textAnchor="middle" opacity="0.12">9</text>

              {/* clock hands */}
              <line x1="100" y1="100" x2="100" y2="64" stroke="#000" strokeWidth="3" strokeLinecap="round" opacity="0.14" />
              <line x1="100" y1="100" x2="130" y2="100" stroke="#000" strokeWidth="2" strokeLinecap="round" opacity="0.12" />
              <circle cx="100" cy="100" r="3" fill="#000" opacity="0.16" />

              {/* SriKRG text centered */}
              <text x="100" y="122" fontSize="20" fill="#000" textAnchor="middle" opacity="0.12" fontWeight="700" fontFamily="Segoe UI, Arial, sans-serif">SriKRG</text>
            </svg>
        </div>
        
        <div className="invoice-header">
          <div className="company-info">
            <img src={srkLogo} alt="SriKRG logo" className="company-logo-img" />
          </div>
          <div className="invoice-meta">
            <div className="invoice-number">
              Invoice No.: {mode === 'edit' ? <input name="invoiceNumber" value={invoice.invoiceNumber} onChange={handleChange} placeholder="Invoice Number" /> : (invoice.invoiceNumber || 'Invoice Number')}
            </div>
            <div className="invoice-date">
              Date: {mode === 'edit' ? <input type="date" name="date" value={invoice.date} onChange={handleChange} /> : (invoice.date || new Date().toISOString().split('T')[0])}
            </div>
          </div>
        </div>

        <div className="bill-sections">
          <div className="bill-from">
            <h3>Bill from</h3>
            {mode === 'edit' ? (
              <div className="vendor-grid">
                <input name="vendorName" value={invoice.vendorName} onChange={handleChange} placeholder="Company Name" />
                <input name="vendorEmail" value={invoice.vendorEmail} onChange={handleChange} placeholder="Email" />
                <input name="vendorPhone" value={invoice.vendorPhone} onChange={handleChange} placeholder="Phone" />
                <input name="vendorPAN" value={invoice.vendorPAN} onChange={handleChange} placeholder="PAN Number" />
                <input name="vendorAddress" value={invoice.vendorAddress} onChange={handleChange} placeholder="Address" />
                <input name="vendorCity" value={invoice.vendorCity} onChange={handleChange} placeholder="City" />
                <input name="vendorState" value={invoice.vendorState} onChange={handleChange} placeholder="State" />
                <input name="vendorZip" value={invoice.vendorZip} onChange={handleChange} placeholder="ZIP Code" />
                <input name="vendorCountry" value={invoice.vendorCountry} onChange={handleChange} placeholder="Country" />
              </div>
            ) : (
              <div className="vendor-display">
                <p><strong>{invoice.vendorName || 'Company Name'}</strong></p>
                <p>{invoice.vendorEmail || 'Email'}</p>
                <p>{invoice.vendorPhone || 'Phone'}</p>
                <p>PAN: {invoice.vendorPAN || 'PAN Number'}</p>
                <p>{invoice.vendorAddress || 'Address'}</p>
                <p>{invoice.vendorCity || 'City'}, {invoice.vendorState || 'State'} {invoice.vendorZip || 'ZIP'}</p>
                <p>{invoice.vendorCountry || 'Country'}</p>
              </div>
            )}
          </div>

          <div className="bill-to">
            <h3>Bill to</h3>
            {mode === 'edit' ? (
              <div className="customer-grid">
                <input name="customerName" value={invoice.customerName} onChange={handleChange} placeholder="Customer Name" />
                <input name="customerEmail" value={invoice.customerEmail} onChange={handleChange} placeholder="Email (optional)" />
                <input name="customerPhone" value={invoice.customerPhone} onChange={handleChange} placeholder="Phone (optional)" />
                
                <input name="customerAddress" value={invoice.customerAddress} onChange={handleChange} placeholder="Address" />
                <input name="customerCity" value={invoice.customerCity} onChange={handleChange} placeholder="City" />
                <input name="customerState" value={invoice.customerState} onChange={handleChange} placeholder="State" />
                <input name="customerZip" value={invoice.customerZip} onChange={handleChange} placeholder="ZIP Code" />
                <input name="customerCountry" value={invoice.customerCountry} onChange={handleChange} placeholder="Country" />
              </div>
            ) : (
              <div className="customer-display">
                <p><strong>{invoice.customerName || 'Customer Name'}</strong></p>
                {invoice.customerEmail ? <p>{invoice.customerEmail}</p> : null}
                {invoice.customerPhone ? <p>{invoice.customerPhone}</p> : null}
                <p>{invoice.customerAddress || 'Address'}</p>
                <p>{invoice.customerCity || 'City'}, {invoice.customerState || 'State'} {invoice.customerZip || 'ZIP'}</p>
                <p>{invoice.customerCountry || 'Country'}</p>
              </div>
            )}
          </div>
        </div>

        <div className="services-table">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td className="description-cell">
                    {mode === 'edit' ? (
                      <textarea 
                        value={item.description} 
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Service/Product description"
                      />
                    ) : (
                      <div style={{ whiteSpace: 'pre-line', minHeight: '60px' }}>{invoice.items[0].description || 'Service/Product description'}</div>
                    )}
                  </td>
                  <td>
                    {mode === 'edit' ? (
                      <input 
                        type="number" 
                        value={invoice.items[0].quantity} 
                        onChange={(e) => handleItemChange(0, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    ) : (invoice.items[0].quantity || 1)}
                  </td>
                  <td>
                    {mode === 'edit' ? (
                      <input 
                        type="number" 
                        step="0.01"
                        value={invoice.items[0].rate} 
                        onChange={(e) => handleItemChange(0, 'rate', parseFloat(e.target.value) || 0)}
                      />
                    ) : `₹${formatIndianNumber(invoice.items[0].rate || 0)}`}
                  </td>
                  <td>₹{formatIndianNumber(invoice.items[0].amount || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="totals-section">
          <div className="totals">
            <div className="total-row total-final">
              <span>Total:</span>
              <span>₹{formatIndianNumber(calculateTotal())}</span>
            </div>
          </div>
        </div>

        <div className="payment-section">
          <div className="left-bottom-section">
            <div className="account-details">
              <label>Bank Details:</label>
              {mode === 'edit' ? (
                <textarea 
                  name="accountDetails" 
                  value={invoice.accountDetails} 
                  onChange={handleChange}
                  placeholder="Bank account details, routing numbers, etc."
                />
              ) : (
                <div style={{ whiteSpace: 'pre-line', minHeight: '80px' }}>
                  {invoice.accountDetails || 'Bank account details, routing numbers, etc.'}
                </div>
              )}
            </div>
          </div>
          
          <div className="signature-section">
            <p className="signature-text">Authorized Signature</p>
          </div>
        </div>

        {/* Mode-specific Navigation */}
        <div className="mode-controls">
          {mode === 'edit' && (
            <button 
              onClick={switchToView}
              className="view-btn"
            >
              View Invoice
            </button>
          )}

          {mode === 'view' && (
            <div className="view-controls">
              <button 
                onClick={goBack}
                className="back-btn"
              >
                ← Back to Edit
              </button>
              <button 
                onClick={handlePrint}
                className="print-btn"
              >
                🖨️ Print Invoice
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
