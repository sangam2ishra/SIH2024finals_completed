/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux"; // Redux hooks
import axios from "axios";
// import { updateParcelStatus } from "../redux/actions/parcelActions"; // Redux action for parcel updates
import { toast } from "react-toastify"; // For notifications (optional)
import { Alert, Button, Spinner } from "flowbite-react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ParcelStatusUpdate = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  const MySwal = withReactContent(Swal);
  const [parcelId, setParcelId] = useState("");
  const [status, setStatus] = useState("");
  const [loading,setLoading]=useState(false);

//   const level2Node = useSelector((state) => state.level2Node); // Assuming this contains the Level2Node data
  const dispatch = useDispatch();

  const level2Node={
    nodeId: currentUser.nodeId,
  name: currentUser.name,
  level1Link: "L1NODE123",
  location: {
    latitude: currentUser.location.latitude,
    longitude: currentUser.location.longitude,
  },
  postOffices:currentUser.postOffices,
  transportationModes: currentUser.transportationModes,
  storageCapacity: currentUser.storageCapacity,
  currentLoad: currentUser.currentLoad,
  };

  const handleStatusUpdate = async () => {
  
    if (!parcelId || !status) {
      MySwal.fire({
        icon: "error",
        title: "",
        text: "Parcel ID and status are required.",
      });
      // toast.error("Parcel ID and status are required.");
      return;
    }
  
    if (!currentUser || !currentUser.name) {
      toast.error("Current user is not defined or does not have a name.");
      return;
    }
  
    try {
      console.log(parcelId);
      console.log(status);
      setLoading(true);
      
      const payload = { parcelId, nodeName: currentUser.name };
  
      let res;
      if (status === "Received") {
        res = await fetch("/api/parcel/acceptParcel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else if (status==="Dispatch") {
        res = await fetch("/api/parcel/dispatchParcel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
  
      const data = await res.json();
      console.log(res);
      console.log(data);
      setLoading(false);
  
      if (res.ok) {
        MySwal.fire({
          icon: "success",
          title: "success",
          text: "Parcel status updated successfully.",
        });
        // toast.success("Parcel status updated successfully.");
        setParcelId("");
        setStatus("");

      } else {
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update parcel status.",
        });
        // toast.error(data?.message || "Failed to update parcel status.");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred while updating the parcel status.",
      });
      // toast.error("An unexpected error occurred while updating the parcel status.");
    }
  };
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-all">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-700 shadow-md rounded-lg p-6 transition-all">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Level 2 Node Dashboard</h1>

        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Node Information</h2>
          <div className="p-4 bg-gray-100 dark:bg-gray-600 rounded-lg mt-2 shadow-2xl">
            <p className="text-gray-800 dark:text-gray-200">
              <strong>Node ID:</strong> {level2Node.nodeId}
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              <strong>Name:</strong> {level2Node.name}
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              <strong>Location:</strong> {level2Node.location.latitude}, {level2Node.location.longitude}
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              <strong>Current Load:</strong> {level2Node.currentLoad} / {level2Node.storageCapacity}
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              {/* <strong>Transportation Modes:</strong> {level2Node.transportationModes.join(", ")} */}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Update Parcel Status</h2>
          <div className="space-y-4 items-center flex flex-col">
            <input
              type="text"
              placeholder="Enter Parcel ID"
              value={parcelId}
              onChange={(e) => setParcelId(e.target.value)}
               className="block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
               className="block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="Received">Received</option>
              <option value="Dispatch">Dispatch</option>
            </select>

            {loading? <Button>
        <Spinner aria-label="Spinner button example" size="sm" />
        <span className="pl-3">Loading...</span>
      </Button>:
            <Button
              onClick={handleStatusUpdate}
              gradientDuoTone="purpleToBlue" 
              className="w-2/3 items-center  text-white py-2 font-semibold"
            >
              Update Status
            </Button>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcelStatusUpdate;
