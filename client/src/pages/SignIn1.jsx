/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react";
import { Alert } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { Button, TextInput, Label } from "flowbite-react";
import { signInSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function SignIn1() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nodeId: "",
    Level: "",
    name: "",
    level1Link: "",
    location: { latitude: 0, longitude: 0 },
    postOffices: [],
    transportationModes: [],
    storageCapacity: "",
    currentLoad: 0,
  });

  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  // Automatically fetch device location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevData) => ({
            ...prevData,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          }));
        },
        (err) => {
          setError(
            "Unable to fetch location. Please enable location services."
          );
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // console.log("handleChange ");
    // console.log("name -- ",name);
    // console.log("value -- ",value);
    // console.log("type -- ",type);
    // console.log("checked -- ",checked);

    // console.log("Form ki mkc ",formData.location);

    if (name === "latitude" || name === "longitude") {
      setFormData((prevData) => ({
        ...prevData,
        location: {
          ...prevData.location,
          [name]: parseFloat(value), // Ensure the value is stored as a number
        },
      }));
    } else if (type === "checkbox" && name === "transportationModes") {
      setFormData((prevData) => ({
        ...prevData,
        transportationModes: checked
          ? [...prevData.transportationModes, value]
          : prevData.transportationModes.filter((mode) => mode !== value),
      }));
    } else if (name === "postOffices") {
      setFormData((prevData) => ({
        ...prevData,
        postOffices: value.split(",").map((office) => office.trim()),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);

    alert("Form submitted successfully!");

    // api endpoint

    try {
      setLoading(true);
      setErrorMessage(null);
      
      const res = await fetch("/api/auth/signin1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        dispatch(signInSuccess(data.data));
        signInSuccess(data.data);
        console.log(data.data.nodeCategory);
          
          if(data.data.nodeCategory==1){
            console.log("HII1");
            navigate("/level1profile"); 
          }else{
            console.log("HII2");
            navigate("/level2profile"); 
          }
      //   navigate("/level2profile"); // go to profile page
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }

    // here we will updat our redux things
    // redirect to
  };

  return (
    <div className="min-h-screen mt-10 bg-gray-100 dark:bg-gray-800">
      <div className="flex  max-w-7xl mx-auto flex-col md:flex-row md:items-center gap-5 mt-36 p-10">
        {/* Left Section */}
        <div className="flex-1 shadow-2xl bg-gray-200 dark:bg-gray-900 rounded-lg h-96 mt-1">
          <Link to="/" className="px-2 font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-blue-700 via-white to-blue-800 rounded-lg text-black font-bold">
              ParcelPulse
            </span>
            <br />
            <br />
            <p className="px-4">Revolutionizing Parcel Delivery</p>
          </Link>
          <p className="text-sm mt-5  px-3 text-gray-700 dark:text-gray-300">
            ParcelPulse revolutionizes parcel delivery with a dynamic,
            multi-modal transportation network optimized for speed, cost, and
            customer convenience. It seamlessly connects main hubs (airports,
            seaports) and city hubs, ensuring efficient delivery across all
            levels.
          </p>
          <p className="text-sm mt-2 px-3 text-gray-700 dark:text-gray-300">
            ParcelPulse not only delivers parcels but also delivers trust,
            speed, and transparency, redefining logistics for the modern era.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex-1 bg-gray-200 dark:bg-gray-900 shadow-2xl rounded-lg p-4">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
           Node SignIn
          </h1>
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4 items-center">
          <Label htmlFor="Level" value="Level" className="bg-blue-600 text-white rounded-md px-2 py-1 font-semibold" />
            <div>
              <label>
                <input
                  type="radio"
                  name="Level"
                  value="1"
                  onChange={handleChange}
                  className="mr-2 rounded-md size-6"
                />
                1
              </label>
              <label className="ml-4">
                <input
                  type="radio"
                  name="Level"
                  value="2"
                  onChange={handleChange}
                  className="mr-2 rounded-md size-6"
                />
                2
              </label>
            </div>
           
           
            <div>
              
              <Label htmlFor="nodeId" value="Node ID" />
              <TextInput
                id="nodeId"
                name="nodeId"
                type="text"
                value={formData.nodeId}
                onChange={handleChange}
                required
                shadow
                color="gray"
                className="shadow-2xl"
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
                shadow
                color="gray"
                className="shadow-2xl"
              />
            </div>
            <Button
              type="submit"
              onSubmit={handleSubmit}
              gradientDuoTone="purpleToBlue"
              className="shadow-2xl w-1/2 items-center mt-4"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
