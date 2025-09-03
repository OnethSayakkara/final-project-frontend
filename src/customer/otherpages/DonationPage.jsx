import React, { useState, useEffect } from 'react';
import { MapPin, Info, Share, ReceiptText } from 'lucide-react';
import { RiBankCardFill } from "react-icons/ri";
import { useParams } from 'react-router-dom';
import Header from '../../common/Header';
import { FaFilePdf } from "react-icons/fa";
import { IoMdImages } from "react-icons/io";

const DonationPage = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [donateAnonymously, setDonateAnonymously] = useState(false);
  const [event, setEvent] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/event/geteventbyid/${id}`);
        if (!response.ok) throw new Error('Failed to fetch event details');
        const data = await response.json();
        console.log('Fetched event data:', data);
        if (!data.documents || !Array.isArray(data.documents)) {
          console.warn('Documents field is missing or invalid:', data.documents);
        }
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setEvent(null);
      }
    };
    if (id) fetchEventDetails();
  }, [id]);

  const donationAmounts = [
    { label: 'LKR 100.00', value: 100 },
    { label: 'LKR 200.00', value: 200 },
    { label: 'LKR 500.00', value: 500 },
    { label: 'LKR 1,000.00', value: 1000 }
  ];

  const paymentMethods = [
    { id: 'card', label: 'Card', icon: RiBankCardFill, color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { id: 'bank_slip', label: 'Bank Slip', icon: ReceiptText, color: 'bg-gray-50 border-gray-200 text-gray-700' }
  ];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountSelect = () => {
    setSelectedAmount('custom');
    setCustomAmount('');
  };

  const handleShare = async () => {
    const shareData = {
      title: event?.title || 'Support a Cause',
      text: `Support this cause: ${event?.title || 'Untitled Event'}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
      }).catch(() => {
        alert('Unable to copy link. Please copy manually: ' + window.location.href);
      });
    } else {
      alert('Share this link: ' + window.location.href);
    }
  };

  const handleDonate = () => {
    const amount = selectedAmount === 'custom' ? parseFloat(customAmount) : selectedAmount;
    if (!amount || !selectedPaymentMethod) {
      alert('Please select an amount and payment method');
      return;
    }
    
    console.log('Donation details:', {
      amount,
      paymentMethod: selectedPaymentMethod,
      supportMessage,
      anonymous: donateAnonymously,
      eventId: event?._id
    });
    
    alert(`Donation of LKR ${amount} initiated successfully!`);
  };

  if (!event) {
    return <div className="text-center mt-12 text-gray-600 font-family-inter">Loading event details...</div>;
  }

  const calculatePercentage = () => {
    const raised = event.raisedAmount || 0;
    const goal = event.fundingGoal || 1;
    const percentage = (raised / goal) * 100;
    return Math.min(100, Math.max(0, percentage));
  };

  const openPdfInNewTab = (url) => {
    console.log('Opening PDF:', url);
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>PDF Viewer</title>
            <style>
              html, body { 
                margin: 0; 
                padding: 0; 
                height: 100%; 
                overflow: hidden; 
              }
              .pdf-container { 
                width: 100%; 
                height: 100%; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
              }
              iframe { 
                width: 100%; 
                height: 100vh; 
                border: none; 
              }
            </style>
          </head>
          <body>
            <div class="pdf-container">
              <iframe src="${url}" type="application/pdf"></iframe>
            </div>
          </body>
        </html>
      `);
      newWindow.document.close();
    } else {
      console.error('Popup blocked. Please allow popups for this site.');
      alert('Popup blocked. Please allow popups to view the PDF.');
    }
  };

  const renderDocument = (url) => {
    console.log('Processing document URL:', url);
    if (!url) {
      console.warn('Invalid URL detected:', url);
      return <p className="text-red-500 font-family-inter">Invalid document link</p>;
    }
    const ext = url.split('.').pop().toLowerCase();
    console.log('Detected extension:', ext);
    if (ext === 'pdf') {
      return (
        <button
          onClick={() => openPdfInNewTab(url)}
          className="px-4 py-2 shadow bg-gray-100 border  font-family-inter flex flex-row gap-3"
        >
            <span><FaFilePdf className='text-xl'/></span>
          View PDF
        </button>
      );
    } else if (['jpg', 'jpeg', 'png'].includes(ext)) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className='flex flex-row gap-3 px-4 py-2 shadow bg-gray-100 border w-40  font-family-inter'>
            <span><IoMdImages className='text-2xl'/></span>
          View Image
        </a>
      );
    }
    return <p className="text-red-500 font-family-inter">Unsupported document type: {ext}</p>;
  };

  return (
    <div>
      <Header/>
      <div className="min-h-screen bg-gray-50 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 font-family-inter">
          <div className="flex flex-row gap-8">
            <div className="w-2/5">
              <div className="relative">
                <img
                  src={event.img}
                  alt={event.title}
                  className="w-full h-[70vh] object-cover"
                  onError={(e) => console.error('Event image failed to load:', event.img)}
                />
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md mt-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-green-600 font-semibold text-lg font-family-inter">Raised: </span>
                    <span className="font-medium text-lg text-gray-900 font-family-inter">
                      LKR {event.raisedAmount?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div>
                    <span className="text-purple-600 font-semibold text-lg font-family-inter">Goal: </span>
                    <span className="font-medium text-lg text-gray-900 font-family-inter">
                      LKR {event.fundingGoal?.toLocaleString() || '0'}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div 
                      className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${calculatePercentage()}%` }}
                    ></div>
                  </div>
                  <div className="text-purple-600 font-bold text-sm font-family-inter">
                    {`${calculatePercentage().toFixed(2)}%`}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-3/5 px-2 h-fit">
              <div className="mb-4">
                <h1 className="text-3xl font-medium text-gray-900 mb-2 font-family-inter">
                  {event.title}
                </h1>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600 font-family-inter">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{event.location}</span>
                  </div>
                  <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium border font-family-inter">
                    {event.category}
                  </span>
                </div>
              </div>
              <div className='border-[0.1px] mb-4 border-zinc-200' />
              <div className="mb-8">
                <label className="text-lg font-semibold text-gray-900 mb-4 block font-family-inter">
                  Select Donation Amount <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-3 mb-7">
                  {donationAmounts.map((amount) => (
                    <button
                      key={amount.value}
                      onClick={() => handleAmountSelect(amount.value)}
                      className={`px-4 py-2 border-2 rounded-lg text-center font-medium transition-all ${
                        selectedAmount === amount.value
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      } font-family-inter`}
                    >
                      {amount.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={handleCustomAmountSelect}
                    className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                      selectedAmount === 'custom'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    } font-family-inter`}
                  >
                    Custom Amount
                  </button>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-gray-600 font-medium font-family-inter">Amount (LKR):</span>
                    <input
                      type="number"
                      placeholder="Type your custom amount here"
                      value={selectedAmount === 'custom' ? customAmount : (selectedAmount || '')}
                      onChange={(e) => {
                        if (selectedAmount === 'custom') {
                          setCustomAmount(e.target.value);
                        }
                      }}
                      readOnly={selectedAmount !== 'custom'}
                      className={`flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        selectedAmount !== 'custom' ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                      } font-family-inter`}
                    />
                  </div>
                </div>
              </div>
              <div className="mb-8">
                <label className="text-lg font-semibold text-gray-900 mb-4 block font-family-inter">
                  Select Payment Method <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`px-4 py-2 border-2 rounded-lg text-center font-medium transition-all flex items-center justify-center gap-2 ${
                        selectedPaymentMethod === method.id
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${method.color} font-family-inter`}
                    >
                      <span className="text-lg">{React.createElement(method.icon)}</span>
                      <span className="text-sm">{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-lg font-semibold text-gray-900 font-family-inter">
                    Word of Support
                  </label>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <textarea
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Write your message of support..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-family-inter"
                  rows="2"
                />
              </div>
              <div className="mb-6 p-4 bg-orange-100/40 rounded-lg">
                <h4 className="font-semibold text-orange-600 mb-2 font-family-inter">Disclaimer :</h4>
                <ul className="text-orange-600 text-sm space-y-1 font-family-inter">
                  <li>• Donations made by the above means are final and will not be refunded.</li>
                </ul>
              </div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={donateAnonymously}
                      onChange={(e) => setDonateAnonymously(e.target.checked)}
                      className="sr-only"
                    />
                    <label
                      htmlFor="anonymous"
                      className={`flex items-center cursor-pointer ${
                        donateAnonymously ? 'text-purple-700' : 'text-gray-600'
                      } font-family-inter`}
                    >
                      <div className={`w-12 h-6 bg-gray-300 rounded-full relative transition-colors ${
                        donateAnonymously ? 'bg-purple-600' : 'bg-gray-300'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                          donateAnonymously ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </div>
                      <span className="ml-3 font-medium">Donate Anonymously</span>
                    </label>
                  </div>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium font-family-inter"
                >
                  <Share className="w-4 h-4" />
                  Share
                </button>
                <button
                  onClick={handleDonate}
                  className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium font-family-inter"
                >
                  Donate Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='bg-gray-100 mt-16 pb-10'>
        <div className='pt-11 px-20'>
          <h1 className="text-3xl font-medium text-gray-900 mb-10 font-family-inter px-4">
            {event.title}
          </h1>
          <p className="text-gray-600 font-family-inter px-4 mb-10">{event.description || 'No description available.'}</p>
          <h4 className='font-family-inter mt-8 text-xl px-4'>Documentations</h4>
          <div className="flex flex-row items-start  gap-4 mt-4 px-4">
            {event.documents && event.documents.length > 0 ? (
              event.documents.map((doc, index) => (
                <div key={index} className="p-2">
                  {renderDocument(doc) || <p className="text-red-500 font-family-inter">Invalid document</p>}
                </div>
              ))
            ) : (
              <p className="text-gray-500 font-family-inter">No documents available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;