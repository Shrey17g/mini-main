import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  quantity?: number;
}

type PaymentMethod = 'card' | 'upi' | 'cod';

interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  name: string;
}

interface UPIDetails {
  upiId: string;
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { products } = location.state as { products: Product[] };
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });
  const [upiDetails, setUPIDetails] = useState<UPIDetails>({
    upiId: ''
  });

  const total = products.reduce((sum, product) => sum + (product.price * (product.quantity || 1)), 0);

  const validateCardDetails = () => {
    return (
      cardDetails.cardNumber.length === 16 &&
      cardDetails.expiryDate.length === 5 &&
      cardDetails.cvv.length === 3 &&
      cardDetails.name.length > 0
    );
  };

  const validateUPIDetails = () => {
    return upiDetails.upiId.includes('@') && upiDetails.upiId.length > 3;
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'card' && !validateCardDetails()) {
      alert('Please fill in all card details correctly');
      return;
    }

    if (paymentMethod === 'upi' && !validateUPIDetails()) {
      alert('Please enter a valid UPI ID');
      return;
    }

    alert('Thank you for your purchase from PawMart! Your contribution helps support our local pet adoption centers. Together, we can make a difference in the lives of pets in need.');
    navigate('/pawmart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              {products.map((product) => (
                <div key={product.id} className="flex items-center gap-4 mb-4 pb-4 border-b">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-gray-600">
                      ${product.price} × {product.quantity || 1}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${(product.price * (product.quantity || 1)).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="flex justify-between items-center text-xl font-semibold mt-4">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <p className="mt-4 text-sm text-indigo-600">
                50% of your purchase will be donated to local pet adoption centers.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>UPI Payment</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <form onSubmit={handleCheckout} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value.replace(/\D/g, '') })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="MM/YY"
                        value={cardDetails.expiryDate}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        maxLength={3}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '') })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      required
                    />
                  </div>
                </form>
              )}

              {paymentMethod === 'upi' && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="username@upi"
                      value={upiDetails.upiId}
                      onChange={(e) => setUPIDetails({ upiId: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="mt-6">
                  <p className="text-gray-600">
                    Pay with cash upon delivery. Our delivery partner will collect the payment at your doorstep.
                  </p>
                </div>
              )}

              <button
                onClick={handleCheckout}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold mt-6"
              >
                {paymentMethod === 'cod' ? 'Place Order' : `Pay ${total.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}