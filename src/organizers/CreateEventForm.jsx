import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Upload, Calendar, Clock, MapPin, Users, Target, FileText, X, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateEventForm = () => {
  const navigate = useNavigate();
  const [eventType, setEventType] = useState('volunteer');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'volunteer',
    category: 'Healthcare',
    fundingGoal: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    location: '',
    targetVolunteers: '',
    greetingSentence: '',
    predictionType: '',
    predictionValue: '',
    img: null,
    documents: [],
  });
  const [organizerStatus, setOrganizerStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, message: '', type: '' });

  const eventTypes = [
    { value: 'volunteer', label: 'Volunteer Event' },
    { value: 'fundraising', label: 'Fundraising Campaign' },
    { value: 'goods_collection', label: 'Goods Collection' },
    { value: 'mixed', label: 'Mixed Event' },
  ];

  const categories = [
    'Healthcare', 'Community', 'Animal Welfare', 'Education',
    'Emergency', 'Environment', 'Cancer', 'Sports',
  ];

  useEffect(() => {
    const fetchOrganizerStatus = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setModal({
          isOpen: true,
          message: 'No organizer ID found. Please log in.',
          type: 'error',
        });
        setLoadingStatus(false);
        return;
      }

      try {
        console.log('DEBUG: Fetching organizer status for ID:', userId);
        const response = await axios.get(`http://localhost:3000/organizer/organizers/${userId}`);
        console.log('DEBUG: Organizer response:', response.data);
        setOrganizerStatus(response.data.currentStatus);
      } catch (err) {
        console.error('Error fetching organizer status:', err.response?.data || err.message);
        setModal({
          isOpen: true,
          message: 'Failed to verify organizer status.',
          type: 'error',
        });
      } finally {
        setLoadingStatus(false);
      }
    };

    fetchOrganizerStatus();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (type) => {
    setEventType(type);
    setFormData((prev) => ({
      ...prev,
      type,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        img: file,
      }));
    }
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...files],
    }));
  };

  const removeDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (organizerStatus !== 'active') {
      setModal({
        isOpen: true,
        message: 'You cannot create events because your account is banned.',
        type: 'error',
      });
      return;
    }

    setSubmitting(true);
    const userId = localStorage.getItem('userId');
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('type', formData.type);
    data.append('category', formData.category);
    data.append('location', formData.location);
    data.append('organizer', userId);
    if (formData.greetingSentence) data.append('greetingSentence', formData.greetingSentence);
    if (formData.fundingGoal && (formData.type === 'fundraising' || formData.type === 'mixed')) {
      data.append('fundingGoal', formData.fundingGoal);
    }
    if (formData.predictionType) data.append('predictionType', formData.predictionType);
    if (formData.predictionValue) data.append('predictionValue', formData.predictionValue);
    if (formData.targetVolunteers && (formData.type === 'volunteer' || formData.type === 'mixed')) {
      data.append('TargetVolunteers', formData.targetVolunteers);
    }
    if (formData.eventDate && (formData.type === 'volunteer' || formData.type === 'mixed')) {
      data.append('eventDate', formData.eventDate);
    }
    if (formData.startTime && (formData.type === 'volunteer' || formData.type === 'mixed')) {
      data.append('startTime', formData.startTime);
    }
    if (formData.endTime && (formData.type === 'volunteer' || formData.type === 'mixed')) {
      data.append('endTime', formData.endTime);
    }
    if (formData.img) {
      data.append('Img', formData.img);
    }
    formData.documents.forEach((doc, index) => {
      data.append('documents', doc);
    });

    try {
      console.log('DEBUG: Submitting event data:', Object.fromEntries(data));
      const response = await axios.post('http://localhost:3000/event/registerEvent', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('DEBUG: Event creation response:', response.data);
      setModal({
        isOpen: true,
        message: 'Event created successfully! It is now pending review.',
        type: 'success',
      });
      setFormData({
        title: '',
        description: '',
        type: 'volunteer',
        category: 'Healthcare',
        fundingGoal: '',
        eventDate: '',
        startTime: '',
        endTime: '',
        location: '',
        targetVolunteers: '',
        greetingSentence: '',
        predictionType: '',
        predictionValue: '',
        img: null,
        documents: [],
      });
      setEventType('volunteer');
    } catch (err) {
      console.error('Error creating event:', err.response?.data || err.message);
      setModal({
        isOpen: true,
        message: err.response?.data?.message || 'Failed to create event.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    if (modal.type === 'success') {
      navigate('/organizer/events'); // Adjust route as needed
    }
    setModal({ isOpen: false, message: '', type: '' });
  };

  const shouldShowVolunteerFields = () => {
    return eventType === 'volunteer' || eventType === 'mixed';
  };

  const shouldShowFundraisingFields = () => {
    return eventType === 'fundraising' || eventType === 'mixed';
  };

  if (loadingStatus) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 font-family-inter">
        <div className="max-w-4xl mx-auto text-center text-gray-500">
          Checking organizer status...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-family-inter">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-2 mb-4">
              {modal.type === 'error' ? (
                <AlertTriangle className="w-6 h-6 text-red-500" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
              <h2 className="text-lg font-semibold text-gray-900">
                {modal.type === 'error' ? 'Error' : 'Success'}
              </h2>
            </div>
            <p className="text-gray-600 mb-6">{modal.message}</p>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Close modal"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Create New Event</h1>
          <button
            onClick={() => navigate('/organizer/events')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Cancel event creation"
          >
            Cancel
          </button>
        </div>

        <div className="p-8">
          {organizerStatus === 'banned' ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Account Banned</h3>
              <p className="text-gray-500">
                Your organizer account is banned and cannot create events. Contact support for assistance.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Event Type Selection */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Event Type</h2>
                <div className="flex flex-wrap gap-3">
                  {eventTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleTypeChange(type.value)}
                      className={`px-4 py-2 rounded-md font-medium transition-colors ${
                        eventType === type.value
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      aria-label={`Select ${type.label}`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Information */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter event title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                      aria-required="true"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the event and its purpose"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                    aria-required="true"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Greeting Sentence
                  </label>
                  <input
                    type="text"
                    name="greetingSentence"
                    value={formData.greetingSentence}
                    onChange={handleInputChange}
                    placeholder="Welcome message for participants"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-teal-600 hover:text-teal-500">
                          Upload a file
                        </span>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          aria-label="Upload event image"
                        />
                      </label>
                      <p className="mt-1 text-sm text-gray-500">or drag and drop</p>
                      <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      {formData.img && (
                        <p className="mt-2 text-sm text-green-600 truncate">
                          ✓ {formData.img.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Fundraising Fields */}
              {shouldShowFundraisingFields() && (
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Fundraising Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Target className="inline w-4 h-4 mr-1" />
                        Funding Goal (LKR) *
                      </label>
                      <input
                        type="number"
                        name="fundingGoal"
                        value={formData.fundingGoal}
                        onChange={handleInputChange}
                        placeholder="Enter funding goal"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required={shouldShowFundraisingFields()}
                        aria-required={shouldShowFundraisingFields()}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prediction Type
                      </label>
                      <input
                        type="text"
                        name="predictionType"
                        value={formData.predictionType}
                        onChange={handleInputChange}
                        placeholder="e.g., Expected completion time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prediction Value
                      </label>
                      <input
                        type="number"
                        name="predictionValue"
                        value={formData.predictionValue}
                        onChange={handleInputChange}
                        placeholder="Enter prediction value"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Event Details */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Event Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Event location"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                      aria-required="true"
                    />
                  </div>
                  {shouldShowVolunteerFields() && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Users className="inline w-4 h-4 mr-1" />
                        Target Volunteers
                      </label>
                      <input
                        type="number"
                        name="targetVolunteers"
                        value={formData.targetVolunteers}
                        onChange={handleInputChange}
                        placeholder="Number of volunteers needed"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
                {shouldShowVolunteerFields() && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="inline w-4 h-4 mr-1" />
                        Event Date *
                      </label>
                      <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required={shouldShowVolunteerFields()}
                        aria-required={shouldShowVolunteerFields()}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="inline w-4 h-4 mr-1" />
                        Start Time *
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required={shouldShowVolunteerFields()}
                        aria-required={shouldShowVolunteerFields()}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="inline w-4 h-4 mr-1" />
                        End Time *
                      </label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required={shouldShowVolunteerFields()}
                        aria-required={shouldShowVolunteerFields()}
                      />
                    </div>
                  </div>
                )}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline w-4 h-4 mr-1" />
                    Supporting Documents
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <label htmlFor="document-upload" className="cursor-pointer">
                        <span className="text-sm font-medium text-teal-600 hover:text-teal-500">
                          Upload documents
                        </span>
                        <input
                          id="document-upload"
                          type="file"
                          multiple
                          accept=".pdf,.png,.jpeg,.jpg"
                          onChange={handleDocumentUpload}
                          className="hidden"
                          aria-label="Upload supporting documents"
                        />
                      </label>
                      <p className="mt-1 text-xs text-gray-500">PDF, PNG, JPEG, JPG files only</p>
                    </div>
                  </div>
                  {formData.documents.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-700 truncate">{doc.name}</span>
                          <button
                            type="button"
                            onClick={() => removeDocument(index)}
                            className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            aria-label={`Remove ${doc.name}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 rounded-full border-2 border-blue-400 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-800">
                        <strong>Information:</strong> All registered volunteers will receive email notifications about this event.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/organizer/events')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-label="Cancel event creation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-6 py-2 rounded-md text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    submitting ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
                  }`}
                  aria-label="Create event"
                >
                  {submitting ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEventForm;