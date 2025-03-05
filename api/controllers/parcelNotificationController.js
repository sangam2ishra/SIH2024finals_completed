import Notification from "../models/NotificationModel.js";
import Parcel from "../models/parcelModel.js";
import Node from "../models/NodeModel.js";

export const sendParcelNotification = async (parcelId, nodeName, message, status) => {
  console.log("Inside sendParcelNotification:", { parcelId, nodeName, message, status });

  try {
    // Verify the parcel exists
    const parcel = await Parcel.findOne({ parcelId });
    if (!parcel) {
      console.error("Parcel not found:", parcelId);
      return { error: "Parcel not found" };
    }

    // Verify the node exists
    const node = await Node.findOne({ name: nodeName });
    if (!node) {
      console.error("Node not found:", nodeName);
      return { error: "Node not found" };
    }

    console.log("Node found:", node);

    // Create and save the notification
    const notification = new Notification({
      parcelId,
      message,
      status: status || "Pending", // Default status if not provided
      node: node._id, // Reference to the Node
    });

    await notification.save();
    console.log("Notification created and saved:", notification);

    // Ensure `notifications` array exists before pushing
    if (!Array.isArray(node.notifications)) {
      node.notifications = [];
    }
    node.notifications.push(notification._id);
    await node.save();

    console.log("Notification linked to Node and saved successfully");

    // Return success message
    return {
      message: "Notification sent successfully",
      notification,
    };
  } catch (error) {
    console.error("Error in sendParcelNotification:", error);
    return { error: "Internal server error" };
  }
};
export const changeParcelNotificationStatus = async (parcelId, nodeName, status) => {
  console.log("Inside changeParcelNotificationStatus");

  try {
    // Verify that the parcel exists
    const parcel = await Parcel.findOne({ parcelId });
    if (!parcel) {
      return { status: 404, message: "Parcel not found" };
    }

    // Verify that the node exists
    const currNode = await Node.findOne({ name: nodeName });
    if (!currNode) {
      return { status: 404, message: "Node not found" };
    }

    // Find the notification associated with this parcelId and nodeName
    const notification = await Notification.findOne({ parcelId, node: currNode._id });
    if (!notification) {
      return { status: 404, message: "Notification not found for the specified node" };
    }

    // Update the notification's status
    notification.status = status || notification.status; // Use the provided status or retain the current one if not provided

    // Log the updated notification for debugging
    console.log("Updated Notification:", notification);

    // Save the updated notification
    await notification.save();

    return { status: 200, message: "Notification status updated successfully", notification };
  } catch (error) {
    console.error("Error updating notification status:", error);
    return { status: 500, message: "Internal server error" };
  }
};


  export const getAllNotifications = async (req, res) => {
    const { nodeName } = req.body;
    console.log(req.body);
    console.log(nodeName);
    // nodeName="Ghaziyabad";
    console.log(nodeName);
    try {
      if (!nodeName) {
        return res.status(400).json({ message: "Node name is required." });
      }
   //Ghaziyabad
      // Find the node by name
      const node = await Node.findOne({ name: nodeName }).populate("notifications");
  
      if (!node) {
        return res.status(404).json({ message: "Node not found." });
      }
  
      // Populate notifications and return them
      const notifications = await Notification.find({ node: node._id });
      console.log(notifications);
      return res.status(200).json({
        message: "Notifications retrieved successfully.",
        notifications,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return res.status(500).json({ message: "Server error." });
    }
  };