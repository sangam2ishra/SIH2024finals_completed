// const moment = require('moment');
import moment from "moment";
const flightSchedule = [
    { from: "A", to: "B", departure: "10:00 AM", arrival: "11:00 AM", cost: 500, type: "Flight", identifier: "F1" },
    { from: "B", to: "C", departure: "12:00 PM", arrival: "1:00 PM", cost: 400, type: "Flight", identifier: "F2" },
  ];
  
  const trainSchedule = [
    { from: "A", to: "B", departure: "10:30 AM", arrival: "12:00 PM", cost: 300, type: "Train", identifier: "T1" },
    { from: "B", to: "C", departure: "1:00 PM", arrival: "3:00 PM", cost: 200, type: "Train", identifier: "T2" },
  ];
  
  const truckSchedule = [
    { from: "A", to: "B", departure: "9:00 AM", arrival: "12:30 PM", cost: 100, type: "Truck", identifier: "Tr1" },
    { from: "B", to: "C", departure: "2:00 PM", arrival: "5:00 PM", cost: 150, type: "Truck", identifier: "Tr2" },
  ];

  function findOptimalRoute(start, end, mode, schedules, options = {}) {
    const priorityQueue = [];
    const visited = new Set();
  
    // Push the start node to the queue
    priorityQueue.push({
      node: start,
      time: "6:00 AM",
      cost: 0,
      path: [],
    });
  
    while (priorityQueue.length > 0) {
      // Sort queue based on cost/time depending on the mode
      if (mode === "cheapest") {
        priorityQueue.sort((a, b) => a.cost - b.cost);
      } else if (mode === "fastest") {
        priorityQueue.sort((a, b) => moment(a.time, "h:mm A").diff(moment(b.time, "h:mm A")));
      } else if (mode === "moderate") {
        const r = options.r || 1; // Ratio for cost/time balance
        priorityQueue.sort((a, b) => a.cost / r + moment(a.time, "h:mm A").diff(moment(b.time, "h:mm A")) - (b.cost / r));
      } else if (mode === "deadline") {
        const deadline = options.deadline || "10:00 PM";
        priorityQueue.sort(
          (a, b) => (moment(a.time, "h:mm A").isBefore(deadline) ? a.cost : Infinity) - (moment(b.time, "h:mm A").isBefore(deadline) ? b.cost : Infinity)
        );
      }
  
      // Pop the node with the best priority
      const current = priorityQueue.shift();
  
      if (visited.has(current.node)) continue;
      visited.add(current.node);
  
      // If the end node is reached, return the path
      if (current.node === end) {
        return {
          route: current.path,
          totalTime: moment(current.time, "h:mm A").from(moment("6:00 AM", "h:mm A"), true),
          totalPrice: `Rs${current.cost}`,
        };
      }
  
      // Process neighbors
      for (const schedule of schedules) {
        if (schedule.from === current.node) {
          // Calculate wait time
          const waitTime = moment(schedule.departure, "h:mm A").diff(moment(current.time, "h:mm A"), "minutes");
          if (waitTime < 0) continue; // Skip invalid connections
  
          const newCost = current.cost + schedule.cost;
          const newPath = [...current.path, {
            node: schedule.to,
            arrivalTime: schedule.arrival,
            dispatchTime: schedule.departure,
            arrivalMode: { type: schedule.type, identifier: schedule.identifier },
          }];
          
          priorityQueue.push({
            node: schedule.to,
            time: schedule.arrival,
            cost: newCost,
            path: newPath,
          });
        }
      }
    }
  
    return { error: "No valid route found" };
  }
  
  // Example usage:
  const schedules = [...flightSchedule, ...trainSchedule, ...truckSchedule];
  
  // Find the cheapest route
  console.log("Cheapest");
  console.log(findOptimalRoute("A", "C", "cheapest", schedules));
  
  // Find the fastest route
  console.log("Fastest");
  console.log(findOptimalRoute("A", "C", "fastest", schedules));
  
  // Find the moderate route with a ratio
  console.log("moderate");
  console.log(findOptimalRoute("A", "C", "moderate", schedules, { r: 0.5 }));
  
  // Find the deadline-based route
  console.log(findOptimalRoute("A", "C", "deadline", schedules, { deadline: "8:00 PM" }));
    