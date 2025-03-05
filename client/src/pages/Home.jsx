/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { Label, TextInput, Button } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import {
  BarChart2,
  Package,
  Truck,
  Sun,
  Cloud,
  AlertTriangle,
  Map,
  Bell,
  Building,
  Globe,
} from "lucide-react";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Carousel } from "flowbite-react";
// import BackToTop from './../components/BackToTop';
import AOS from "aos";
import "aos/dist/aos.css";
import { useSelector } from "react-redux";
import { Users } from "lucide-react";
import Graph from "../components/Graph";

export default function Home() {
  // const pnrSection=useRef();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [pnr, setPnr] = useState("");
  const [success, setSuccess] = useState(false);
  const [travel, setTravel] = useState({});
  const [loading, setLoading] = useState(false);
  const pnrCardRef = useRef(); // Create a ref for the PnrCard section

  const [level1Node, setLevel1Node] = useState({
    name: "Level 1 Node",
    nodeId: "L1-123",
    connectedNodes: [
      {
        nodeId: "L1-124",
        name: "Connected Node 1",
        storageCapacity: 2000,
        currentLoad: 1500,
        weatherConditions: "Clear",
        transportationModes: [
          { mode: "Trucks", count: 70, percentage: 35 },
          { mode: "Flights", count: 130, percentage: 65 },
        ],
      },
      {
        nodeId: "L1-124",
        name: "Connected Node 1",
        storageCapacity: 1000,
        currentLoad: 900,
        weatherConditions: "Haze",
        transportationModes: [
          { mode: "Trucks", count: 80, percentage: 70 },
          { mode: "Flights", count: 120, percentage: 35 },
        ],
      },
      {
        nodeId: "L1-124",
        name: "Connected Node 1",
        storageCapacity: 1000,
        currentLoad: 900,
        weatherConditions: "Haze",
        transportationModes: [
          { mode: "Trucks", count: 80, percentage: 70 },
          { mode: "Flights", count: 120, percentage: 35 },
        ],
      },
    ],
  });

  const [level2Nodes, setLevel2Nodes] = useState([
    {
      nodeId: "L2-123",
      name: "Level 2 Node 1",
      postOffices: ["PO1", "PO2"],
      storageCapacity: 1000,
      currentLoad: 800,
      transportationModes: [
        { mode: "Trains", count: 50, percentage: 50 },
        { mode: "Trucks", count: 50, percentage: 50 },
      ],
      parcelStats: {
        totalParcels: 500,
        inTransit: 300,
        delivered: 150,
        delayed: 50,
      },
      weatherAlerts: [
        {
          location: "Node Hub 1",
          severity: "High",
          condition: "Storm Warning",
        },
      ],
      recentAlerts: [
        { id: "001", type: "Delay", message: "Delay due to weather" },
      ],
    },
    {
      nodeId: "L2-124",
      name: "Level 2 Node 2",
      postOffices: ["PO3"],
      storageCapacity: 1500,
      currentLoad: 1200,
      transportationModes: [{ mode: "Ships", count: 200, percentage: 100 }],
      parcelStats: {
        totalParcels: 400,
        inTransit: 200,
        delivered: 150,
        delayed: 50,
      },
      weatherAlerts: [
        {
          location: "Node Hub 2",
          severity: "Moderate",
          condition: "Heavy Rain",
        },
      ],
      recentAlerts: [
        { id: "002", type: "Reroute", message: "Reroute due to flood" },
      ],
    },
  ]);

  const handleChange = (e) => {
    setPnr(e.target.value);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      setSuccess(false);
      const res = await fetch(`/api/pnr/${pnr}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        setSuccess(true);
        setLoading(false);
        setTravel(data.travel);

        // Scroll to the section where PnrCard is displayed

        // scrollUp();
      } else {
        setLoading(false);
        console.log("Request failed with status:", res.status);
      }
    } catch (error) {
      setLoading(false);
      console.log("Error:", error);
    }
  };

  // Dummy data for upcoming deliveries
  const upcomingDeliveries = [
    {
      id: "DMT12345",
      destination: "New York, NY",
      expectedDelivery: "2024-02-15T14:30:00",
    },
    {
      id: "DMT67890",
      destination: "Los Angeles, CA",
      expectedDelivery: "2024-02-16T10:45:00",
    },
  ];
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: true,     // Animate only once
    });
  }, []);

  return (
    <>
      <div  className="">
        <div className="grid gap-0">
          <div className="w-[600px] md:w-full px-40 mt-12  h-60 sm:h-64 xl:h-80 2xl:h-96 overflow-hidden">
            {/* Header */}
            {/* <Carousel className="h-full"> */}
    <img src="images/image3.jpg" alt="..." className="object-cover mx-auto   h-full" />
   
    
  
         
          </div>
        </div>
        
        <div className="w-full bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col lg:flex-row">
  {/* <!-- Left Half --> */}
  <div className="flex-1 flex items-center justify-center p-4">
    <div className="p-10">
    <h2 className="text-2xl font-bold mb-4 text-black dark:text-white underline-offset-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-00 p-2 rounded-md">
  Indian States Network Visualization
</h2>
    <p className="text-lg text-gray-700 dark:text-gray-300">
      <span className="font-bold">ParcelPulse</span> is redefining{" "}
      <span className="font-bold">parcel delivery</span> with a{" "}
      <span className="font-bold">cutting-edge, multi-modal transportation network</span>{" "}
      optimized for <span className="font-bold">speed</span>,{" "}
      <span className="font-bold">cost</span>, and{" "}
      <span className="font-bold">customer convenience</span>. By seamlessly
      connecting <span className="font-bold">major hubs</span> (like airports and
      seaports) with <span className="font-bold">city hubs</span>, we ensure{" "}
      <span className="font-bold">efficient delivery</span> at every level of the
      logistics chain.
    </p>


    <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">
      With <span className="font-bold">flexible delivery options</span>, customers
      can prioritize what matters most to them:
    </p>
    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
      <button href = "/test">Test</button>
      <li>
        <span className="font-bold">Fastest Delivery</span> for urgent needs.
      </li>
      <li>
        <span className="font-bold">Cheapest Option</span> for cost-conscious
        customers.
      </li>
      <li>
        <span className="font-bold">Balanced Approach</span> for optimal value.
      </li>
      <li>
        <span className="font-bold">Deadline-Based Delivery</span> for
        time-sensitive shipments.
      </li>
    </ul>
    <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">
      Our advanced <span className="font-bold">routing algorithms</span>,
      including <span className="font-bold">Dijkstra's Algorithm</span> and{" "}
      <span className="font-bold">reinforcement learning techniques</span>,
      streamline logistics by selecting the most efficient paths for every parcel.
    </p>
    <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">
      To ensure reliability, <span className="font-bold">real-time weather monitoring</span>{" "}
      dynamically adjusts delivery routes, helping to{" "}
      <span className="font-bold">avoid delays</span> caused by unfavorable conditions.
      This guarantees a <span className="font-bold">seamless delivery experience</span>, even
      in challenging situations.
    </p>
    <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">
      <span className="font-bold">Real-Time Tracking:</span> Customers can track parcels
      with ease using our <span className="font-bold">intuitive app</span> and{" "}
      <span className="font-bold">website</span> by entering a{" "}
      <span className="font-bold">unique parcel ID</span>. Integrated updates from{" "}
      <span className="font-bold">transport agencies</span> provide live notifications,
      ensuring you're always informed about your parcel's status.
    </p>
    <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">
      At <span className="font-bold">ParcelPulse</span>, we don't just deliver parcels—we
      deliver <span className="font-bold">trust</span>,{" "}
      <span className="font-bold">speed</span>, and{" "}
      <span className="font-bold">transparency</span>, setting a new standard for modern
      logistics.
    </p>

    </div>
  </div>
  {/* <!-- Right Half --> */}
  <div className="flex-1 flex items-center justify-center p-8 mt-10">
    <Graph />
    
  </div>
</div>

       



        <div className=" mt-6">
        
          <div
            data-aos="fade-right"
            className={`mx-4 md:mx-10 my-3 p-14 shadow-lg z-20 rounded-lg text-black dark:text-white ${
              theme === "dark"
                ? "bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900"
                : "bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400"
            }`}
          >
             <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Hic natus repudiandae ipsam doloremque doloribus magnam magni, esse ad voluptatum atque sint praesentium quibusdam labore dolor molestiae deleniti ipsa pariatur quo!</p>
            <h1 className="mb-8 h-6  text-3xl"> What is "ParcelPulse"?</h1>
            
            <p>
              {" "}
              "ParcelPulse" is a cutting-edge parcel delivery platform designed
              to optimize logistics through an efficient multi-level hub system.
              It ensures seamless delivery services between major hubs
              (airports, seaports), city hubs, and final destinations, catering
              to both speed and cost-effectiveness.{" "}
            </p>
          </div>
          
          <div
            data-aos="fade-right"
            className={`mx-4 md:mx-10 my-3 p-14 shadow-lg rounded-lg text-black dark:text-white ${
              theme === "dark"
                ? "bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900"
                : "bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400"
            }`}
          >
            <h2 className="mb-8 h-6  text-3xl">Who can use "ParcelPulse"?</h2>
            <p>
              ParcelPulse is accessible to both individual customers and
              businesses. With user-friendly tools, individuals can send parcels
              with ease, while businesses can integrate our platform to manage
              bulk logistics. Each user is uniquely identified through a secure
              registration process.
            </p>{" "}
          </div>
          <div
            data-aos="fade-right"
            className={`mx-4 md:mx-10 my-3 p-14 shadow-lg rounded-lg text-black dark:text-white ${
              theme === "dark"
                ? "bg-gradient-to-r  from-slate-700 via-slate-800 to-slate-900"
                : "bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400"
            }`}
          >
            <h2 className="mb-8 h-6  text-3xl">
              Can users schedule parcel deliveries in advance?
            </h2>
            <p>
              Yes, users can book deliveries in advance through ParcelPulse. By
              selecting the "Book Parcel" option, customers can specify pickup
              and delivery locations, preferred dates, and delivery type
              (Fastest, Cheapest, Moderate, or Deadline-Based). Confirmation
              emails with tracking details are sent upon successful booking.
            </p>
          </div>
          <div
            data-aos="fade-right"
            className={`mx-4 md:mx-10 my-3 p-14 shadow-lg rounded-lg text-black dark:text-white ${
              theme === "dark"
                ? "bg-gradient-to-r  from-slate-700 via-slate-800 to-slate-900"
                : "bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400"
            }`}
          >
            <h2 className="mb-8 h-6  text-3xl">
              Is the parcel delivery service free?
            </h2>
            <br />
            <br />
            <p>
              {" "}
              No, ParcelPulse operates on a tiered pricing model. Delivery
              charges depend on the delivery type chosen (Fastest, Cheapest,
              etc.), parcel size, and distance. Competitive rates ensure
              affordability, while the nominal fees contribute to system
              maintenance and service improvements.
              <br />
              <br />
            </p>
          </div>
          <div
            data-aos="fade-right"
            className={`mx-4 md:mx-10 my-3 p-14 shadow-lg rounded-lg text-black dark:text-white ${
              theme === "dark"
                ? "bg-gradient-to-r  from-slate-700 via-slate-800 to-slate-900"
                : "bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400"
            }`}
          >
            <h2 className="mb-8 h-6  text-3xl">
              {" "}
              What are the available options for payment?
            </h2>
            <p>
              {" "}
              Customers can pay using various methods, including UPI, net
              banking, credit or debit cards, and integrated wallet systems.
              Businesses have the option of postpaid accounts for bulk
              shipments, enhancing their financial flexibility.{" "}
            </p>
          </div>
          <div
            data-aos="fade-right"
            className={`mx-4 md:mx-10 my-3 p-14 shadow-lg rounded-lg text-black dark:text-white ${
              theme === "dark"
                ? "bg-gradient-to-r  from-slate-700 via-slate-800 to-slate-900"
                : "bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400"
            }`}
          >
            <h2 className="mb-8 h-6  text-3xl">
              {" "}
              How can users track their parcels?
            </h2>
            <p>
              Tracking parcels is effortless with ParcelPulse. By entering the
              unique parcel ID on the app or website, customers can view
              real-time updates on their parcel's location and status.
              Notifications and alerts provide live updates for delays,
              reroutes, or successful deliveries.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
