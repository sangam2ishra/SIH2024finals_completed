import bcryptjs from 'bcryptjs';
import { errorHandler } from './../utilis/error.js';
import User from '../models/userModel.js';
import level2_nodes from '../models/level2_nodes.js';
import Node from '../models/NodeModel.js';

export const test = (req, res) => {
  res.json({ message: 'API is working!' });
};

export const updateUser = async (req, res, next) => {
  console.log(req.body);
  // if (req.user.id !== req.params.userId) {
  //   return next(errorHandler(403, 'You are not allowed to update this user'));
  // }
  const {
    nodeId,
    name,
    level1Link,
    location,
    postOffices,
    transportationModes,
    storageCapacity,
    currentLoad
  } = req.body;

  try {
    const newNode = await Node.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          nodeId,
          name,
          L1Connections:level1Link,
          location,
          postOffices,
          transportationModes,
          storageCapacity: parseInt(storageCapacity, 10),
          currentLoad: parseInt(currentLoad, 10) || 0 // Default to 0 if not provided
        },
      },
      { new: true }
    );
    // const { password, ...rest } = updatedUser._doc;
    return res.status(201).json({
      success: true,
      message: "Level 2 Node Updated successfully.",
      data: newNode
    });
  }catch (error) {
    console.error("Error signing in Level 2 Node:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later."
    });
  }
};

export const deleteUser = async (req, res, next) => {
  // if (!req.user.isAdmin && req.user.id !== req.params.userId) {
  //   return next(errorHandler(403, 'You are not allowed to delete this user'));
  // }
  try {
    await Node.findByIdAndDelete(req.params.userId);
    res.status(200).json('User has been deleted');
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie('access_token')
      .status(200)
      .json('User has been signed out');
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};