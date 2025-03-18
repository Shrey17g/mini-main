import React, { useState, useRef } from 'react';
import { Search, X, Heart, MapPin, Calendar, Syringe, Bone, Cake, Upload, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

interface Pet {
  id: number;
  name: string;
  breed: string;
  age: string;
  location: string;
  image: string;
  description: string;
  vaccinations: string[];
  medicalHistory: string;
  personality: string[];
  requirements: string[];
  weight: string;
  gender: string;
  animalType: string;
  centerId?: number;
}

const pets: Pet[] = [
  {
    id: 1,
    name: 'Luna',
    breed: 'Golden Retriever',
    age: '2 years',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80',
    description: 'Luna is a friendly and energetic Golden Retriever who loves to play fetch and go for long walks. She\'s great with children and other dogs.',
    vaccinations: ['DHPP', 'Rabies', 'Bordetella', 'Leptospirosis'],
    medicalHistory: 'Spayed, microchipped, and up to date on all vaccinations. No major health issues.',
    personality: ['Friendly', 'Energetic', 'Good with kids', 'Good with other dogs'],
    requirements: ['Fenced yard', 'Active family', 'Regular exercise'],
    weight: '65 lbs',
    gender: 'Female',
    animalType: 'Dog',
    centerId: 1
  },
  {
    id: 2,
    name: 'Max',
    breed: 'German Shepherd',
    age: '1 year',
    location: 'Los Angeles, CA',
    image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&q=80',
    description: 'Max is a smart and loyal German Shepherd who excels in training. He\'s protective by nature but gentle with his family.',
    vaccinations: ['DHPP', 'Rabies', 'Bordetella'],
    medicalHistory: 'Neutered, microchipped, and up to date on all vaccinations. Mild hip dysplasia managed with supplements.',
    personality: ['Intelligent', 'Loyal', 'Protective', 'Trainable'],
    requirements: ['Experience with breed', 'Secure yard', 'Training commitment'],
    weight: '75 lbs',
    gender: 'Male',
    animalType: 'Dog',
    centerId: 2
  }
];

export default function Adopt() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');
  const isCenter = userType === 'center';
  const isAdmin = userType === 'admin';
  const [petsList, setPetsList] = useState<Pet[]>(pets);

  const [newPet, setNewPet] = useState({
    name: '',
    breed: '',
    age: '',
    location: '',
    description: '',
    vaccinations: [''],
    medicalHistory: '',
    personality: [''],
    requirements: [''],
    weight: '',
    gender: 'Male',
    animalType: 'Dog',
    image: ''
  });

  const animalTypes = ['All Pets', 'Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Guinea Pig', 'Fish', 'Reptile', 'Other'];

  const handleStartAdoption = (pet: Pet) => {
    navigate('/adoption-process');
  };

  const handleAddVaccination = () => {
    setNewPet(prev => ({
      ...prev,
      vaccinations: [...prev.vaccinations, '']
    }));
  };

  const handleAddPersonality = () => {
    setNewPet(prev => ({
      ...prev,
      personality: [...prev.personality, '']
    }));
  };

  const handleAddRequirement = () => {
    setNewPet(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const handleSubmitPet = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Math.max(...petsList.map(p => p.id)) + 1;
    const newPetObj: Pet = {
      ...newPet,
      id: newId,
      centerId: 1,
      image: newPet.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80'
    };
    setPetsList([...petsList, newPetObj]);
    setShowAddPetForm(false);
  };

  const handleDeletePet = (petId: number) => {
    if (window.confirm('Are you sure you want to remove this pet from the listings?')) {
      setPetsList(prevPets => prevPets.filter(pet => pet.id !== petId));
      setSelectedPet(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPet(prev => ({
          ...prev,
          image: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredPets = petsList.filter(pet => {
    const matchesSearch = 
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedType === 'all') return matchesSearch;
    return matchesSearch && pet.animalType.toLowerCase() === selectedType.toLowerCase();
  });

  const displayPets = isCenter 
    ? filteredPets.filter(pet => pet.centerId === 1)
    : filteredPets;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isCenter && (
          <div className="mb-8">
            <button
              onClick={() => setShowAddPetForm(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Pet
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, breed, or location..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value.toLowerCase())}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {animalTypes.map((type) => (
              <option key={type} value={type.toLowerCase()}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPets.map((pet) => (
            <div key={pet.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img src={pet.image} alt={pet.name} className="w-full h-48 object-cover" />
                {isCenter && (
                  <button
                    onClick={() => handleDeletePet(pet.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    title="Remove pet"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{pet.name}</h3>
                <p className="text-gray-600 mb-1">{pet.breed}</p>
                <p className="text-gray-600 mb-1">{pet.age}</p>
                <p className="text-gray-600 mb-4">{pet.location}</p>
                <button 
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                  onClick={() => setSelectedPet(pet)}
                >
                  Meet {pet.name}
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAddPetForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Add New Pet</h2>
                <button
                  onClick={() => setShowAddPetForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmitPet} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Animal Type
                    </label>
                    <select
                      value={newPet.animalType}
                      onChange={(e) => setNewPet(prev => ({ ...prev, animalType: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    >
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Bird">Bird</option>
                      <option value="Rabbit">Rabbit</option>
                      <option value="Hamster">Hamster</option>
                      <option value="Guinea Pig">Guinea Pig</option>
                      <option value="Fish">Fish</option>
                      <option value="Reptile">Reptile</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pet Name
                    </label>
                    <input
                      type="text"
                      value={newPet.name}
                      onChange={(e) => setNewPet(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Breed
                    </label>
                    <input
                      type="text"
                      value={newPet.breed}
                      onChange={(e) => setNewPet(prev => ({ ...prev, breed: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      type="text"
                      value={newPet.age}
                      onChange={(e) => setNewPet(prev => ({ ...prev, age: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={newPet.location}
                      onChange={(e) => setNewPet(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight
                    </label>
                    <input
                      type="text"
                      value={newPet.weight}
                      onChange={(e) => setNewPet(prev => ({ ...prev, weight: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., 65 lbs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={newPet.gender}
                      onChange={(e) => setNewPet(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newPet.description}
                    onChange={(e) => setNewPet(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder={`Describe the ${newPet.animalType.toLowerCase()}'s personality, behavior, and any special characteristics`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medical History
                  </label>
                  <textarea
                    value={newPet.medicalHistory}
                    onChange={(e) => setNewPet(prev => ({ ...prev, medicalHistory: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vaccinations
                  </label>
                  {newPet.vaccinations.map((vaccination, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={vaccination}
                        onChange={(e) => {
                          const newVaccinations = [...newPet.vaccinations];
                          newVaccinations[index] = e.target.value;
                          setNewPet(prev => ({ ...prev, vaccinations: newVaccinations }));
                        }}
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter vaccination"
                        required
                      />
                      {index === newPet.vaccinations.length - 1 && (
                        <button
                          type="button"
                          onClick={handleAddVaccination}
                          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          <Plus size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Personality Traits
                  </label>
                  {newPet.personality.map((trait, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={trait}
                        onChange={(e) => {
                          const newTraits = [...newPet.personality];
                          newTraits[index] = e.target.value;
                          setNewPet(prev => ({ ...prev, personality: newTraits }));
                        }}
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter personality trait"
                        required
                      />
                      {index === newPet.personality.length - 1 && (
                        <button
                          type="button"
                          onClick={handleAddPersonality}
                          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          <Plus size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adoption Requirements
                  </label>
                  {newPet.requirements.map((requirement, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={requirement}
                        onChange={(e) => {
                          const newRequirements = [...newPet.requirements];
                          newRequirements[index] = e.target.value;
                          setNewPet(prev => ({ ...prev, requirements: newRequirements }));
                        }}
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter requirement"
                        required
                      />
                      {index === newPet.requirements.length - 1 && (
                        <button
                          type="button"
                          onClick={handleAddRequirement}
                          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          <Plus size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pet Photo
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
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
                    Add Pet
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddPetForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedPet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Meet {selectedPet.name}</h2>
                <div className="flex items-center gap-2">
                  {isCenter && (
                    <button
                      onClick={() => handleDeletePet(selectedPet.id)}
                      className="text-red-500 hover:text-red-600"
                      title="Remove pet"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedPet(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <img
                      src={selectedPet.image}
                      alt={selectedPet.name}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Bone className="text-indigo-600" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">Weight</p>
                          <p className="font-medium">{selectedPet.weight}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">About {selectedPet.name}</h3>
                      <p className="text-gray-600">{selectedPet.description}</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-2">Medical History</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start gap-2 mb-4">
                          <Syringe className="text-indigo-600 mt-1" size={20} />
                          <div>
                            <p className="font-medium mb-2">Vaccinations</p>
                            <ul className="list-disc list-inside text-gray-600">
                              {selectedPet.vaccinations.map((vax, index) => (
                                <li key={index}>{vax}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <p className="text-gray-600">{selectedPet.medicalHistory}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-2">Personality</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPet.personality.map((trait, index) => (
                          <span
                            key={index}
                            className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-2">Adoption Requirements</h3>
                      <ul className="list-disc list-inside text-gray-600">
                        {selectedPet.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    {!isCenter && !isAdmin && (
                      <button 
                        onClick={() => handleStartAdoption(selectedPet)}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center justify-center gap-2"
                      >
                        <Heart size={20} />
                        Start Adoption Process
                      </button>
                    )}
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