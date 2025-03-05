/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Alert,
  Button,
  Label,
  Spinner,
  TextInput,
  FileInput,
  Modal,
} from "flowbite-react";
import { Datepicker } from "flowbite-react";
import { Truck, Clock, DollarSign, Calendar } from "lucide-react";
import { jsPDF } from "jspdf";
// for parcel image
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app1 } from "../firebase";

import Select from "react-select";
import { State, City } from "country-state-city";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// ----------

export default function BookTrip() {
  const initialFormData = {
    senderName: "",
    senderPhone: null,
    senderFlatNo: null,
    senderLocality: null,
    senderCity: null,
    senderState: null,
    senderPinCode: null,
    receiverName: null,
    receiverPhone: null,
    receiverFlatNo: null,
    receiverLocality: null,
    receiverCity: null,
    receiverState: null,
    receiverPinCode: null,
    parcelWeight: null,
    parcelLength: null,
    parcelWidth: null,
    parcelHeight: null,
  };

  // const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [Deadline, setDeadline] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [cities1, setCities1] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedState1, setSelectedState1] = useState(null);
  const [selectedCity1, setSelectedCity1] = useState(null);
  
  const [measurements, setMeasurements] = useState([]); 

  const [type, setType] = useState("");
  const navigate = useNavigate();
  const filePickerRef = useRef();

  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(null);

  const generatePDF = (data) => {
    console.log(data);
    const doc = new jsPDF();

    // Header Section
    doc.setFillColor(230, 230, 230); // Light gray background for header
    doc.rect(0, 0, 210, 20, "F"); // Header background
    doc.setTextColor(0, 0, 0); // Black text
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("* ParcelPulse *", 105, 12, { align: "center" });

    // Section Title Styling Function
    const addSectionTitle = (title, yPosition) => {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(50, 50, 50); // Dark gray text
      doc.text(title, 15, yPosition);
      doc.setLineWidth(0.3);
      doc.line(15, yPosition + 2, 200, yPosition + 2); // Underline
    };

    // General Styling
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black text
    doc.setFont("helvetica", "normal");

    // Parcel Details Section
    addSectionTitle("|| Parcel Booking Confirmation", 30);
    doc.text(`Parcel ID: ${data.parcelId}`, 15, 40);

    // Sender Details
    addSectionTitle("Sender Details", 50);
    doc.text(`1. Name: ${data.senderName}`, 20, 60);
    doc.text(`2. Contact: ${data.senderPhone}`, 20, 65);
    doc.text(`3. Address:`, 20, 70);
    doc.text(`   ${data.senderFlatNo}, ${data.senderLocality},`, 25, 75);
    doc.text(
      `   ${selectedCity.label}, ${selectedState.label} - ${data.senderPinCode}`,
      25,
      80
    );

    // Receiver Details
    addSectionTitle("Receiver Details", 90);
    doc.text(`1. Name: ${data.receiverName}`, 20, 100);
    doc.text(`2. Contact: ${data.receiverPhone}`, 20, 105);
    doc.text(`3. Address:`, 20, 110);
    doc.text(`   ${data.receiverFlatNo}, ${data.receiverLocality},`, 25, 115);
    doc.text(
      `   ${selectedCity1.label}, ${selectedState1.label} - ${data.receiverPinCode}`,
      25,
      120
    );

    // Parcel Details Section
    addSectionTitle("Parcel Details", 130);
    doc.text(`1. Weight: ${data.parcelWeight} kg`, 20, 140);
    doc.text(
      `2. Dimensions: ${data.parcelLength}x${data.parcelWidth}x${data.parcelHeight} cm`,
      20,
      145
    );
    doc.text(`3. Shipping Date: ${data.date}`, 20, 150);
    doc.text(`4. Delivery Option: ${selectedDeliveryOption.type}`, 20, 155);

    // Delivery Option
    addSectionTitle("Delivery Option", 165);
    doc.text(`1. Type: ${selectedDeliveryOption.type}`, 20, 175);
    doc.text(`2. Description: ${selectedDeliveryOption.description}`, 20, 180);
    doc.text(`3. Cost: ${selectedDeliveryOption.cost}`, 20, 185);
    doc.text(
      `4. Estimated Time: ${selectedDeliveryOption.estimatedTime}`,
      20,
      190
    );

    // Payment Details
    addSectionTitle("Payment Details", 200);
    doc.text(`1. Payment Type: Offline `, 20, 210);

    // Footer Section with Date, Time, and Copyright
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Grey text
    doc.text(`Generated on: ${formattedDate} at ${formattedTime}`, 105, 280, {
      align: "center",
    });
    doc.text("© 2024 ParcelPulse. All rights reserved.", 105, 285, {
      align: "center",
    });

    // Save PDF
    doc.save(`Parcel_${data.parcelId}.pdf`);
  };

  const deliveryOptions = [
    {
      type: "Speed Post",
      icon: "SpeedPostIcon", // Replace with the appropriate icon
      description: "Fastest delivery option",
      estimatedTime: "2-3 Days",
      cost: 50.0,
    },
    {
      type: "Ordinary Post",
      icon: "OrdinaryPostIcon", // Replace with the appropriate icon
      description: "Cheapest delivery option",
      estimatedTime: "7-10 Days",
      cost: 15.0,
    },
    {
      type: "Parcel Post",
      icon: "ParcelPostIcon", // Replace with the appropriate icon
      description: "Balanced delivery option",
      estimatedTime: "4-5 Days",
      cost: 25.0,
    },
  ];
  const handleDeliveryOptionConfirm = () => {
    setIsDeliveryModalOpen(false);
  };

  const [images, setImages] = useState({
    front: null,
    side1: null,
    side2: null,
    back: null,
  });
  const [imageUrls, setImageUrls] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [length, setLength] = useState(null);
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);

  const MySwal = withReactContent(Swal);
  const handleChange = (e) => {
    console.log("Form Data ---");
    console.log(formData);
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleDatepickerChange = (date) => {
    setSelectedDate(date);
  };
  const handleDatepickerChange1 = (date) => {
    const deadline = new Date(date);

    // Extract the date parts
    const day = String(deadline.getDate()).padStart(2, "0");
    const month = String(deadline.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = deadline.getFullYear();

    // Construct the formatted date string
    const formattedDate = `${day}/${month}/${year}`;

    console.log(formattedDate); // Outputs: '11/12/2024
    // console.log("Date deadline", date);
    setDeadline(formattedDate);
    console.log(Deadline);
  };

  // // Function to handle file input changes
  // const handleImageChange = (e) => {
  //   const { id } = e.target;
  //   setImages((prev) => ({ ...prev, [id]: e.target.files[0] }));
  // };

  const handleImageChange1 = async (event) => {
    const { id } = event.target;
    const file = event.target.files[0];
  
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
  
      try {
        // Reset progress and previous error
        setUploadProgress((prev) => ({ ...prev, [id]: 0 }));
        setErrorMessage(""); // Clear previous error
  
        // Upload to Flask server (running on port 5000)
        const response = await axios.post("http://localhost:5000/measure", formData, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress((prev) => ({ ...prev, [id]: percentCompleted }));
          },
        });
  
        // Save measurement results
        setMeasurements(response.data.measurements || []);
        // setlength(response.data.measurements[height]);
        setWidth(response.data.measurements[width]);

        // Save image URL locally for preview
        const url = URL.createObjectURL(file);
        setImageUrls((prev) => ({ ...prev, [id]: url }));
  
        // Reset form after successful upload if necessary
        // event.target.reset(); // Optional, to clear the file input after upload
      } catch (error) {
        console.error("Error uploading file:", error);
        setErrorMessage("Error uploading the file. Please try again."); // Display error to user
      } finally {
        // Reset progress after upload completes
        setUploadProgress((prev) => ({ ...prev, [id]: null }));
      }
    }
  };  

  const handleImageChange2 = async (event) => {
    const { id } = event.target;
    const file = event.target.files[0];
  
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
  
      try {
        // Reset progress and previous error
        setUploadProgress((prev) => ({ ...prev, [id]: 0 }));
        setErrorMessage(""); // Clear previous error
  
        // Upload to Flask server (running on port 5000)
        const response = await axios.post("http://localhost:5000/measure", formData, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress((prev) => ({ ...prev, [id]: percentCompleted }));
          },
        });
  
        // Save measurement results
        setMeasurements(response.data.measurements || []);
        
        setWidth(response.data.measurements[width]);
        setHeight(response.data.measurements[height]);

        // Save image URL locally for preview
        const url = URL.createObjectURL(file);
        setImageUrls((prev) => ({ ...prev, [id]: url }));
  
        // Reset form after successful upload if necessary
        // event.target.reset(); // Optional, to clear the file input after upload
      } catch (error) {
        console.error("Error uploading file:", error);
        setErrorMessage("Error uploading the file. Please try again."); // Display error to user
      } finally {
        // Reset progress after upload completes
        setUploadProgress((prev) => ({ ...prev, [id]: null }));
      }
    }
  };  

  // Function to upload individual images
  const uploadImage = async (image, key) => {
    if (!image) return null;

    const storage = getStorage(app1);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, `parcel_images/${key}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prev) => ({
            ...prev,
            [key]: progress.toFixed(0),
          }));
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  // Function to upload all images
  const uploadAllImages = async () => {
    setUploading(true);
    setUploadError(null);

    try {
      const urls = { ...imageUrls }; // Use existing URLs to avoid re-upload
      for (const [key, image] of Object.entries(images)) {
        if (image && !urls[key]) {
          urls[key] = await uploadImage(image, key);
        }
      }
      setImageUrls(urls);
      setFormData((prev) => ({ ...prev, parcelImages: urls }));
    } catch (error) {
      setUploadError("Failed to upload one or more images.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (Object.values(images).some((img) => img !== null)) {
      uploadAllImages();
    }
  }, [images]);

  const handleSubmit = async () => {
    console.log("Form Submitted ....");
    
    try {
      console.log("Entereed ----");
      setLoading(true);
      setErrorMessage(null);

      console.log(formData);
      console.log("Seleceted delievery options  -----");
      console.log(selectedDeliveryOption);
      console.log("HII 0 ");

      const finalData = {
        sender: {
          name: formData.senderName,
          address: {
            flatHouseNo: formData.senderFlatNo,
            street: formData.senderLocality,
            city: selectedCity.label,
            state: selectedState.label,
            pinCode: formData.senderPinCode,
          },
          contact: {
            emailId: "johndoe@example.com",
            phoneNumber: formData.senderPhone,
          },
        },
        receiver: {
          name: formData.receiverName,
          address: {
            flatHouseNo: formData.receiverFlatNo,
            street: formData.receiverLocality,
            city: selectedCity1.label,
            state: selectedState1.label,
            pinCode: formData.receiverPinCode,
          },
          contact: {
            emailId: "janesmith@example.com",
            phoneNumber: formData.receiverPhone,
          },
        },
        currentStatus: "Processing",
        deliveryType: selectedDeliveryOption.type || "Fastest",
        deadline: Deadline,
        weight: formData.parcelWeight,
        dimensions: {
          length: formData.parcelLength,
          width: formData.parcelWeight,
          height: formData.parcelHeight,
        },
        predictedDeliveryTime: "2024-12-10T12:00:00Z",
        history: [
          {
            date: "2024-12-05",
            time: "08:00:00",
            location: "Springfield Hub",
            status: "Processing",
            LockStatus: true,
          },
        ],
      };

      console.log("Hii 1");
      console.log("formData");

      console.log(formData);

      console.log(finalData);

      // generatePDF({ ...finalData, parcelId: 123456 });

      // return;

      const res = await fetch("/api/parcel/createNewParcel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      const data = await res.json();
      console.log(res);
      console.log(data);
      console.log(res.status);
      if (res.status !== 201) {
        setLoading(false);
        return setErrorMessage(data.message);
      }
      console.log(res.Response);
      setLoading(false);

      if (res.ok) {
        console.log("generate pdf");
        console.log(data.parcel.parcelId);
        generatePDF({ ...formData, parcelId: data.parcel.parcelId });
        MySwal.fire({
          icon: "success",
          title: "Parcel Booked ",
          text: "Please! Track Your Parcel for further Status",
        });

        // navigate("/");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
    // Reset the form data to null after successful submission
    setFormData(initialFormData);
    setSelectedDate("");
    setSelectedDeliveryOption(null);

    console.log("Form submitted successfully!");
  };
  const openImagePreview = (url) => {
    setImagePreview(url);
    setIsModalOpen(true);
  };

  useEffect(() => {
    // Fetch all states of India
    const allStates = State.getStatesOfCountry("IN");
    console.log("States Data:", allStates); // Debugging data

    const formattedStates = allStates.map((state) => ({
      label: state.name,
      value: state.isoCode, // Use isoCode for fetching cities
    }));

    setStates(formattedStates);
  }, []);

  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);

    // Fetch cities for the selected state
    const allCities = City.getCitiesOfState("IN", selectedOption.value);
    console.log(`Cities in State (${selectedOption.value}):`, allCities); // Debugging data

    const formattedCities = allCities.map((city) => ({
      label: city.name,
      value: city.name,
    }));

    setCities(formattedCities);
  };
  const handleStateChange1 = (selectedOption) => {
    setSelectedState1(selectedOption);

    // Fetch cities for the selected state
    const allCities = City.getCitiesOfState("IN", selectedOption.value);
    console.log(`Cities in State (${selectedOption.value}):`, allCities); // Debugging data

    const formattedCities = allCities.map((city) => ({
      label: city.name,
      value: city.name,
    }));

    setCities1(formattedCities);
  };

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
  };
  const handleCityChange1 = (selectedOption) => {
    setSelectedCity1(selectedOption);
  };

  return (
    <div className="mt-10">
      <div className="grid gap-0 bg-slate-200 dark:bg-slate-600">
        <div className="h-[40px] bg-cover bg-center">
          <div className="flex flex-col gap justify-center items-center h-full bg-gray-900 bg-opacity-50 dark:bg-gray-700 dark:bg-opacity-60">
            <div className="p-4 w-full bg-gradient-to-r  from-blue-700 via-slate-200 to-blue-800 rounded-lg text-black font-bold text-2xl dark:text-white">
              <div className=" text-center dark:text-black">
                Parcel Booking
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-screen mt-3 ">
          <div className="max-w-4xl mx-auto p-6 bg-slate-300 rounded-lg shadow-2xl dark:bg-gray-500">
            <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
              {/* Source Details (Left Half) */}
              <div className="space-y-4 border-r-2 pr-6 dark:border-gray-600">
                <h2 className="text-xl font-bold mb-4 text-black dark:text-slate-200">
                  Sender Details
                </h2>
                <div>
                  <Label value="Full Name" />
                  <TextInput
                    type="text"
                    placeholder="Sender's Name"
                    id="senderName"
                    onChange={handleChange}
                    required
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
                <div>
                  <Label value="Phone Number" />
                  <TextInput
                    type="tel"
                    placeholder="Contact no."
                    id="senderPhone"
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    minLength="10" // Enforces a minimum length of 10
                    maxLength="10" // Ensures no more than 10 digits
                    required
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
                <div>
                  <Label value="Email " />
                  <TextInput
                    type="email"
                    placeholder="email id."
                    id="senderEmail"
                    onChange={handleChange}
                    
                    // required
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
                <div>
                  <Label value="Flat/House No." />
                  <TextInput
                    type="text"
                    placeholder="Flat/House No"
                    id="senderFlatNo"
                    onChange={handleChange}
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                    required
                  />
                </div>
                <div>
                  <Label value="Street/Locality" />
                  <TextInput
                    type="text"
                    placeholder="Street/Locality"
                    id="senderLocality"
                    onChange={handleChange}
                    required
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
                <div>
                  <Label value="State" />
                  <Select
                    type="text"
                    options={states}
                    value={selectedState}
                    placeholder="State"
                    id="senderState"
                    onChange={handleStateChange}
                    required
                    className="dark:bg-slate-200 dark:text-black rounded-lg"
                  />
                </div>
                <div>
                  <Label value="City" />
                  <Select
                    value={selectedCity}
                    options={cities}
                    type="text"
                    placeholder="City"
                    id="senderCity"
                    onChange={handleCityChange}
                    required
                    isDisabled={!selectedState}
                    className="dark:bg-gray-700  dark:text-black rounded-2xl"
                  />
                </div>

                <div>
                  <Label value="PIN Code" />
                  <TextInput
                    type="text"
                    placeholder="PIN Code"
                    id="senderPinCode"
                    onChange={handleChange}
                    pattern="[0-9]{6}"
                    required
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
              </div>

              {/* Destination Details (Right Half) */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4 text-black dark:text-slate-200">
                  Receiver Details
                </h2>
                <div>
                  <Label value="Full Name" />
                  <TextInput
                    type="text"
                    placeholder="Receiver's Name"
                    id="receiverName"
                    onChange={handleChange}
                    required
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
                <div>
                  <Label value="Phone Number" />
                  <TextInput
                    type="tel"
                    placeholder="Contact No."
                    id="receiverPhone"
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    minLength="10" // Enforces a minimum length of 10
                    maxLength="10" // Ensures no more than 10 digits
                    required
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
                <div>
                  <Label value="Email " />
                  <TextInput
                    type="email"
                    placeholder="email id."
                    id="recevierEmail"
                    onChange={handleChange}
                    
                    // required
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
                <div>
                  <Label value="Flat/House No." />
                  <TextInput
                    type="text"
                    placeholder="Flat/House No."
                    id="receiverFlatNo"
                    onChange={handleChange}
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                    required
                  />
                </div>
                <div>
                  <Label value="Street/Locality" />
                  <TextInput
                    type="text"
                    placeholder="Street/Locality"
                    id="receiverLocality"
                    onChange={handleChange}
                    required
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
                <div>
                  <Label value="State" />
                  <Select
                    options={states}
                    type="text"
                    value={selectedState1}
                    placeholder="State"
                    id="receiverState"
                    onChange={handleStateChange1}
                    required
                    className="dark:bg-gray-700 dark:text-black rounded-lg"
                  />
                </div>
                <div>
                  <Label value="City" />
                  <Select
                    type="text"
                    options={cities1}
                    placeholder="City"
                    value={selectedCity1}
                    isDisabled={!selectedState1}
                    id="receiverCity"
                    onChange={handleCityChange1}
                    required
                    className= "dark:bg-gray-700 dark:text-black rounded-lg"
                  />
                </div>

                <div>
                  <Label value="PIN Code" />
                  <TextInput
                    type="text"
                    placeholder="PIN Code"
                    id="receiverPinCode"
                    onChange={handleChange}
                    pattern="[0-9]{6}"
                    required
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
              </div>

              {/* Parcel Details Section */}
              <div className="col-span-2 mt-6 space-y-4">
                <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  Parcel Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label value="Parcel Weight (kg)" />
                    <TextInput
                      type="number"
                      placeholder="Parcel Weight (kg)"
                      id="parcelWeight"
                      onChange={handleChange}
                      step="0.1"
                      min="0"
                      required
                      className="dark:bg-gray-700 dark:text-white rounded-lg"
                    />
                  </div>
                
                </div>

                <div>
                  <Label value="Shipping Date" />
                  <Datepicker
                    id="shippingDate"
                    name="shippingDate"
                    onChange={handleChange}
                    value={selectedDate}
                    onSelectedDateChanged={handleDatepickerChange}
                    className="dark:bg-gray-700 dark:text-white rounded-lg w-1/2"
                  />
                </div>

                {/* Delivery Option Button */}
                <div>
                  <Button
                    gradientDuoTone="purpleToBlue"
                    variant="contained"
                    color="primary"
                    onClick={() => setIsDeliveryModalOpen(true)}
                  >
                    Select Delivery Option
                  </Button>
                  {selectedDeliveryOption && (
                    <div className="mt-2">
                      <p>
                        <strong className="text-black">Selected Option:</strong>{" "}
                        {selectedDeliveryOption.type} ($
                        {selectedDeliveryOption.cost.toFixed(2)})
                      </p>
                    </div>
                  )}
                </div>

                {/* Image Upload Section */}
                

                {/* Submit Button */}
                {/* Payment Buttons */}
                <div className="col-span-1 flex justify-between mt-6">
                  <Button
                    gradientDuoTone="purpleToBlue"
                    type="submit"
                    disabled={loading}
                    onClick={handleSubmit}
                    className="mx-auto w-1/2"
                    outline
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" />
                        <span className="pl-3">Loading...</span>
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </div>

                {/* Delivery Options Modal */}
                <Modal
                  show={isDeliveryModalOpen}
                  onClose={() => setIsDeliveryModalOpen(false)}
                  size="lg"
                >
                  <Modal.Header>
                    <h1
                      id="delivery-options-title"
                      className="text-2xl font-bold text-blue-900"
                    >
                      Choose Your Delivery Option
                    </h1>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="grid md:grid-cols-2 gap-4">
                      {deliveryOptions.map((option) => (
                        <button
                          key={option.type}
                          onClick={() => {
                            setSelectedDeliveryOption(option); // Set selected delivery option
                            if (option.type === "Deadline") {
                              // Reset the Deadline to null to allow new date selection
                              setDeadline(null);
                            }
                          }}
                          className={`p-4 rounded-lg border-2 text-left w-full bg-slate-200
          ${
            selectedDeliveryOption?.type === option.type
              ? "border-blue-500 bg-blue-200"
              : "border-y-slate-300 hover:bg-gray-300"
          }`}
                        >
                          <div className="flex items-center mb-2">
                            <p className="font-semibold">
                              {option.type} Delivery
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {option.description}
                          </p>
                          <div className="flex justify-between">
                            <span>Time: {option.estimatedTime}</span>
                            <span className="font-medium">
                              ${option.cost.toFixed(2)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Show DatePicker if "Deadline" is selected */}
                    {selectedDeliveryOption?.type === "Deadline" && (
                      <div className="mt-4">
                        <label
                          htmlFor="deadline-date"
                          className="block text-sm font-semibold"
                        >
                          Select Deadline:
                        </label>
                        <Datepicker
                          id="deadline-date"
                          selected={Deadline}
                          onChange={(date) => setDeadline(date)} // Update Deadline when date is selected
                          minDate={new Date()} // Prevent selecting past dates
                          placeholderText="Select a deadline date"
                          onSelectedDateChanged={handleDatepickerChange1} //
                          className="mt-2 p-2 border rounded w-full"
                        />
                      </div>
                    )}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button onClick={() => setIsDeliveryModalOpen(false)}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </form>
          </div>
        </div>
        {/* Modal for Image Preview */}
        <Modal
          show={isModalOpen}
          size="lg"
          onClose={() => setIsModalOpen(false)}
        >
          <Modal.Header>Image Preview</Modal.Header>
          <Modal.Body>
            <img src={imagePreview} alt="Preview" className="w-full" />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}



// const BookTrip = () => {
//   const [uploadProgress, setUploadProgress] = useState({});
//   const [imageUrls, setImageUrls] = useState({});
//   const [measurements, setMeasurements] = useState([]);

//   const handleImageChange = async (event) => {
//     const { id } = event.target;
//     const file = event.target.files[0];

//     if (file) {
//       const formData = new FormData();
//       formData.append("image", file);

//       try {
//         // Update progress
//         setUploadProgress((prev) => ({ ...prev, [id]: 0 }));

//         // Upload to backend
//         const response = await axios.post("/measure", formData, {
//           onUploadProgress: (progressEvent) => {
//             const percentCompleted = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             setUploadProgress((prev) => ({ ...prev, [id]: percentCompleted }));
//           },
//         });

//         // Save measurement results
//         setMeasurements(response.data.measurements || []);

//         // Save image URL locally
//         const url = URL.createObjectURL(file);
//         setImageUrls((prev) => ({ ...prev, [id]: url }));
//       } catch (error) {
//         console.error("Error uploading file:", error);
//       } finally {
//         setUploadProgress((prev) => ({ ...prev, [id]: null }));
//       }
//     }
//   };

//   return (
//     <div>
//       <h1>Image Upload and Measurement</h1>
//       {/* Image Upload Section */}
//       <div>
//         <Label value="Upload Image" />
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           className="bg-gray-400 rounded-lg"
//         />
//       </div>

//       {/* Measurements Display */}
//       {measurements.length > 0 && (
//         <div className="mt-4">
//           <h2>Measurements</h2>
//           <ul>
//             {measurements.map((measurement, index) => (
//               <li key={index}>
//                 Width: {measurement.width} cm, Height: {measurement.height} cm
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Image Preview */}
//       {Object.keys(imageUrls).length > 0 && (
//         <div className="mt-2 grid grid-cols-2 gap-2">
//           {Object.entries(imageUrls).map(([key, url]) => (
//             <div key={key}>
//               <img
//                 src={url}
//                 alt={key}
//                 className="rounded-md w-32 h-32 object-cover"
//               />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookTrip;
