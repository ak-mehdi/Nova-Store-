import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { updateProfile, addAddress, updateAddress, deleteAddress } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    isDefault: false,
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(profileData)).unwrap();
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error(error || 'Failed to update profile');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addAddress(addressForm)).unwrap();
      toast.success('Address added successfully');
      setIsAddingAddress(false);
      resetAddressForm();
    } catch (error) {
      toast.error(error || 'Failed to add address');
    }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateAddress({ addressId: editingAddressId, addressData: addressForm })).unwrap();
      toast.success('Address updated successfully');
      setEditingAddressId(null);
      resetAddressForm();
    } catch (error) {
      toast.error(error || 'Failed to update address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await dispatch(deleteAddress(addressId)).unwrap();
        toast.success('Address deleted successfully');
      } catch (error) {
        toast.error(error || 'Failed to delete address');
      }
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      isDefault: false,
    });
  };

  const startEditAddress = (address) => {
    setEditingAddressId(address._id);
    setAddressForm({
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    });
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-8 overflow-x-hidden w-full">
      <div className="container-custom">
        <h1 className="text-3xl font-heading font-bold text-secondary-900 mb-8">
          My Account
        </h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-card p-4">
              {/* User Info */}
              <div className="flex items-center gap-4 p-4 border-b border-secondary-100">
                <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-secondary-900">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-secondary-900">{user?.name}</p>
                  <p className="text-sm text-secondary-500">{user?.email}</p>
                </div>
              </div>

              {/* Tabs */}
              <nav className="mt-4 space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-accent text-secondary-900'
                      : 'text-secondary-600 hover:bg-secondary-50'
                  }`}
                >
                  <FiUser />
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'addresses'
                      ? 'bg-accent text-secondary-900'
                      : 'text-secondary-600 hover:bg-secondary-50'
                  }`}
                >
                  <FiMapPin />
                  Addresses
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-card p-6">
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-secondary-900">Profile Information</h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn-ghost text-sm"
                      >
                        <FiEdit2 className="mr-2" />
                        Edit
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
                      <div>
                        <label className="label">Full Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="label">Email Address</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="label">Phone Number</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="input"
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-primary">
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setProfileData({
                              name: user?.name || '',
                              email: user?.email || '',
                              phone: user?.phone || '',
                            });
                          }}
                          className="btn-ghost"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <FiUser className="text-secondary-400" />
                        <div>
                          <p className="text-sm text-secondary-500">Full Name</p>
                          <p className="font-medium text-secondary-900">{user?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <FiMail className="text-secondary-400" />
                        <div>
                          <p className="text-sm text-secondary-500">Email Address</p>
                          <p className="font-medium text-secondary-900">{user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <FiPhone className="text-secondary-400" />
                        <div>
                          <p className="text-sm text-secondary-500">Phone Number</p>
                          <p className="font-medium text-secondary-900">{user?.phone || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-secondary-900">Saved Addresses</h2>
                    {!isAddingAddress && !editingAddressId && (
                      <button
                        onClick={() => setIsAddingAddress(true)}
                        className="btn-primary text-sm"
                      >
                        <FiPlus className="mr-2" />
                        Add Address
                      </button>
                    )}
                  </div>

                  {(isAddingAddress || editingAddressId) && (
                    <form
                      onSubmit={editingAddressId ? handleUpdateAddress : handleAddAddress}
                      className="mb-6 p-4 bg-secondary-50 rounded-xl space-y-4"
                    >
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
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={addressForm.isDefault}
                          onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                          className="w-4 h-4 rounded border-secondary-300 text-accent focus:ring-accent"
                        />
                        <span className="text-secondary-600">Set as default address</span>
                      </label>
                      <div className="flex gap-3">
                        <button type="submit" className="btn-primary">
                          {editingAddressId ? 'Update Address' : 'Save Address'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingAddress(false);
                            setEditingAddressId(null);
                            resetAddressForm();
                          }}
                          className="btn-ghost"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Addresses List */}
                  <div className="space-y-4">
                    {user?.addresses?.length > 0 ? (
                      user.addresses.map((address) => (
                        <div
                          key={address._id}
                          className="p-4 border border-secondary-200 rounded-xl"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-secondary-900">
                                {address.fullName}
                                {address.isDefault && (
                                  <span className="ml-2 px-2 py-0.5 bg-accent text-secondary-900 text-xs rounded">
                                    Default
                                  </span>
                                )}
                              </p>
                              <p className="text-secondary-600 text-sm mt-1">
                                {address.street}, {address.city}, {address.state} {address.postalCode}
                              </p>
                              <p className="text-secondary-600 text-sm">{address.country}</p>
                              <p className="text-secondary-500 text-sm mt-1">Phone: {address.phone}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEditAddress(address)}
                                className="p-2 text-secondary-500 hover:text-accent transition-colors"
                              >
                                <FiEdit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(address._id)}
                                className="p-2 text-secondary-500 hover:text-red-500 transition-colors"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-secondary-500 text-center py-8">
                        No addresses saved yet.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

