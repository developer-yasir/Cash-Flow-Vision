import React, { useState } from 'react';
import toast from 'react-hot-toast';

const UserProfileForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    // This is a placeholder. Backend API needs to be implemented.
    setIsSubmitting(true);
    toast.error("Updating user profile is not yet implemented on the backend.");
    setIsSubmitting(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    // This is a placeholder. Backend API needs to be implemented.
    setIsSubmitting(true);
    toast.error("Password update is not yet implemented on the backend.");
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-12">
      {/* Profile Information */}
      <div className="border-b border-gray-900/10 pb-12 dark:border-gray-700">
        <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">Profile Information</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">Update your name and email address.</p>
        <form onSubmit={handleProfileSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Name</label>
            <div className="mt-2">
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-gray-100 dark:ring-gray-600 dark:placeholder-gray-400"
                placeholder="e.g., John Doe"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Email address</label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-gray-100 dark:ring-gray-600 dark:placeholder-gray-400"
                placeholder="e.g., john.doe@example.com"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6">
            <button type="button" className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300">Cancel</button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="border-b border-gray-900/10 pb-12 dark:border-gray-700">
        <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">Change Password</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">Update your password. Make sure it's a strong one!</p>
        <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="currentPassword"
                   className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Current Password</label>
            <div className="mt-2">
              <input
                type="password"
                name="currentPassword"
                id="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-gray-100 dark:ring-gray-600 dark:placeholder-gray-400"
              />
            </div>
          </div>
          <div>
            <label htmlFor="newPassword"
                   className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">New Password</label>
            <div className="mt-2">
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-gray-100 dark:ring-gray-600 dark:placeholder-gray-400"
              />
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword"
                   className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Confirm New Password</label>
            <div className="mt-2">
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-gray-100 dark:ring-gray-600 dark:placeholder-gray-400"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6">
            <button type="button" className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300">Cancel</button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Saving...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileForm;
