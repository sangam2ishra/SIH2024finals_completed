/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Accordion } from 'flowbite-react';

export default function CustomerSupport() {
  return (
    <div className='mt-10 md:p-20 md:mx-40 min-h-screen'>
      <div className='w-full'>
        <h1 className="text-2xl font-bold mb-6 text-center">Customer Support</h1>
        <p className="mb-10 text-gray-600 dark:text-gray-300 text-center">
          Find answers to your questions or reach out to us for assistance. We're here to help!
        </p>
        <Accordion collapseAll>
          <Accordion.Panel>
            <Accordion.Title>
              <span className="flex items-center">
                <span>How can I track my parcel?</span>
                <span role="img" aria-label="track" className="ml-2" title="Track">
                  📦
                </span>
              </span>
            </Accordion.Title>
            <Accordion.Content>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                To track your parcel, follow these steps:
              </p>
              <ol className="list-decimal pl-5 mb-2 text-gray-500 dark:text-gray-400">
                <li>Visit the ParcelPulse tracking page.</li>
                <li>Enter your unique parcel ID in the tracking field.</li>
                <li>Click the "Track" button to view the current status and estimated delivery time.</li>
                <li>You can also enable notifications for real-time updates.</li>
              </ol>
              <p className="text-gray-500 dark:text-gray-400">
                Need more help? Contact our support team <a href="/contact" className="text-blue-600 dark:text-blue-500 hover:underline">here</a>.
              </p>
            </Accordion.Content>
          </Accordion.Panel>

          <Accordion.Panel>
            <Accordion.Title>
              <span className="flex items-center">
                <span>How do I report a delivery issue?</span>
                <span role="img" aria-label="report" className="ml-2" title="Report">
                  🚨
                </span>
              </span>
            </Accordion.Title>
            <Accordion.Content>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                If you face any issues with your delivery, here's how you can report it:
              </p>
              <ul className="list-disc pl-5 mb-2 text-gray-500 dark:text-gray-400">
                <li>Log in to your ParcelPulse account.</li>
                <li>Navigate to the "My Orders" section and select the problematic parcel.</li>
                <li>Click on "Report Issue" and describe the problem.</li>
                <li>Our support team will review your issue and contact you shortly.</li>
              </ul>
              <p className="text-gray-500 dark:text-gray-400">
                For urgent matters, call our helpline or use our live chat feature.
              </p>
            </Accordion.Content>
          </Accordion.Panel>

          <Accordion.Panel>
            <Accordion.Title>
              <span className="flex items-center">
                <span>How to update my delivery preferences?</span>
                <span role="img" aria-label="preferences" className="ml-2" title="Preferences">
                  ⚙️
                </span>
              </span>
            </Accordion.Title>
            <Accordion.Content>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                To update your delivery preferences:
              </p>
              <ul className="list-disc pl-5 mb-2 text-gray-500 dark:text-gray-400">
                <li>Log in to your account and go to the "Settings" section.</li>
                <li>Click on "Delivery Preferences."</li>
                <li>Choose options like delivery time, location, or notification preferences.</li>
                <li>Save your changes to apply them to your future deliveries.</li>
              </ul>
              <p className="text-gray-500 dark:text-gray-400">
                Need help? Contact us at <a href="mailto:support@parcelpulse.com" className="text-blue-600 dark:text-blue-500 hover:underline">support@parcelpulse.com</a>.
              </p>
            </Accordion.Content>
          </Accordion.Panel>

          <Accordion.Panel>
            <Accordion.Title>
              <span className="flex items-center">
                <span>Contact Us</span>
                <span role="img" aria-label="contact" className="ml-2" title="Contact">
                  ☎️
                </span>
              </span>
            </Accordion.Title>
            <Accordion.Content>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                You can reach our customer support team via:
              </p>
              <ul className="list-disc pl-5 mb-2 text-gray-500 dark:text-gray-400">
                <li>Phone: <strong>+1-800-123-4567</strong></li>
                <li>Email: <a href="mailto:support@parcelpulse.com" className="text-blue-600 dark:text-blue-500 hover:underline">support@parcelpulse.com</a></li>
                <li>Live Chat: Available on our website and app from 9 AM to 6 PM (Mon-Fri).</li>
              </ul>
              <p className="text-gray-500 dark:text-gray-400">
                We’re here to assist you with any questions or concerns.
              </p>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      </div>
    </div>
  );
}
