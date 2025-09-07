import React, { useState } from 'react';
import { Upload, Calendar, Clock, MapPin, Users, Target, FileText, X } from 'lucide-react';

const CreateEventForm = () => {
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
    documents: []
  });

  const eventTypes = [
    { value: 'volunteer', label: 'Volunteer Event' },
    { value: 'fundraising', label: 'Fundraising Campaign' },
    { value: 'goods_collection', label: 'Goods Collection' },
    { value: 'mixed', label: 'Mixed Event' }
  ];

  const categories = [
    'Healthcare', 'Community', 'Animal Welfare', 'Education', 
    'Emergency', 'Environment', 'Cancer', 'Sports'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (type) => {
    setEventType(type);
    setFormData(prev => ({
      ...prev,
      type: type
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        img: file
      }));
    }
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const shouldShowVolunteerFields = () => {
    return eventType === 'volunteer' || eventType === 'mixed';
  };

  const shouldShowFundraisingFields = () => {
    return eventType === 'fundraising' || eventType === 'mixed';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Create New Event</h1>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">
            Cancel
          </button>
        </div>

        <div className="p-8">
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

            {/* Event Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
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
                      />
                    </label>
                    <p className="mt-1 text-sm text-gray-500">or drag and drop</p>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  {formData.img && (
                    <p className="mt-2 text-sm text-green-600">
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
                  />
                </div>
              </div>
            )}

            {/* Documents Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline w-4 h-4 mr-1" />
                Supporting Documents
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="mt-2">
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
                      />
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">PDF, PNG, JPEG, JPG files only</p>
                </div>
              </div>
              
              {/* Display uploaded documents */}
              {formData.documents.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">{doc.name}</span>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Information Notice */}
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
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-teal-600 text-white rounded-md font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Create Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventForm;