/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import Level2sidebar from "../components/Level2sidebar";

// import React from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { Sidebar, SidebarItemGroup } from "flowbite-react";
import {
  AlertCircle,
  Archive,
  Cloud,
  MapPinCheckIcon,
  Truck,
} from "lucide-react";
import ParcelStatusUpdate from "../components/ParcelStatusUpdate";
import { useSelector } from "react-redux";
import { AllParcel } from "../components/AllParcel";

ChartJS.register(...registerables);

export default function Level2Dashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState("analytics");
  console.log(currentUser);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);




  // Dummy Data
  const parcelData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Total Parcels",
        data: [150, 200, 250, 300, 400, 500, 450],
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.5)",
      },
      {
        label: "In Transit",
        data: [50, 80, 100, 120, 150, 180, 160],
        borderColor: "#2196f3",
        backgroundColor: "rgba(33, 150, 243, 0.5)",
      },
    ],
  };

  const weatherData = {
    labels: ["Sunny", "Rainy", "Cloudy", "Stormy"],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: ["#ffc107", "#03a9f4", "#607d8b", "#f44336"],
        hoverOffset: 4,
      },
    ],
  };

  const loadGrowthData = {
    labels: ["2020", "2021", "2022", "2023"],
    datasets: [
      {
        label: "Load Growth",
        data: [100, 200, 350, 450],
        backgroundColor: "#9c27b0",
        borderColor: "#7b1fa2",
      },
    ],
  };

  const tableData = [
    { category: "Total Parcels", value: 450, change: "+20%" },
    { category: "In Transit", value: 160, change: "-10%" },
    { category: "Delivered", value: 280, change: "+15%" },
    { category: "Delayed", value: 10, change: "-50%" },
  ];
  return (
    <div className="min-h-screen flex flex-col md:flex-row mt-10 bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="md:w-[370px] bg-gray-500 ">
        <Sidebar className="w-72">

        <div className="p-4 shadow-2xl bg-gray-200 
        rounded-md dark:bg-slate-600 my-2">
            <button
              className={`w-full p-2 mb-2 text-left rounded-md ${
                tab === "updateStatus"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
              onClick={() => setTab("updateStatus")}
            >
              Update Status
            </button>
            <button
              className={`w-full p-2 mb-2 text-left rounded-md ${
                tab === "analytics"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
              onClick={() => setTab("analytics")}
            >
              View Analytics
            </button>
          </div>



          <Sidebar.Items className="bg-slate-200  dark:bg-slate-900 rounded-lg ">
            <Sidebar.ItemGroup className="">
              <Sidebar.Item>
                <MapPinCheckIcon className="text-green-500 ml-3" />
                Latitude: {currentUser.location.latitude.toFixed(2)}, Longitude: {currentUser.location.longitude.toFixed(2)}
              </Sidebar.Item>
              <Sidebar.Item className="px-">
                <Truck className="text-blue-500 mx-4 " />
                <p className="mx-">
                
                {/* Transportation: {currentUser.transportationModes.join(', ')} */}
                </p>
              </Sidebar.Item>
              <Sidebar.Item>
                <Cloud className="text-yellow-500 " />
                Weather: {currentUser. weatherConditions}
              </Sidebar.Item>
              <Sidebar.Item>
                <Archive className="text-yellow-200 size-6 " />
                Storage Capacity: {currentUser.storageCapacity} kg
              </Sidebar.Item>
              <Sidebar.Item>
                <AlertCircle className="text-red-500 size-6 " />
                Alert : {currentUser.Alert}
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
      <div className="w-full">
       
        {tab === "updateStatus" ? (
          <>
         <h3
  className="text-center p-4 font-semibold bg-gradient-to-r from-blue-700 via-white to-blue-800 
  dark:from-blue-500 dark:via-white dark:to-blue-600 dark:text-gray-900 "
>
  Update Parcel Status
</h3>

          <ParcelStatusUpdate />
          {/* <AllParcel/> */}
          </>
        ):(
          <>
          <h3
          className="text-center p-4 font-semibold bg-gradient-to-r from-blue-700 via-blue-100 to-blue-800  dark:text-black
            "
        >
          State Node Analytics
        </h3>
        <div
          className="w-full grid 
      
       grid-cols-1 md:grid-cols-2 gap-6 p-10 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-100"
        >
          {/* Parcel Analytics (Line Chart) */}
          <div className="bg-white dark:bg-gray-200 p-6 rounded-lg shadow-2xl ">
            <h2 className="text-lg font-semibold mb-4 dark:text-black ">
              Parcel Analytics
            </h2>
            <Line data={parcelData} />
          </div>

          {/* Weather Analytics (Pie Chart) */}
          <div className="bg-white dark:bg-gray-200 p-4 rounded-lg shadow-2xl">
            <h2 className="text-lg font-semibold mb-4 dark:text-black">
              Weather Analytics
            </h2>
            <Pie
              data={weatherData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.5, // Adjust the aspect ratio for the size
                plugins: {
                  legend: {
                    position: "bottom", // Optional: To adjust legend position
                    labels: {
                      font: {
                        size: 12, // Adjust the font size for labels if needed
                      },
                    },
                  },
                },
              }}
              style={{
                maxWidth: "600px",
                maxHeight: "500px",
                margin: "0 auto",
              }} // Add CSS styles for further size control
            />
          </div>

          {/* Load Growth (Bar Chart) */}
          <div className="bg-white dark:bg-gray-200 p-4 rounded-lg shadow-2xl">
            <h2 className="text-lg font-semibold mb-4 text-black">
              Load Growth Over Years
            </h2>
            <Bar data={loadGrowthData} />
          </div>

          {/* Parcel Stats (Table View) */}
          <div className="bg-white dark:bg-gray-200 p-4 rounded-lg shadow-2xl">
            <h2 className="text-lg font-semibold mb-4 text-black">
              Parcel Stats Overview
            </h2>
            <table className="w-full text-left border-collapse text-black">
              <thead>
                <tr>
                  <th className="border-b pb-2">Category</th>
                  <th className="border-b pb-2">Value</th>
                  <th className="border-b pb-2">Change</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr key={index} className="hover:bg-white">
                    <td className="py-2 border-b">{item.category}</td>
                    <td className="py-2 border-b">{item.value}</td>
                    <td
                      className={`py-2 border-b ${
                        item.change.startsWith("+")
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {item.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
