/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Button, Spinner } from "flowbite-react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { HiOutlineArrowRight } from "react-icons/hi";
import { MapPin, Clock, Sun } from "lucide-react";

export default function Schedule() {
  const [parcelId, setParcelId] = useState("");
  const [parcelData, setParcelData] = useState({
    message: 'Parcel is being tracked.',
    currentStatus: 'In Transit',
    history: [
      {
        date: '2024-12-05',
        time: '10:15:30 AM',
        location: 'Beijing, China',
        status: 'Picked Up',
        LockStatus: true,
        _id: '12345abcde',
      },
      {
        date: '2024-12-06',
        time: '2:45:20 PM',
        location: 'Shanghai, China',
        status: 'In Transit',
        LockStatus: true,
        _id: '67890fghij',
      },
      {
        date: '2024-12-07',
        time: '6:20:10 PM',
        location: 'Dubai, UAE',
        status: 'Arrived at Sorting Facility',
        LockStatus: true,
        _id: '11223klmno',
      },
      {
        date: '2024-12-08',
        time: '11:30:45 PM',
        location: 'Berlin, Germany',
        status: 'Customs Clearance Completed',
        LockStatus: true,
        _id: '44556pqrst',
      },
      {
        date: '2024-12-09',
        time: '3:10:15 PM',
        location: 'Paris, France',
        status: 'In Transit',
        LockStatus: true,
        _id: '77889uvwxy',
      },
      {
        date: '2024-12-10',
        time: '9:25:50 AM',
        location: 'London, UK',
        status: 'Out for Delivery',
        LockStatus: false,
        _id: '99000zabcd',
      },
      {
        date: '2024-12-10',
        time: '2:40:00 PM',
        location: 'London, UK',
        status: 'Delivered',
        LockStatus: false,
        _id: '11223efghi',
      },
    ],
  });
  
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  const [loading, setLoading] = useState(false);
  const MySwal = withReactContent(Swal);

  const handleSubmit = async () => {
    if (!parcelId) {
      MySwal.fire({
        icon: "error",
        title: "Missing Input",
        text: "Please enter a Parcel ID.",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/parcel/trackParcel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parcelId }),
      });

      const data = await res.json();
      console.log(data);
      if (!res.ok || data.message !== "Parcel tracked successfully.") {
        throw new Error(data.message || "Unable to track parcel.");
      }

      setParcelData(data);
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to fetch parcel data.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 px-40 py-10">
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Parcel Tracking</h1>
        <div className="flex items-center space-x-4 mb-6">
          <input
            type="text"
            value={parcelId}
            onChange={(e) => setParcelId(e.target.value)}
            placeholder="Enter Parcel ID"
            className="flex-grow border dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {loading ? (
            <Button>
              <Spinner aria-label="Loading" size="sm" />
              <span className="pl-3">Loading...</span>
            </Button>
          ) : (
            <Button gradientDuoTone="purpleToBlue" onClick={handleSubmit}>
              Track Parcel
              <HiOutlineArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
        {parcelData && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Current Status</h2>
                  <span className="bg-blue-200 dark:bg-blue-600 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-lg">
                    {parcelData.currentStatus}
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center">
                    <MapPin className="mr-2 text-blue-600" />
                    <span>Current Location: {parcelData.history[0].location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 text-green-600" />
                    <span>
                      Last Updated: {parcelData.history[0].date}{" "}
                      {parcelData.history[0].time}
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-4">Parcel Journey</h3>
              <div className="border-l-4 border-blue-500 pl-8 h-96 overflow-y-scroll rounded-md bg-slate-100 dark:bg-gray-800 py-4 pr-5">
                {parcelData.history.map((stop, index) => (
                  <div key={stop._id} className="mb-6 relative">
                    <div
                      className={`absolute -left-[27px] top-2 w-4 h-4 rounded-full ${
                        stop.LockStatus
                          ? "bg-green-500"
                          : "bg-gray-300 dark:bg-gray-500"
                      }`}
                    ></div>
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                      <div className="font-medium">{stop.location}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {stop.status}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {stop.date}, {stop.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img
                src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/google_maps_helpful_hero_1.width-1300.jpg"
                alt="Parcel Route Map"
                className="w-full rounded-lg shadow-md"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
