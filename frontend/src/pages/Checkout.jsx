import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiCheck, FiCreditCard, FiTruck, FiPackage } from 'react-icons/fi';
import { selectCartItems, selectCartTotal, clearCartLocal } from '../redux/slices/cartSlice';
import { createOrder } from '../redux/slices/orderSlice';
import { addAddress } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';
import Loading from '../components/common/Loading';

const steps = [
  { id: 1, name: 'Shipping', icon: FiTruck },
  { id: 2, name: 'Payment', icon: FiCreditCard },
  { id: 3, name: 'Review', icon: FiPackage },
];

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const { isLoading } = useSelector((state) => state.orders);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    if (user?.addresses?.length > 0) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setSelectedAddress(defaultAddr._id);
    }
  }, [user]);

  const shippingCost = cartTotal >= 100 ? 0 : 10;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shippingCost + tax;

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addAddress(addressForm)).unwrap();
      toast.success('Address added successfully');
      setIsAddingAddress(false);
      setAddressForm({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'United States',
      });
    } catch (error) {
      toast.error(error || 'Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    const address = user.addresses.find((a) => a._id === selectedAddress);
    
    if (!address) {
      toast.error('Please select a shipping address');
      return;
    }

    try {
      const orderData = {
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          street: address.street,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
        },
        paymentMethod,
        paymentResult: {
          id: `demo_${Date.now()}`,
          status: 'completed',
          updateTime: new Date().toISOString(),
        },
      };

      const order = await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCartLocal());
      toast.success('Order placed successfully!');
      navigate(`/order-success/${order._id}`);
    } catch (error) {
      toast.error(error || 'Failed to place order');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>
            
            {user?.addresses?.length > 0 && !isAddingAddress ? (
              <div className="space-y-4">
                {user.addresses.map((address) => (
                  <label
                    key={address._id}
                    className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedAddress === address._id
                        ? 'border-accent bg-accent/5'
                        : 'border-secondary-200 hover:border-secondary-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === address._id}
                        onChange={() => setSelectedAddress(address._id)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium text-secondary-900">{address.fullName}</p>
                        <p className="text-secondary-600 text-sm mt-1">
                          {address.street}, {address.city}, {address.state} {address.postalCode}
                        </p>
                        <p className="text-secondary-600 text-sm">{address.country}</p>
                        <p className="text-secondary-500 text-sm mt-1">Phone: {address.phone}</p>
                        {address.isDefault && (
                          <span className="inline-block mt-2 px-2 py-0.5 bg-accent text-secondary-900 text-xs rounded">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="w-full py-3 border-2 border-dashed border-secondary-300 rounded-xl text-secondary-600 hover:border-accent hover:text-accent transition-colors"
                >
                  + Add New Address
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddAddress} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name</label>
                    <input
                      type="text"
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Street Address</label>
                  <input
                    type="text"
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="label">City</label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">State</label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Postal Code</label>
                    <input
                      type="text"
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary">
                    Save Address
                  </button>
                  {user?.addresses?.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="btn-ghost"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
            <div className="space-y-4">
              <label
                className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'stripe'
                    ? 'border-accent bg-accent/5'
                    : 'border-secondary-200 hover:border-secondary-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-secondary-900">Credit / Debit Card</p>
                    <p className="text-sm text-secondary-500">Pay securely with Stripe</p>
                  </div>
                  <div className="flex gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/100px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/100px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
                  </div>
                </div>
              </label>

              <label
                className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'paypal'
                    ? 'border-accent bg-accent/5'
                    : 'border-secondary-200 hover:border-secondary-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-secondary-900">PayPal</p>
                    <p className="text-sm text-secondary-500">Pay with your PayPal account</p>
                  </div>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/100px-PayPal.svg.png" alt="PayPal" className="h-6" />
                </div>
              </label>

              <label
                className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-accent bg-accent/5'
                    : 'border-secondary-200 hover:border-secondary-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div>
                    <p className="font-medium text-secondary-900">Cash on Delivery</p>
                    <p className="text-sm text-secondary-500">Pay when you receive</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        );

      case 3:
        const address = user?.addresses?.find((a) => a._id === selectedAddress);
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Review Your Order</h2>
            
            {/* Shipping Address */}
            <div className="mb-6">
              <h3 className="font-medium text-secondary-900 mb-2">Shipping Address</h3>
              {address && (
                <div className="p-4 bg-secondary-50 rounded-lg">
                  <p className="font-medium">{address.fullName}</p>
                  <p className="text-secondary-600 text-sm">
                    {address.street}, {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p className="text-secondary-600 text-sm">{address.country}</p>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="font-medium text-secondary-900 mb-2">Payment Method</h3>
              <div className="p-4 bg-secondary-50 rounded-lg">
                <p className="capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}</p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-medium text-secondary-900 mb-2">Order Items</h3>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 p-3 bg-secondary-50 rounded-lg">
                    <img
                      src={item.product?.thumbnail || item.product?.images?.[0]}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-secondary-900 line-clamp-1">{item.product?.name}</p>
                      <p className="text-sm text-secondary-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${((item.price || item.product?.price) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-8 overflow-x-hidden w-full">
      <div className="container-custom max-w-5xl">
        {/* Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    currentStep >= step.id
                      ? 'bg-accent text-secondary-900'
                      : 'bg-secondary-200 text-secondary-500'
                  }`}
                >
                  {currentStep > step.id ? (
                    <FiCheck />
                  ) : (
                    <step.icon />
                  )}
                  <span className="font-medium hidden sm:block">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      currentStep > step.id ? 'bg-accent' : 'bg-secondary-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-card p-6">
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-secondary-100">
                {currentStep > 1 ? (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="btn-outline"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <button
                    onClick={() => {
                      if (currentStep === 1 && !selectedAddress) {
                        toast.error('Please select or add a shipping address');
                        return;
                      }
                      setCurrentStep(currentStep + 1);
                    }}
                    className="btn-primary"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                    className="btn-primary min-w-[150px]"
                  >
                    {isLoading ? <Loading size="small" color="#232F3E" /> : 'Place Order'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-card p-6 sticky top-28">
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <hr className="border-secondary-100" />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-secondary-900">Total</span>
                  <span className="font-bold text-secondary-900">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

