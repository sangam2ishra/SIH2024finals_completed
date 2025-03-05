class EdgeInfo {
    constructor(arrivalTime, departureTime, cost, mode) {
        this.arrivalTime = arrivalTime;     // Arrival time at the destination
        this.departureTime = departureTime; // Departure time from the source
        this.cost = cost;                   // Travel cost
        this.mode = mode;                   // Mode of transport
    }
}

class TravelRouteOptimizer {
    constructor() {
        // Storage for edges and graph
        this.storage = {};
        this.storage2 = {};
        this.graph = {};

        // Mapping city names to numeric IDs
        this.cityNotoName = new Map();
        this.cityNametoNo = new Map();

        // Map Level 2 nodes to their corresponding Level 1 nodes
        this.level2ToLevel1 = {
            6: 1, 7: 1, 8: 1, 9: 1, 10: 1,   
            11: 2, 12: 2, 13: 2, 14: 2, 15: 2,  
            16: 3, 17: 3, 18: 3, 19: 3, 20: 3,  
            21: 4, 22: 4, 23: 4, 24: 4, 25: 4,  
            26: 5, 27: 5, 28: 5, 29: 5, 30: 5   
        };

        this.modeStringtoNum = {
            "Flight": 1,
            "Train": 2,
            "Truck": 3,
            "Seaway": 4
        };

        this.modeNumToString = {
            1: "Flight",
            2: "Train", 
            3: "Truck", 
            4: "Seaway"
        };
    }

    // Convert time in HH:MM format to minutes
    parseMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // Convert minutes back to HH:MM time format
    convertMinutesToTime(minutes) {
        let hours = Math.floor(minutes / 60);
        let mins = minutes % 60;

        hours = Math.max(0, Math.min(23, hours));
        mins = Math.max(0, Math.min(59, mins));

        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    // Add an edge to the storage
    addEdge(from, to, arrivalTime, departureTime, cost, mode) {
        const at = this.parseMinutes(arrivalTime);
        const dt = this.parseMinutes(departureTime);
        const modeNum = this.modeStringtoNum[mode];

        // Ensure storage structures exist
        if (!this.storage[from]) this.storage[from] = {};
        if (!this.storage[from][to]) this.storage[from][to] = [];
        if (!this.storage2[from]) this.storage2[from] = {};
        if (!this.storage2[from][to]) this.storage2[from][to] = {};

        // Add edge to storage
        const edgeInfo = new EdgeInfo(at, dt, cost, modeNum);
        this.storage[from][to].push(edgeInfo);
        this.storage2[from][to][modeNum] = { arrivalTime: at, departureTime: dt, cost: cost };

        // Add to graph connections
        if (!this.graph[from]) this.graph[from] = new Set();
        this.graph[from].add(to);
    }

    // Construct graph with predefined routes
    constructGraph() {
        // City mapping
        const cities = {
            1: "New Delhi", 2: "Mumbai", 3: "Kolkata", 4: "Amritsar", 5: "Chennai",
            6: "Noida", 7: "Gurgaon", 8: "Ghaziabad", 9: "Faridabad", 10: "Meerut",
            11: "Thane", 12: "Navi Mumbai", 13: "Pune", 14: "Nagpur", 15: "Aurangabad",
            16: "Howrah", 17: "Durgapur", 18: "Asansol", 19: "Siliguri", 20: "Kharagpur",
            21: "Ludhiana", 22: "Jalandhar", 23: "Patiala", 24: "Bathinda", 25: "Rajpura",
            26: "Coimbatore", 27: "Madurai", 28: "Trichy", 29: "Salem", 30: "Vellore"
        };

        // Populate city mappings
        for (const [id, name] of Object.entries(cities)) {
            const numId = Number(id);
            this.cityNotoName.set(numId, name);
            this.cityNametoNo.set(name, numId);
        }

        // Define routes
        const routes = [
            [1, 2, "09:00", "10:00", 5500, "Flight"],
            [1, 2, "10:00", "12:00", 1200, "Train"],
            [1, 2, "14:00", "15:30", 800, "Truck"],
            [1, 2, "17:00", "18:30", 350, "Seaway"],

            [2, 3, "09:00", "11:00", 6500, "Flight"],
            [2, 3, "12:30", "14:00", 1300, "Train"],
            [2, 3, "15:30", "17:00", 950, "Truck"],
            [2, 3, "19:00", "21:00", 450, "Seaway"],

            [3, 4, "10:00", "12:00", 7100, "Flight"],
            [3, 4, "14:00", "16:00", 1600, "Train"],
            [3, 4, "17:00", "18:30", 1050, "Truck"],
            [3, 4, "20:30", "22:00", 550, "Seaway"],

            [4, 5, "12:00", "14:00", 8200, "Flight"],
            [4, 5, "16:30", "18:00", 1700, "Train"],
            [4, 5, "19:30", "21:00", 1150, "Truck"],
            [4, 5, "22:30", "23:30", 650, "Seaway"],

            [1, 3, "08:00", "10:00", 6000, "Flight"],
            [1, 3, "12:00", "14:00", 1400, "Train"],
            [1, 3, "15:30", "17:00", 900, "Truck"],
            [1, 3, "17:30", "19:00", 400, "Seaway"],

            [2, 4, "07:00", "09:00", 6900, "Flight"],
            [2, 4, "11:00", "13:00", 1500, "Train"],
            [2, 4, "14:00", "15:30", 1000, "Truck"],
            [2, 4, "18:00", "19:30", 500, "Seaway"],

            [3, 5, "09:00", "11:00", 7500, "Flight"],
            [3, 5, "12:30", "14:30", 1600, "Train"],
            [3, 5, "16:00", "17:30", 1100, "Truck"],
            [3, 5, "19:30", "21:00", 600, "Seaway"],

            [1, 5, "10:30", "12:30", 8400, "Flight"],
            [1, 5, "14:30", "16:00", 1800, "Train"],
            [1, 5, "17:30", "19:00", 1200, "Truck"],
            [1, 5, "19:00", "20:30", 700, "Seaway"]
        ];

        routes.forEach(route => this.addEdge(...route));

        // Add Level 2 to Level 1 connections
        for (const [level2, level1] of Object.entries(this.level2ToLevel1)) {
            const l2 = Number(level2);
            const routes = [
                [level1, l2, "09:30", "10:00", 50, "Train"],
                [level1, l2, "12:00", "12:30", 100, "Flight"],
                [level1, l2, "14:30", "15:00", 30, "Truck"],
                [level1, l2, "16:30", "17:00", 20, "Seaway"],

                [l2, level1, "10:00", "10:30", 50, "Train"],
                [l2, level1, "12:30", "13:00", 100, "Flight"],
                [l2, level1, "08:10", "09:00", 30, "Truck"],
                [l2, level1, "12:00", "09:00", 20, "Seaway"]
            ];
            routes.forEach(route => this.addEdge(...route));

            // Ensure graph connections
            if (!this.graph[level1]) this.graph[level1] = new Set();
            if (!this.graph[l2]) this.graph[l2] = new Set();
            this.graph[level1].add(l2);
            this.graph[l2].add(level1);
        }
    }

    dijkstraminCost(origin, dest, arrTime, maxTime) {
        const visited = new Set();
        const minArrivalTime = new Map();
        const minCost = new Map();
        const parent = new Map();
        const travelMode = new Map();

        // Initialize source node
        minArrivalTime.set(origin, arrTime);
        minCost.set(origin, 0);

        while (true) {
            let currNode = null;
            let minCostNode = Infinity;

            // Find unvisited node with minimum cost
            for (const node of Object.keys(this.graph)) {
                const nodeNum = Number(node);
                if (!visited.has(nodeNum) && 
                    minCost.has(nodeNum) && 
                    minCost.get(nodeNum) < minCostNode) {
                    currNode = nodeNum;
                    minCostNode = minCost.get(nodeNum);
                }
            }

            // If no node found, break
            if (currNode === null) break;

            visited.add(currNode);

            // Explore neighbors
            for (const neighbor of (this.graph[currNode] || [])) {
                if (this.storage[currNode] && this.storage[currNode][neighbor]) {
                    for (const edge of this.storage[currNode][neighbor]) {
                        // Check path validity
                        const currentArrTime = minArrivalTime.get(currNode) || 0;
                        const currentCost = minCost.get(currNode) || 0;

                        if (edge.departureTime >= currentArrTime && 
                            edge.departureTime <= maxTime) {
                            const newCost = currentCost + edge.cost;
                            
                            // Update if better path found
                            if (!minCost.has(neighbor) || newCost < minCost.get(neighbor)) {
                                minCost.set(neighbor, newCost);
                                minArrivalTime.set(neighbor, edge.departureTime);
                                parent.set(neighbor, currNode);
                                travelMode.set(neighbor, edge.mode);
                            }
                        }
                    }
                }
            }
        }

        // Check if path exists
        if (!minCost.has(dest)) {
            console.log(`No valid path found from ${this.cityNotoName.get(origin)} to ${this.cityNotoName.get(dest)}.`);
            return [-1, -1];
        }

        // Reconstruct path
        const path = [];
        const modes = [];
        for (let node = dest; node !== undefined;) {
            path.unshift(node);
            const prevNode = parent.get(node);
            if (prevNode !== undefined) {
                modes.unshift(travelMode.get(node));
            }
            node = prevNode;
        }

        // Print path details
        console.log(`Route from ${this.cityNotoName.get(origin)} to ${this.cityNotoName.get(dest)}:`);
        for (let i = 0; i < path.length - 1; i++) {
            const from = path[i], to = path[i+1], mode = modes[i];
            console.log(`${this.cityNotoName.get(from)} --> ${this.cityNotoName.get(to)}`);
            console.log(`Mode: ${this.modeNumToString[mode]}`);
            console.log(`Price: ${this.storage2[from][to][mode].cost}`);
            console.log(`Timing: ${this.convertMinutesToTime(this.storage2[from][to][mode].departureTime)} - ${this.convertMinutesToTime(this.storage2[from][to][mode].arrivalTime)}`);
        }

        return [minArrivalTime.get(dest), minCost.get(dest)];
    }
}

// Example usage
function main() {
    const optimizer = new TravelRouteOptimizer();
    optimizer.constructGraph();

    const origin = 8;  // Ghaziabad
    const dest = 2;    // Mumbai
    const arrTime = optimizer.parseMinutes("07:30");
    const deadline = optimizer.parseMinutes("13:00");

    console.log(`Origin: ${optimizer.cityNotoName.get(origin)}, Destination: ${optimizer.cityNotoName.get(dest)}`);

    const [arrivalTime, minCost] = optimizer.dijkstraminCost(origin, dest, arrTime, deadline);
    console.log(`Minimum cost: ${minCost}`);
    console.log(`Arrival time: ${optimizer.convertMinutesToTime(arrivalTime)}`);
}

main();