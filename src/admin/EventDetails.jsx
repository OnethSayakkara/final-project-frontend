// src/components/Admin/EventDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, User, Tag, ArrowLeft } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scamPrediction, setScamPrediction] = useState(null);
    const [predictionLoading, setPredictionLoading] = useState(false);
    const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
    const [error, setError] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionInput, setShowRejectionInput] = useState(false);

    useEffect(() => {
        const fetchEventAndCheckScam = async () => {
            try {
                // Fetch event details
                const eventResponse = await axios.get(`http://localhost:3000/event/geteventbyid/${id}`);
                const eventData = eventResponse.data;
                setEvent(eventData);

                // Check if the event type requires a scam check
                if (eventData.type === 'fundraising' || eventData.type === 'mixed') {
                    setPredictionLoading(true);
                    const scamResponse = await axios.post('http://localhost:3000/scamDetection/check-scam', {
                        title: eventData.title,
                        description: eventData.description,
                    });
                    setScamPrediction(scamResponse.data);
                } else {
                    setScamPrediction({
                        label: 'not_applicable',
                        confidence: 1.0,
                    });
                }
            } catch (err) {
                console.error('Error fetching event or checking for scam:', err);
                setError('Failed to load event details or run scam check.');
            } finally {
                setLoading(false);
                setPredictionLoading(false);
            }
        };

        fetchEventAndCheckScam();
    }, [id]);

    const handleUpdateStatus = async (status) => {
        try {
            setUpdateStatusLoading(true);
            let updatePayload = { status };

            if (status === 'rejected') {
                if (!rejectionReason) {
                    alert('Rejection reason is required.');
                    setUpdateStatusLoading(false);
                    return;
                }
                updatePayload.rejectionReason = rejectionReason;
                if (event.type === 'fundraising' || event.type === 'mixed') {
                    updatePayload.predictionType = scamPrediction?.label || null;
                    updatePayload.predictionValue = scamPrediction?.confidence || null;
                }
            } else if (status === 'approved') {
                if (event.type === 'fundraising' || event.type === 'mixed') {
                    updatePayload.predictionType = scamPrediction?.label || null;
                    updatePayload.predictionValue = scamPrediction?.confidence || null;
                }
            }

            const response = await axios.put(`http://localhost:3000/event/${id}/status`, updatePayload);
            console.log('Event status updated:', response.data);
            
            // Show success toast notification
            toast.success(`Event successfully ${status}.`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            // Navigate back after a delay to allow the toast to be seen
            setTimeout(() => {
                navigate('/Admin/allevents');
            }, 3500);

        } catch (err) {
            console.error('Error updating event status:', err);
            setError('Failed to update event status. Please try again.');
            toast.error('Failed to update event status.', {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setUpdateStatusLoading(false);
        }
    };

    const confirmAction = (status) => {
        const actionText = status === 'approved' ? 'approve' : 'reject';
        const isConfirmed = window.confirm(`Are you sure you want to ${actionText} this event?`);
        if (isConfirmed) {
            handleUpdateStatus(status);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending_review': return 'bg-yellow-100 text-yellow-700';
            case 'approved': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getPredictionColor = (label) => {
        switch (label) {
            case 'safe': return 'text-green-600 font-semibold';
            case 'suspicious': return 'text-yellow-600 font-semibold';
            case 'scam': return 'text-red-600 font-semibold';
            case 'not_applicable': return 'text-gray-600 font-semibold';
            default: return 'text-gray-600';
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center font-family-inter">Loading event details...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center font-family-inter text-red-600">{error}</div>;
    }

    if (!event) {
        return <div className="min-h-screen flex items-center justify-center font-family-inter">Event not found.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-family-inter">
            <ToastContainer />
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/Admin/allevents')}
                    className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-1"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Events</span>
                </button>

                {/* Event Details Section */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                            {event.status.replace('_', ' ')}
                        </span>
                    </div>
                    <img src={event.img} alt={event.title} className="w-full h-80 object-cover rounded-lg mb-6" />
                    <p className="text-gray-700 mb-6 leading-relaxed whitespace-pre-wrap">{event.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 mb-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <span>{new Date(event.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            <span>{event.organizer?.name || 'Unknown Organizer'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tag className="w-5 h-5" />
                            <span>Category: {event.category}</span>
                        </div>
                    </div>
                </div>

                {/* Scam Check and Action Section */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Scam Detection Analysis</h2>
                    {predictionLoading ? (
                        <p className="text-center text-gray-500">Running scam check...</p>
                    ) : scamPrediction ? (
                        <>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="font-semibold text-gray-700">Prediction:</span>
                                <span className={getPredictionColor(scamPrediction.label)}>
                                    {scamPrediction.label.toUpperCase().replace('_', ' ')}
                                </span>
                                {scamPrediction.label !== 'not_applicable' && (
                                    <span className="text-gray-500 text-sm">
                                        (Confidence: {Math.round(scamPrediction.confidence * 100)}%)
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600 mb-6">
                                {scamPrediction.label === 'not_applicable' ?
                                    "Scam detection is not applicable for this event type." :
                                    `Based on the event's title and description, the AI model has classified this event as potentially ${scamPrediction.label}.`
                                }
                            </p>
                        </>
                    ) : (
                        <p className="text-red-600 text-center">Scam detection failed to run.</p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => confirmAction('approved')}
                            disabled={updateStatusLoading || event.status === 'approved'}
                            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                                updateStatusLoading || event.status === 'approved'
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                        >
                            {updateStatusLoading ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                            onClick={() => setShowRejectionInput(!showRejectionInput)}
                            disabled={updateStatusLoading || event.status === 'rejected'}
                            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                                updateStatusLoading || event.status === 'rejected'
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                        >
                            Reject
                        </button>
                    </div>

                    {/* Rejection Reason Input */}
                    {showRejectionInput && (
                        <div className="mt-4">
                            <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-1">
                                Rejection Reason:
                            </label>
                            <textarea
                                id="rejectionReason"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Enter reason for rejection..."
                            ></textarea>
                            <button
                                onClick={() => confirmAction('rejected')}
                                disabled={updateStatusLoading || !rejectionReason}
                                className={`mt-2 w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
                                    updateStatusLoading || !rejectionReason
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700 text-white'
                                }`}
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventDetails;