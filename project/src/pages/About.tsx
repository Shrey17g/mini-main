import React from 'react';
import { Heart, Users, Home, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const team = [
  {
    name: 'Emily Chen',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
    bio: 'Passionate about connecting pets with loving homes.'
  },
  {
    name: 'David Wilson',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80',
    bio: 'Expert in animal welfare and shelter management.'
  }
];

const stats = [
  { icon: Heart, value: '2,500+', label: 'Successful Adoptions' },
  { icon: Home, value: '50+', label: 'Partner Shelters' },
  { icon: Users, value: '10,000+', label: 'Community Members' },
  { icon: Award, value: '95%', label: 'Success Rate' }
];

export default function About() {
  const navigate = useNavigate();

  const handleGetInvolved = () => {
    navigate('/contact', { state: { scrollToContact: true } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600">
            At PawsConnect, we believe every pet deserves a loving home. Our mission is to create 
            meaningful connections between pets and people, making the adoption process seamless 
            and joyful for everyone involved.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                <stat.icon className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">{stat.value}</div>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-lg shadow-md p-6 flex items-center gap-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-indigo-600 mb-2">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-lg mb-6">
            Help us create a world where every pet has a loving home.
          </p>
          <button 
            onClick={handleGetInvolved}
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition duration-200"
          >
            Get Involved
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}