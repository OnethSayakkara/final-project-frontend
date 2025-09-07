import React, { useState, useEffect } from 'react';
import { MapPin, Info, Share, ReceiptText, User, Phone, Mail } from 'lucide-react';
import { RiBankCardFill } from "react-icons/ri";
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../common/Header';
import { FaFilePdf } from "react-icons/fa";
import { IoMdImages } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import { FaRegClock } from "react-icons/fa6";
import PhoneInput from 'react-phone-input-2';
import Footer from '../../common/Footer';
import call from '../../../public/call.png'

const DonationPage = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [donateAnonymously, setDonateAnonymously] = useState(false);
  const [event, setEvent] = useState(null);
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [isRegistered, setIsRegistered] = useState(false); // New state to track registration status

  const { id } = useParams();
  const navigate = useNavigate();

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

        // Check if user is already registered for this event
        const userId = localStorage.getItem('userId');
        if (userId && data.type === 'volunteer') {
          const registrationCheckResponse = await fetch(`http://localhost:3000/volunteer/checkRegistration/${id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
          });
          if (registrationCheckResponse.ok) {
            const result = await registrationCheckResponse.json();
            setIsRegistered(result.isRegistered);
          }
        }
      } catch (error) {
        console.error('Error fetching event details or registration status:', error);
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

  const handleDonate = async () => {
    const amount = selectedAmount === 'custom' ? parseFloat(customAmount) : selectedAmount;

    if (event.type !== 'volunteer') {
      if (!amount || amount <= 0) {
        alert('Please select a valid donation amount');
        return;
      }

      if (!selectedPaymentMethod) {
        alert('Please select a payment method');
        return;
      }

      const donationData = {
        eventId: event._id,
        eventTitle: event.title,
        amount: amount,
        paymentMethod: selectedPaymentMethod,
        anonymous: donateAnonymously,
        supportMessage: supportMessage,
      };

      if (selectedPaymentMethod === 'card') {
        navigate('/card-payment', { state: donationData });
      } else if (selectedPaymentMethod === 'bank_slip') {
        navigate('/bank-slip-payment', { state: donationData });
      }
    } else {
      if (isRegistered) {
        alert('You are already registered for this event.');
        return;
      }

      if (!fullName || !emailAddress || !phoneNumber) {
        alert('Please fill in all required fields (Full Name, Email Address, Phone Number)');
        return;
      }

      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Please log in to register as a volunteer.');
        return;
      }

      const registrationData = {
        eventId: event._id,
        userId: userId,
        fullName,
        email: emailAddress,
        phoneNumber,
        specialRequirements,
      };

      try {
        const response = await fetch('http://localhost:3000/volunteer/registervolunteerstoevents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registrationData),
        });

        if (!response.ok) {
          throw new Error('Failed to register volunteer');
        }

        const result = await response.json();
        console.log('Volunteer registration successful:', result);
        alert('Registration successful! Check your email for confirmation.');
        setIsRegistered(true); // Update state after successful registration
        navigate('/registration-success');
      } catch (error) {
        console.error('Error registering volunteer:', error);
        alert('Failed to register. Please try again.');
      }
    }
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
          <span><FaFilePdf className='text-xl' /></span>
          View PDF
        </button>
      );
    } else if (['jpg', 'jpeg', 'png'].includes(ext)) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className='flex flex-row gap-3 px-4 py-2 shadow bg-gray-100 border w-40  font-family-inter'>
          <span><IoMdImages className='text-2xl' /></span>
          View Image
        </a>
      );
    }
    return <p className="text-red-500 font-family-inter">Unsupported document type: {ext}</p>;
  };

  return (
    <div>
      <Header />
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
              {event.type === 'volunteer' && (
                <>
                  {/* Google Maps Embed */}
                  {event.location && (
                    <div className="mt-4 w-full h-72 rounded-lg overflow-hidden shadow">
                      <iframe
                        title="Event Location"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(event.location)}&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  )}
                </>
              )}

              {event.type !== 'volunteer' && (
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
              )}
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
              {event.type === 'volunteer' && (
                <div className="flex flex-row justify-between text-gray-600 font-family-inter mb-3">
                  <div className='flex flex-row gap-3'>
                    <MdDateRange className='text-xl' />
                    <p className='text-base'>{new Date(event.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className='flex flex-row gap-2'>
                    <FaRegClock className='text-xl mr-2' />
                    <p className='text-base'>{event.startTime || 'N/A'}</p>
                    <p>-</p>
                    <p className='text-base'>{event.endTime || 'N/A'}</p>
                  </div>
                </div>
              )}
              <div className='border-[0.1px] mb-4 border-zinc-200' />

              {event.type !== 'volunteer' && (
                <div className="mb-8">
                  <label className="text-lg font-semibold text-gray-900 mb-4 block font-family-inter">
                    Select Donation Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-3 mb-7">
                    {donationAmounts.map((amount) => (
                      <button
                        key={amount.value}
                        onClick={() => handleAmountSelect(amount.value)}
                        className={`px-4 py-2 border-2 rounded-lg text-center font-medium transition-all ${selectedAmount === amount.value
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
                      className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${selectedAmount === 'custom'
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
                        className={`flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${selectedAmount !== 'custom' ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                          } font-family-inter`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {event.type === 'volunteer' && (
                <div className="mb-8">
                  <label className="text-lg font-semibold text-gray-900 mb-4 block font-family-inter">
                    Your Information <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 font-family-inter">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-family-inter"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 font-family-inter">Email Address</label>
                      <input
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-family-inter"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 font-family-inter">Phone Number</label>
                      <PhoneInput
                        country={'lk'}
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        inputProps={{
                          className: "w-full px-13 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-family-inter",
                          required: true,
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 font-family-inter">Special Requirements or Questions (Optional)</label>
                      <textarea
                        value={specialRequirements}
                        onChange={(e) => setSpecialRequirements(e.target.value)}
                        placeholder="Any dietary restrictions, accessibility needs, or questions..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-family-inter"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              )}

              {event.type !== 'volunteer' && (
                <div className="mb-8">
                  <label className="text-lg font-semibold text-gray-900 mb-4 block font-family-inter">
                    Select Payment Method <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`px-4 py-2 border-2 rounded-lg text-center font-medium transition-all flex items-center justify-center gap-2 ${selectedPaymentMethod === method.id
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
              )}

              {event.type !== 'volunteer' && (
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
              )}

              <div className="mb-6 p-4 bg-orange-100/40 rounded-lg">
                <h4 className="font-semibold text-orange-600 mb-2 font-family-inter">Disclaimer :</h4>
                <ul className="text-orange-600 text-sm space-y-1 font-family-inter">
                  {event.type !== 'volunteer' && (
                    <li>• Donations made by the above means are final and will not be refunded.</li>
                  )}
                  {event.type === 'volunteer' && (
                    <li>• By registering, you agree to participate in this volunteer activity and follow all safety guidelines provided by the organizers.</li>
                  )}
                </ul>
              </div>

              {event.type !== 'volunteer' && (
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
                        className={`flex items-center cursor-pointer ${donateAnonymously ? 'text-purple-700' : 'text-gray-600'
                          } font-family-inter`}
                      >
                        <div className={`w-12 h-6 bg-gray-300 rounded-full relative transition-colors ${donateAnonymously ? 'bg-purple-600' : 'bg-gray-300'
                          }`}>
                          <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${donateAnonymously ? 'translate-x-6' : 'translate-x-0.5'
                            }`}></div>
                        </div>
                        <span className="ml-3 font-medium">Donate Anonymously</span>
                      </label>
                    </div>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center cursor-pointer justify-center gap-2 px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium font-family-inter"
                >
                  <Share className="w-4 h-4" />
                  Share
                </button>
                <button
                  onClick={handleDonate}
                  className={`flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium font-family-inter ${event.type === 'volunteer' && isRegistered ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={event.type === 'volunteer' && isRegistered}
                >
                  {event.type === 'volunteer' ? (isRegistered ? 'Already Registered' : 'Register Now') : 'Donate Now'}
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
          {event.type === 'volunteer' && (
            <div className="text-gray-600 font-family-inte mb-10 px-4 space-y-3 text-lg">
              <p>Event Date: {new Date(event.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p>Start Time: {event.startTime || 'N/A'}</p>
              <p>End Time: {event.endTime || 'N/A'}</p>
            </div>
          )}
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

      <div className="bg-white border border-gray-200 rounded-2xl font-family-inter shadow-sm py-10 px-8 mt-10 mb-10 mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        {/* Left side - Support text and contact info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 -mt-14 mb-8">
            Need Any Support?{' '}
            <span className="text-purple-600">Say Hello to Us!</span>
          </h2>
          
          <div className="flex items-center space-x-8 mt-16">
            {/* Contact Person */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-gray-700 font-medium">Mr. Chanaka Nuwan</span>
            </div>
            
            {/* Phone */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-gray-700 font-medium">0777210346</span>
            </div>
            
            {/* Email */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-gray-700 font-medium">isurudananjaya@gmail.com</span>
            </div>
          </div>
        </div>
        
        <img src={call} />
      </div>
    </div>

      <Footer />
    </div>
  );
};

export default DonationPage;