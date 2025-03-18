import React from 'react';

const featuredPets = [
  {
    id: 1,
    name: 'Luna',
    age: '2 years',
    breed: 'Golden Retriever',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    name: 'Oliver',
    age: '1 year',
    breed: 'Tabby Cat',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    name: 'Max',
    age: '3 years',
    breed: 'German Shepherd',
    image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    name: 'Bella',
    age: '6 months',
    breed: 'Siamese Cat',
    image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80'
  }
];

export default function FeaturedPets() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Pets</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPets.map((pet) => (
            <div key={pet.id} className="pet-card">
              <img src={pet.image} alt={pet.name} />
              <h3 className="text-xl font-semibold mb-2">{pet.name}</h3>
              <p className="text-gray-600">{pet.age} • {pet.breed}</p>
              <button className="btn-primary w-full mt-4">
                Adopt Me
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}