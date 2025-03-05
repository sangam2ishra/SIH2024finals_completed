/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Button, Label, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Boarding({ showModal, setShowModal }) {
  const [role, setRole] = useState(null);
  const [formData, setFormData] = useState({ level: '', nodeId: '', name: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setError(''); // Reset error when role changes
  };

  const validateForm = () => {
    if (role === 'NODE' && formData.nodeId === '1275') {
      return true;
    }
    setError('Invalid Node ID or missing level selection.');
    
    return false;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="flex flex-col md:flex-row shadow-2xl max-w-4xl bg-white dark:bg-gray-900 rounded-lg">
        {/* Left Section */}
        <div className="flex-1 p-6 bg-gray-200 dark:bg-gray-900 rounded-l-lg">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">ParcelPulse</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Revolutionizing parcel delivery with a dynamic, multi-modal transportation network.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            We ensure efficient delivery across all levels with trust, speed, and transparency.
          </p>
        </div>
        {/* Right Section */}
        <div className="flex-1 p-6 bg-gray-200 dark:bg-gray-900 rounded-r-lg">
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Choose Your Role</h3>
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
              {error}
            </div>
          )}
          <form className="space-y-4">
            <div>
              <Label htmlFor="Level" value="Level" />
              <div className="flex space-x-4">
                <label>
                  <input
                    type="radio"
                    name="level"
                    value="NODE"
                    onChange={handleRoleChange}
                    className="mr-2"
                  />
                  NODE
                </label>
                <label>
                  <input
                    type="radio"
                    name="level"
                    value="USER"
                    onChange={handleRoleChange}
                    className="mr-2"
                  />
                  USER
                </label>
              </div>
            </div>

            {role === 'NODE' && (
              <>
                <div>
                  <Label htmlFor="nodeId" value="Node ID" />
                  <TextInput
                    id="nodeId"
                    name="nodeId"
                    type="text"
                    value={formData.nodeId}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name" value="Node Name" />
                  <TextInput
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            {role === 'USER' ? (
              <Link to="/sign-node" className="w-full">
                <Button type="button" gradientDuoTone="purpleToBlue" className="w-full">
                  Go to Signup
                </Button>
              </Link>
            ) : (
              <Button
                type="button"
                gradientDuoTone="purpleToBlue"
                className="w-full"
                onClick={() => {
                  if (validateForm()) {
                    // Node-specific actions can go here
                    console.log('Node form validated successfully');
                  }
                }}
              >
                Submit
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
