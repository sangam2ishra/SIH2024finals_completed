/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Alert, Button, Label, Modal, ModalBody, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { app1 } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function DashProfile() {
  const { currentUser, loading } = useSelector((state) => state.user);
  console.log(currentUser);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  console.log(currentUser.postOffices);
  const [formData, setFormData] = useState({
    nodeId: currentUser.nodeId,
    name: currentUser.name,
    level1Link: currentUser.L1Connections,
    location: { 
      latitude: currentUser.location.latitude, 
      longitude: currentUser.location.longitude 
    },
    postOffices: currentUser.postOffices,
    transportationModes: currentUser.transportationModes,
    storageCapacity: currentUser.storageCapacity,
    currentLoad: currentUser.currentLoad,
  });
 
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
   console.log(formData);
   
    try {
      console.log("HII1");
      dispatch(updateStart());
      console.log("HII2");
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data.data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full ">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile


      </h1>

     
      <form onSubmit={handleSubmit} className="space-y-4 items-center">
      <div
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
         
        >
           <img
            // src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_5WV7VpA7O5nDNXRiO9WhuwwGvVHwTc5Nww&s"
            src={currentUser?.nodeCategory === 1 ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_nUV3e0reIUuZYcqKszuM3VTqPpLzaQfhkw&s" : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_5WV7VpA7O5nDNXRiO9WhuwwGvVHwTc5Nww&s"}
            alt='user'
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray] "
          />
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

            <div>
              <Label htmlFor="level1Link" value="Connected Level 1 Hub" />
              <TextInput
                id="level1Link"
                name="level1Link"
                type="text"
                value={formData.level1Link}
                onChange={handleChange}
                required
                shadow
                color="gray"
                className="shadow-2xl"
              />
            </div>

            <div>
              <Label htmlFor="latitude" value="Latitude" />
              <TextInput
                id="latitude"
                type="number"
                 name="latitude"
                value={formData.location.latitude}
                onChange={handleChange}
                required
                shadow
                className="bg-gray-100 dark:bg-gray-700 shadow-2xl" 
              />
            </div>

            <div>
              <Label htmlFor="longitude" value="Longitude" />
              <TextInput
                id="longitude"
                type="number"
                 name="longitude"
                value={formData.location.longitude}
                onChange={handleChange}
                required
                shadow
                className="bg-gray-100 dark:bg-gray-700 shadow-2xl"
              />
            </div>

            <div>
              <Label
                htmlFor="postOffices"
                value="Post Offices (comma separated)"
              />
              <TextInput
                id="postOffices"
                name="postOffices"
                type="text"
                onChange={handleChange}
                shadow
                color="gray"
                className="shadow-2xl"
                value={formData.postOffices}
              />
            </div>

            <div>
  {/* <Label htmlFor="transportationModes" value="Transportation Modes" />
  <div>
    <label>
      <input
        type="checkbox"
        name="transportationModes"
        value="Flight"
        onChange={handleChange}
        checked={formData.transportationModes.includes("Flight")}
        className=" mr-2 rounded-md size-6"
      />
      Flight
    </label>
    <label className="ml-4">
      <input
        type="checkbox"
        name="transportationModes"
        value="Train"
        onChange={handleChange}
        checked={formData.transportationModes.includes("Train")}
         className=" mr-2 rounded-md size-6"
      />
      Train
    </label>
    <label className="ml-4">
      <input
        type="checkbox"
        name="transportationModes"
        value="Truck"
        onChange={handleChange}
        checked={formData.transportationModes.includes("Truck")}
         className=" mr-2 rounded-md size-6"
      />
      Truck
    </label>
    <label className="ml-4">
      <input
        type="checkbox"
        name="transportationModes"
        value="Ship"
        onChange={handleChange}
        checked={formData.transportationModes.includes("Ship")}
         className=" mr-2 rounded-md size-6"
      />
      Ship
    </label>
  </div> */}
</div>


            <div>
              <Label htmlFor="storageCapacity" value="Storage Capacity" />
              <TextInput
                id="storageCapacity"
                name="storageCapacity"
                type="number"
                value={formData.storageCapacity}
                onChange={handleChange}
                required
                shadow
                color="gray"
                className="shadow-2xl"
              />
            </div>

            <div>
              <Label htmlFor="currentLoad" value="Current Load" />
              <TextInput
                id="currentLoad"
                name="currentLoad"
                type="number"
                value={formData.currentLoad}
                onChange={handleChange}
                shadow
                color="gray"
                className="shadow-2xl"
              />
            </div>
            <Button type="submit" onSubmit={handleSubmit} gradientDuoTone="purpleToBlue"  className="shadow-2xl w-1/2 items-center mt-4">Submit</Button>
          
          </form>
        
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignout} className="cursor-pointer">
          Sign Out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
