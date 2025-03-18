import React from 'react';
import { Heart, Home, Users, PawPrint } from 'lucide-react';

const stats = [
  {
    icon: Heart,
    value: '2,500+',
    label: 'Successful Adoptions',
    description: 'Pets found their forever homes'
  },
  {
    icon: Home,
    value: '50+',
    label: 'Partner Shelters',
    description: 'Working together to save lives'
  },
  {
    icon: Users,
    value: '10,000+',
    label: 'Community Members',
    description: 'Active pet lovers in our network'
  },
  {
    icon: PawPrint,
    value: '95%',
    label: 'Success Rate',
    description: 'Happy pets with loving families'
  }
];

export default function Statistics() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                <stat.icon className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">{stat.value}</div>
              <h3 className="text-xl font-semibold mb-2">{stat.label}</h3>
              <p className="text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}