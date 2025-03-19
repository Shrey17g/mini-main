import React, { useState } from 'react';
import { Search, MapPin, Calendar, Upload, Trash2, X, Phone, Mail } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const initialReports = [
  {
    id: 1,
    type: 'lost',
    petName: 'Rocky',
    description: 'Brown Labrador with blue collar',
    location: 'Central Park, NY',
    date: '2024-03-15',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80',
    contactName: 'John Doe',
    contactPhone: '+91 98765 43210',
    contactEmail: 'john@example.com',
    lastSeenDetails: 'Last seen near the children\'s playground, was wearing a blue collar with ID tag',
    additionalInfo: 'Very friendly, responds to his name, has a slight limp in right hind leg'
  },
  {
    id: 2,
    type: 'found',
    petName: 'Unknown',
    description: 'White cat with black spots',
    location: 'Downtown Seattle, WA',
    date: '2024-03-14',
    image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&q=80',
    contactName: 'Jane Smith',
    contactPhone: '+91 98765 43211',
    contactEmail: 'jane@example.com',
    lastSeenDetails: 'Found near the local supermarket, seems well-cared for',
    additionalInfo: 'Very gentle, wearing a faded red collar but no ID tag'
  }
];

export default function LostFound() {
  const [activeTab, setActiveTab] = useState('lost');
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('');
  const [reports, setReports] = useState(initialReports);
  const [selectedReport, setSelectedReport] = useState<typeof initialReports[0] | null>(null);
  const userType = localStorage.getItem('userType');
  const isAdmin = userType === 'admin';  // Restore admin check
  const navigate = useNavigate();

  const handleReportClick = (type: string) => {
    setFormType(type);
    setShowForm(true);
  };

  const handleDeleteReport = (reportId: number) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setReports(reports.filter(report => report.id !== reportId));
    }
  };

  const ReportForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">Report a Pet</h2>
      <form className="space-y-6">
        <div>
          <label htmlFor="petName" className="block text-sm font-medium text-gray-700 mb-1">
            Pet's Name (optional)
          </label>
          <input
            type="text"
            id="petName"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter pet's name if known"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Describe the pet (breed, color, size, distinguishing features, etc.)"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Last Seen Location
          </label>
          <input
            type="text"
            id="location"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter the location where the pet was last seen"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Name
            </label>
            <input
              type="text"
              id="contactName"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Phone
            </label>
            <input
              type="tel"
              id="contactPhone"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your email address"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Photo (optional)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                >
                  <span>Click to upload</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Submit Report
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  interface Pet {
    id: number;
    type: string;
    petName: string;
    description: string;
    location: string;
    date: string;
    image: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    lastSeenDetails: string;
    additionalInfo: string;
  }

  const PetCard = ({ pet }: { pet: Pet }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="relative">
          <img src={pet.image} alt={pet.petName} className="w-full h-48 object-cover" />
          {isAdmin && (
            <button
              onClick={() => handleDeleteReport(pet.id)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
              title="Delete report"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{pet.petName}</h3>
          <p className="text-gray-600 mb-2">{pet.description}</p>
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <MapPin size={16} />
            <span>{pet.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <Calendar size={16} />
            <span>{pet.date}</span>
          </div>
          <button 
            onClick={() => setSelectedReport(pet)}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            View Details
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!isAdmin && !showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Report a Pet</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <button
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition duration-200"
                onClick={() => handleReportClick('lost')}
              >
                <h3 className="text-lg font-semibold mb-2">Report Lost Pet</h3>
                <p className="text-gray-600">Lost your pet? File a report and we'll help you find them.</p>
              </button>
              <button
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition duration-200"
                onClick={() => handleReportClick('found')}
              >
                <h3 className="text-lg font-semibold mb-2">Report Found Pet</h3>
                <p className="text-gray-600">Found a pet? Help them reunite with their family.</p>
              </button>
            </div>
          </div>
        )}

        {showForm && <ReportForm />}

        <div className="mb-8">
          <div className="flex gap-4 mb-6">
            <button
              className={`px-6 py-2 rounded-lg ${activeTab === 'lost' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setActiveTab('lost')}
            >
              Lost Pets
            </button>
            <button
              className={`px-6 py-2 rounded-lg ${activeTab === 'found' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setActiveTab('found')}
            >
              Found Pets
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports
              .filter((report) => report.type === activeTab)
              .map((report) => (
                <PetCard key={report.id} pet={report} />
              ))}
          </div>
        </div>

        {/* Report Details Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {selectedReport.type === 'lost' ? 'Lost Pet Details' : 'Found Pet Details'}
                </h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <img
                      src={selectedReport.image}
                      alt={selectedReport.petName}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-semibold mb-2">{selectedReport.petName}</h3>
                    <p className="text-gray-600 mb-4">{selectedReport.description}</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Last Seen Details</h4>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MapPin size={16} />
                        <span>{selectedReport.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Calendar size={16} />
                        <span>{selectedReport.date}</span>
                      </div>
                      <p className="text-gray-600">{selectedReport.lastSeenDetails}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Additional Information</h4>
                      <p className="text-gray-600">{selectedReport.additionalInfo}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Contact Information</h4>
                      <div className="space-y-2">
                        <p className="text-gray-600">{selectedReport.contactName}</p>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={16} />
                          <a href={`tel:${selectedReport.contactPhone}`} className="hover:text-indigo-600">
                            {selectedReport.contactPhone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={16} />
                          <a href={`mailto:${selectedReport.contactEmail}`} className="hover:text-indigo-600">
                            {selectedReport.contactEmail}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}