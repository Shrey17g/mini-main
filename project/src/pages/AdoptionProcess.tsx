import React from 'react';
import { Mail, Phone, Building, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const adoptionCenter = {
  id: 1,
  name: "Happy Tails Adoption Center",
  email: "adopt@happytails.org",
  phone: "(555) 123-4567",
  address: "789 Adoption Lane, San Francisco, CA 94105",
  hours: "Mon-Fri: 9am-6pm, Sat-Sun: 10am-4pm",
  description: "Specializing in dog and cat adoptions with over 15 years of experience in matching pets with loving families."
};

export default function AdoptionProcess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8"
        >
          <ArrowLeft size={20} />
          Back to Adoption
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Start Your Adoption Journey</h1>
          <p className="text-gray-600">
            Connect with our partner adoption center to begin the process of welcoming your new family member.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">{adoptionCenter.name}</h2>
          <p className="text-gray-600 mb-6">{adoptionCenter.description}</p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <Building className="text-indigo-600" />
              <span>{adoptionCenter.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-indigo-600" />
              <a href={`mailto:${adoptionCenter.email}`} className="text-indigo-600 hover:text-indigo-700">
                {adoptionCenter.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-indigo-600" />
              <a href={`tel:${adoptionCenter.phone}`} className="text-indigo-600 hover:text-indigo-700">
                {adoptionCenter.phone}
              </a>
            </div>
            <div className="text-gray-600">
              <strong>Hours:</strong> {adoptionCenter.hours}
            </div>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Phone
              </label>
              <input
                type="tel"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Tell us about your interest in adoption..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              Contact {adoptionCenter.name}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}