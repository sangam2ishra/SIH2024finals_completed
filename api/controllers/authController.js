import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";

import { errorHandler } from "./../utilis/error.js";
import jwt from "jsonwebtoken";
import level2_nodes from "../models/level2_nodes.js";
import Node from "../models/NodeModel.js";

export const signup = async (req, res, next) => {
  console.log("Hey i am there");
  const { username, email, password,role } = req.body;
  console.log(req.body);

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);
     
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    role,
  });

  try {
   let rest= await newUser.save();
    console.log(rest);
    res.json("Signup Successfull");
  } catch (error) {
    next(error);
  }
};

/**
 * Sign in a node by providing details
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const signin1= async(req, res) => {
  try {
    console.log("---------------------");
    console.log(req.body);
    console.log("=====================");

    const { nodeId, name } = req.body;

    // Validate required fields
    if (!nodeId || !name) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields. Please ensure all fields are provided.",
      });
    }

    // Check if the node exists
    const existingNode = await Node.findOne({name: name });
    if (!existingNode) {
      return res.status(404).json({
        success: false,
        message: "Node not found. Please ensure the details are correct.",
      });
    }

    // Node exists, proceed to sign in (you can perform additional logic here if needed)
    return res.status(200).json({
      success: true,
      message: "Node signed in successfully.",
      data: existingNode,
    });
  } catch (error) {
    console.error("Error signing in node:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};



// Route for signing in a Level 2 Node
export const signin = async (req, res, next) => {
  try {
    console.log("---------------------");
    console.log(req.body);
    console.log("=====================");

    const {
      nodeId,
      name,
      level1Link,
      location,
      postOffices,
      transportationModes,
      storageCapacity,
      currentLoad,
      Level
    } = req.body;

    // Validate required fields
    if (!nodeId || !name || !level1Link || !location || !transportationModes || !storageCapacity) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields. Please ensure all fields are provided."
      });
    }

    // Validate transportationModes
    const validModes = ["Train", "Truck","Ship","Flight"];
    const invalidModes = transportationModes.filter(mode => !validModes.includes(mode));
    if (invalidModes.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid transportation modes: ${invalidModes.join(", ")}. Allowed modes are: ${validModes.join(", ")}`
      });
    }

    // Check if the nodeId already exists
    const existingNode = await level2_nodes.findOne({ nodeId });
    if (existingNode) {
      return res.status(400).json({
        success: false,
        message: "Node ID already exists. Please use a unique Node ID."
      });
    }

    // Create a new Level 2 Node
    const newNode = new Node({
      nodeCategory:Level,
      nodeId,
      name,
      L1Connections:level1Link,
      location,
      postOffices,
      transportationModes,
      storageCapacity: parseInt(storageCapacity, 10),
      currentLoad: parseInt(currentLoad, 10) || 0 // Default to 0 if not provided
    });

    // Save the node to the database
    await newNode.save();

    // Respond with success and created node data
    // const token = jwt.sign(
    //   { id: validUser._id, isAdmin: validUser.isAdmin },
    //   process.env.JWT_SECRET
    // );
    return res.status(201).json({
      success: true,
      message: "Level 2 Node created successfully.",
      data: newNode
    });
  } catch (error) {
    console.error("Error signing in Level 2 Node:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later."
    });
  }
};

export const google = async (req, res, next) => {
  console.log(req.body);
  const { email, name, googlPhotoUrl,role } = req.body;
  
  console.log("Body");
  console.log(req.body);
  try {
    const user = await User.findOne({ email });
    if (user) {
      if(user.role!==role){
        console.log("hii");
        return next(errorHandler(404, "Wrong Credtionals"));
      }
      const token = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET
      );

      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
      const hashedPassword=bcryptjs.hashSync(generatedPassword,10);
      const newUser=new User({
        username:name.toLowerCase().split(' ').join('')+Math.random().toString(9).slice(-4),
        email,
        password:hashedPassword,
        profilePicture:googlPhotoUrl,
        role,
      });
      await newUser.save();
      const token=jwt.sign({id:newUser._id,isAdmin:newUser.isAdmin},process.env.JWT_SECRET);
      const {password,...rest}=newUser._doc;
      res.status(200).cookie('access_token',token,{
        httpOnly:true,
      }).json(rest);
    }
  } catch (error) {
    next(error);
  }
};
