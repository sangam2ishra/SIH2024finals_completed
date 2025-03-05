/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Modal, Spinner } from "flowbite-react";

const Notification = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  // const nodeName = { nodeName: "Mum" };
  const nodeName = currentUser.name;
  const MySwal = withReactContent(Swal);
  const handleSendAlert = (parcelId) => {
    // setModalType("alert");
    // setSelectedNode(nodeId);
    setIsModalOpen(true);
  };
  
  const handleModalSubmit=async()=>{

    MySwal.fire({
      icon: "success",
      title: "Alerted ",
      text: "You Have Suucessfully Alerted  node",
    });
    setIsModalOpen(false); 

  };

  // Fetch notifications from backend
  useEffect(() => {
    console.log(nodeName);
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/parcelNotification/getAllNotifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nodeName }), 
        });
        const data = await res.json();
        console.log("Fetched Data:", data.notifications);

        // Update state with fetched notifications
        setNotifications(data.notifications || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Filter notifications based on selected type
  const filteredNotifications =
    activeTab === 'All'
      ? notifications
      : notifications.filter((notification) => notification.status === activeTab);

  // Handle Accept button click
  const handleAccept = async (parcelId) => {
    const payload = { parcelId, nodeName: currentUser.name };
    console.log(`Accepting notification with ID: ${parcelId}`);
    setLoading(true);
    try{
      const res = await fetch("/api/parcel/acceptParcel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
      console.log(data);
      if(res.ok) {
        setLoading(false);
         MySwal.fire({
        icon: "success",
        title: "Accepted",
        text: "Parcel accepted and history updated successfully",
      });
      // setLoading(true);
        // navigate('/sign-in');
      }
    }catch(error){
      setLoading(false);
      console.error(error);
      MySwal.fire({
        icon: "error",
        title: "",
        text: "Failed",
      });
      // toast.error("An unexpected error occurred while updating the parcel status.");
    }
  
    // Implement API call here if necessary
  };

  // Handle Dispatch button click
  const handleDispatch = async (parcelId) => {
    // const payload = { parcelId, nodeName: currentUser.name };
    const payload = { parcelId, nodeName: "Ghaziabad" };
    console.log(`Dispatching notification with ID: ${parcelId}`);
    setLoading(true);
    // Implement API call here if necessary
    try{
    const res = await fetch("/api/parcel/dispatchParcel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log(data);
    if(res.ok) {
      setLoading(false);
       MySwal.fire({
      icon: "success",
      title: "Accepted",
      text: "Parcel accepted and history updated successfully",
    });
    setLoading(false);
      // navigate('/sign-in');
    }else{
      setLoading(false);
      MySwal.fire({
        icon: "error",
        title: "Failed",
        text: "Unable to update the status",
      });
    }
  }catch(error){
    setLoading(false);
    console.error(error);
    MySwal.fire({
      icon: "error",
      title: "Failed",
      text: "Unable to update the status",
    });
    // toast.error("An unexpected error occurred while updating the parcel status.");
  }


  };

  return (
    
    <div className="min-h-screen bg-gray-100 dark:bg-slate-600 p-10 mt-10 px-80">
      
      <div className="bg-white dark:bg-slate-500 rounded-lg shadow-2xl p-6 px-10">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Notifications
        </h1>

        {loading? <div className="text-center">
        
       
          <Spinner aria-label="Extra large spinner example"   color="failure" size="xl" />
           </div>:
       

   
        <div className="mb-4">
          <label htmlFor="filter" className="mr-2 text-gray-800 dark:text-gray-200">
            Filter by status:
          </label>
          <select
            id="filter"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Dispatched">Dispatched</option>
          </select>
        </div>
        }

        {loading ? (
          <div className="text-center text-gray-700 dark:text-gray-300">Loading...</div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      Bundle ID: {notification.parcelId}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {notification.message}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(notification.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    {notification.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleAccept(notification.parcelId)}
                          className="hover:scale-105 transition-transform bg-gradient-to-r shadow-2xl from-green-900 via-green-700 to-green-500 text-white px-4 py-2 rounded"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDispatch(notification.parcelId)}
                          className="hover:scale-105 transition-transform bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white px-4 py-2 rounded"
                        >
                          Dispatch
                        </button>
                      </>
                    )}
                    {notification.status === 'Accepted' && (
                      <button
                        onClick={() => handleDispatch(notification.parcelId)}
                        className="hover:scale-105 transition-transform bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-white px-4 py-2 rounded"
                      >
                        Dispatch
                      </button>
                    )}
                    {notification.status === 'Dispatched' && (
                      <div className="text-gray-500 dark:text-gray-400">
                        Dispatched
                      </div>
                    )}
                     <button
                          onClick={() => handleSendAlert(notification.parcelId)}
                          className="hover:scale-105 transition-transform bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white px-4 py-2 rounded"
                        >
                          Alert Node
                        </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-white dark:text-white bg-red-500 dark:bg-red-400 p-4 rounded-lg font-bold">No notifications found.</div>
            )}
          </div>
        )}
      </div>
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <Modal.Header>
            {" "}
            <div className="flex items-center gap-2">
              
                <span className="text-red-600">
                  {/* Alert symbol */}
                  ⚠️
                </span>
             
              <h2 className="text-lg font-semibold">
                 Alert to Node
              </h2>
            </div>
          </Modal.Header>
          <Modal.Body
            className="bg-red-200 rounded-lg"
          >
            <textarea
              className="w-full p-2 border rounded-md"
              rows="4"
              placeholder={`Enter your  "alert" here...`}
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            ></textarea>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
              onClick={() => {
                // sendNotification();
                handleModalSubmit();
                // setIsModalOpen(false);
              }}
            >
              Submit
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </Modal.Footer>
        </Modal>
    </div>
  );
};

export default Notification;
