/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import About from "./pages/About";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FindRoute from "./components/FindRoute";

import BackToTop from "./components/BackToTop";
import PrivateRoute from "./components/PrivateRoute";
import BookTrip from "./pages/BookTrip";
import Schedule from "./pages/Schedule";
// import PdfPage from './pages/PdfPage'
import PdfService from "./pages/PdfService";
import Notification from "./pages/Notification";
import Level2Dashboard from "./pages/Level2DashBoard";
import Level1DashBoard from "./pages/Level1DashBoard";
import { useSelector } from "react-redux";
import CustomerSupport from "./pages/CustomerSupport";
import SignIn1 from "./pages/SignIn1";
import Boarding from "./components/Boarding";
import DijkstraGraph from "./components/DijkstraGraph";

export default function App() {
  const { currentUser, loading } = useSelector((state) => state.user);

  return (
    // <div>
    //   App
    // </div>
    <BrowserRouter>
      <Header />
      <BackToTop />
      <Routes>
        <Route
          path="/"
          element={
            currentUser ? (
              currentUser.nodeCategory == 1 ? (
                <Level1DashBoard />
              ) : (
                <Level2Dashboard />
              )
            ) : (
              <Home />
            )
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-node" element={<SignIn1 />} />
        <Route path="/findroute" element={<FindRoute />} />

        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/bookTrip" element={<BookTrip />} />
        {/* <Route path="/notification" element={<Notification />} /> */}
        {/* //   <Route path='/schedule' element={<Schedule/>} /> */}
        <Route path="/schedule" element={<Schedule />} />
        {/* <Route path="/level2profile" element={<Level2Dashboard />} /> */}
        {/* <Route path="/level1profile" element={<Level1DashBoard />} /> */}
        <Route path="/customerSupport" element={<CustomerSupport />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/level1profile" element={<Level1DashBoard />} />
          <Route path="/level2profile" element={<Level2Dashboard />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/findroute" element={<FindRoute />} />
          {/* <Route path="/findroute1" element={<DijkstraGraph />} /> */}
        </Route>

        {/* <Route path='/swap-request/:pnrNumber' element={<SeatSelectionForm/>} />
         <Route  path="/SwapResults"   element={  <SwapResults /> }  /> */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
