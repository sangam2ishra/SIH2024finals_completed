/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Table, TextInput, Button, Label, Modal } from "flowbite-react";
import { Datepicker } from "flowbite-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const tamilNaduCities = [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Erode",
    "Tiruppur",
    "Vellore",
    "Thoothukudi",
    "Dindigul",
    "Kanchipuram",
    "Thanjavur",
    "Nagercoil",
    "Cuddalore",
    "Karur",
    "Rajapalayam",
    "Sivakasi",
    "Tirunelveli",
    "Kumbakonam",
    "Pudukkottai",
    "Nagapattinam",
  ];
  
  // List of Indian states as destinations
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];
  
  // Function to generate 100 dummy parcel data
  const generateParcelData = () => {
    const parcelTypes = ["Speed Post", "Ordinary Post", "Normal Parcel"];
    const dummyData = [];
    for (let i = 1; i <= 100; i++) {
      const randomSource =
        tamilNaduCities[Math.floor(Math.random() * tamilNaduCities.length)];
      const randomDestination =
        indianStates[Math.floor(Math.random() * indianStates.length)];
      dummyData.push({
        id: i,
        arrivalTime: `2024-12-${String(i).padStart(2, "0")} 10:00 AM`,
        source: randomSource,
        destination: randomDestination,
        srcPinCode: `${600000 + Math.floor(Math.random() * 1000)}`,
        destPinCode: `${500000 + Math.floor(Math.random() * 1000)}`,
        email: `user${i}@example.com`,
        contactNo: `9${Math.floor(Math.random() * 1000000000)}`, // Indian phone numbers start with 9
        type: parcelTypes[Math.floor(Math.random() * parcelTypes.length)], // Assign type randomly
      });
    }
    return dummyData;
  };


export function AllParcel() {
    const MySwal = withReactContent(Swal);
    const [messageContent, setMessageContent] = useState("");
  const allData = generateParcelData();
  const [filters, setFilters] = useState({
    arrivalTime: "",
    source: "",
    destination: "",
    pincode: "",
    email: "",
    type: "",
  });
  const [filteredData, setFilteredData] = useState(allData);
  const [showModal,setShowModal]=useState(false);

  const handleMessage=()=>{
    setShowModal(true);
  };
  const sendNotification = async () => {
    try {
        MySwal.fire({
            icon: "success",
            title: "NOTIFICATION ",
            text: "Message Sent",
          });
      console.log("send");
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification");
    }
  };
   
  const handleModalSubmit = () => {
    // Submit the new transportation mode data (for example, logging it)
    console.log("New Update Submitted:");
    setShowModal(false); // Close the modal after submitting
  };
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Filter data dynamically
  const filterData = () => {
    const filtered = allData.filter((parcel) => {
      return (
        (filters.arrivalTime === "" ||
          parcel.arrivalTime.includes(filters.arrivalTime)) &&
        (filters.source === "" ||
          parcel.source.toLowerCase().includes(filters.source.toLowerCase())) &&
        (filters.destination === "" ||
          parcel.destination
            .toLowerCase()
            .includes(filters.destination.toLowerCase())) &&
        (filters.pincode === "" ||
          parcel.srcPinCode.includes(filters.pincode) ||
          parcel.destPinCode.includes(filters.pincode)) &&
        (filters.email === "" ||
          parcel.email.toLowerCase().includes(filters.email.toLowerCase())) &&
        (filters.type === "" ||
          parcel.type.toLowerCase().includes(filters.type.toLowerCase()))
      );
    });
    setFilteredData(filtered);
  };

  return (
    <div className="p-2 w-full">
      {/* Filter Section */}
      <div className="mb-4 space-y-4 bg-gray-100 dark:bg-slate-500 p-2  rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="arrivalTime">Arrival Time</Label>
            <Datepicker
              id="arrivalTime"
              placeholder="Select Date & Time"
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  arrivalTime: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="source">Source</Label>
            <TextInput
              id="source"
              name="source"
              placeholder="Search by Source"
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <Label htmlFor="destination">Destination</Label>
            <TextInput
              id="destination"
              name="destination"
              placeholder="Search by Destination"
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <Label htmlFor="pincode">Pin Code</Label>
            <TextInput
              id="pincode"
              name="pincode"
              placeholder="Search by Pin Code"
              onChange={handleFilterChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <TextInput
              id="email"
              name="email"
              placeholder="Search by Email"
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <TextInput
              id="type"
              name="type"
              placeholder="Search by Type"
              onChange={handleFilterChange}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={filterData }  gradientDuoTone="purpleToBlue"
          >Apply Filters</Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Arrival Time</Table.HeadCell>
            <Table.HeadCell>Source</Table.HeadCell>
            <Table.HeadCell>Destination</Table.HeadCell>
            <Table.HeadCell>Source Pin Code</Table.HeadCell>
            <Table.HeadCell>Destination Pin Code</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Contact No.</Table.HeadCell>
            <Table.HeadCell>Type</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredData.map((parcel) => (
              <Table.Row
                key={parcel.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {parcel.arrivalTime}
                </Table.Cell>
                <Table.Cell>{parcel.source}</Table.Cell>
                <Table.Cell>{parcel.destination}</Table.Cell>
                <Table.Cell>{parcel.srcPinCode}</Table.Cell>
                <Table.Cell>{parcel.destPinCode}</Table.Cell>
                <Table.Cell>{parcel.email}</Table.Cell>
                <Table.Cell>{parcel.contactNo}</Table.Cell>
                <Table.Cell>{parcel.type}</Table.Cell>
                <Table.Cell onClick={handleMessage} >
                 <Button  gradientDuoTone="purpleToBlue"
          outline>Message</Button>
                    
                  
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
          <Modal.Header>
            {" "}
            <div className="flex items-center gap-2">
             
                <span className="text-blue-600">
                  {/* Message symbol */}
                  📩
                </span>
              
              <h2 className="text-lg font-semibold">
               Send Message
              </h2>
            </div>
          </Modal.Header>
          <Modal.Body
            className="rounded-lg bg-blue-20"
          >
            <textarea
              className="w-full p-2 border rounded-md"
              rows="4"
              placeholder={`Enter your message here...`}
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            ></textarea>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
              onClick={() => {
                sendNotification();
                setShowModal(false);
              }}
            >
              Submit
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </Modal.Footer>
        </Modal>
    </div>
  );
}
