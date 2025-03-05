// Transport Routing Algorithm

class TransportRouter {
    constructor() {
        // Maps to store city names and their numeric IDs
        this.cityNotoName = new Map();
        this.cityNametoNo = new Map();
        this.level2ToLevel1 = new Map([
            [6, 1], [7, 1], [8, 1], [9, 1], [10, 1], // Noida, Gurgaon, Ghaziabad, Faridabad, Meerut -> Delhi
            [11, 2], [12, 2], [13, 2], [14, 2], [15, 2], // Thane, Navi Mumbai, Pune, Nagpur, Aurangabad -> Mumbai
            [16, 3], [17, 3], [18, 3], [19, 3], [20, 3], // Howrah, Durgapur, Asansol, Siliguri, Kharagpur -> Kolkata
            [21, 4], [22, 4], [23, 4], [24, 4], [25, 4], // Amritsar, Ludhiana, Jalandhar, Patiala, Bathinda -> Punjab
            [26, 5], [27, 5], [28, 5], [29, 5], [30, 5]  // Coimbatore, Madurai, Trichy, Salem, Vellore -> Chennai
        ]);
        this.modeStringtoNum = {
            'Flight': 1,
            'Train': 2,
            'Truck': 3,
            'Seaway': 4
        };
        this.modeNumtoString = {
            1: 'Flight',
            2: 'Train', 
            3: 'Truck', 
            4: 'Seaway'
        };
        
        // Storage for graph edges
        this.storage = [];
        this.storage2 = Array.from({ length: 500 }, () => 
            Array.from({ length: 500 }, () => Array(5).fill(null))
        );
        this.graph = Array.from({ length: 500 }, () => []);

        // New property to store route details
        this.routeDetails = {
            origin: '',
            destination: '',
            totalCost: 0,
            arrivalTime: '',
            route: []
        };
    }

    // Parse time string to minutes
    parseminutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // Convert minutes back to HH:MM format
    convertMinutesToTime(minutes) {
        let hours = Math.floor(minutes / 60);
        let mins = minutes % 60;

        // Ensure hours are within 0-23 range
        hours = Math.max(0, Math.min(23, hours));
        mins = Math.max(0, Math.min(59, mins));

        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    // Add an edge to the graph
    addEdge(from, to, arrivalTime, departureTime, cost, mode) {
        const at = this.parseminutes(arrivalTime);
        const dt = this.parseminutes(departureTime);
        
        // Ensure storage has enough space
        while (this.storage.length <= from) {
            this.storage.push([]);
        }
        while (this.storage[from].length <= to) {
            this.storage[from].push([]);
        }

        // Add edge to storage
        const edgeInfo = { arrivalTime: at, departureTime: dt, cost, mode: this.modeStringtoNum[mode] };
        this.storage[from][to].push(edgeInfo);
        
        // Add to storage2
        this.storage2[from][to][this.modeStringtoNum[mode]] = { 
            arrivalTime: at, 
            departureTime: dt, 
            cost 
        };

        // Update graph connections
        this.graph[from].push(to);
    }

    // Construct the graph with predefined connections
    constructGraph() {
        // Define city names
        const cities = {
            1: "New Delhi", 2: "Mumbai", 3: "Kolkata", 4: "Amritsar", 5: "Chennai",
            6: "Noida", 7: "Gurgaon", 8: "Ghaziabad", 9: "Faridabad", 10: "Meerut",
            11: "Thane", 12: "Navi Mumbai", 13: "Pune", 14: "Nagpur", 15: "Aurangabad",
            16: "Howrah", 17: "Durgapur", 18: "Asansol", 19: "Siliguri", 20: "Kharagpur",
            21: "Ludhiana", 22: "Jalandhar", 23: "Patiala", 24: "Bathinda", 25: "Rajpura",
            26: "Coimbatore", 27: "Madurai", 28: "Trichy", 29: "Salem", 30: "Vellore"
        };

        // Populate city maps
        for (const [id, name] of Object.entries(cities)) {
            this.cityNotoName.set(parseInt(id), name);
            this.cityNametoNo.set(name, parseInt(id));
        }

        // Add connections between Level 1 nodes
        const connections = [
            // From Delhi (1) to Mumbai (2)
            [1, 2, "09:00", "10:00", 5500, "Flight"],
            [1, 2, "10:00", "12:00", 1200, "Train"],
            [1, 2, "14:00", "15:30", 800, "Truck"],
            [1, 2, "17:00", "18:30", 350, "Seaway"],
            
            // From Mumbai (2) to Delhi (1)
            [2, 1, "08:00", "09:00", 5500, "Flight"],
            [2, 1, "11:00", "13:00", 1200, "Train"],
            [2, 1, "15:00", "16:30", 800, "Truck"],
            [2, 1, "18:00", "19:30", 350, "Seaway"],
            
            // Other Level 1 city connections can be added here
            // For example, Delhi (1) to Kolkata (3)
            [1, 3, "10:00", "11:30", 4500, "Flight"],
            [1, 3, "11:00", "13:30", 1000, "Train"],
            
            // Add more connections as needed
        ];

        // Add all predefined connections
        for (const connection of connections) {
            this.addEdge(...connection);
        }

        // Add connections for Level 2 cities
        for (const [level2, level1] of this.level2ToLevel1.entries()) {
            // Level 1 to Level 2
            this.addEdge(level1, level2, "09:30", "10:00", 50, "Train");
            this.addEdge(level1, level2, "12:00", "12:30", 100, "Flight");
            this.addEdge(level1, level2, "14:30", "15:00", 30, "Truck");
            this.addEdge(level1, level2, "16:30", "17:00", 20, "Seaway");

            // Level 2 to Level 1
            this.addEdge(level2, level1, "10:00", "10:30", 50, "Train");
            this.addEdge(level2, level1, "12:30", "13:00", 100, "Flight");
            this.addEdge(level2, level1, "08:10", "09:00", 30, "Truck");
            this.addEdge(level2, level1, "12:00", "09:00", 20, "Seaway");
        }

        // Connect Level 1 and Level 2 cities
        for (const [level2, level1] of this.level2ToLevel1.entries()) {
            this.graph[level2].push(level1);
            this.graph[level1].push(level2);
        }
    }

    // Dijkstra's algorithm to find minimum cost path
    dijkstramincost(origin, dest, arrtime) {
        // Initialize data structures
        const minArrivalTime = Array(500).fill().map(() => [Infinity, Infinity]);
        const parent = Array(500).fill(-1);
        const travelMode = Array(500).fill(-1);

        // Priority queue to store {cost, node}
        const pq = new MinPriorityQueue((a, b) => a[0] - b[0]);

        // Initialize source node
        minArrivalTime[origin] = [arrtime, 0];
        pq.push([0, origin]);

        while (!pq.isEmpty()) {
            const [currCost, currNode] = pq.pop();
            const currTime = minArrivalTime[currNode][0];

            // Skip if we've found a better path
            if (currTime > minArrivalTime[currNode][0]) continue;

            // Explore neighbors
            for (const neighbor of this.graph[currNode]) {
                if (!this.storage[currNode] || !this.storage[currNode][neighbor]) continue;

                for (const edge of this.storage[currNode][neighbor]) {
                    // Check if this edge provides a valid path
                    if (edge.arrivalTime >= currTime && 
                        currCost + edge.cost < minArrivalTime[neighbor][1]) {
                        
                        minArrivalTime[neighbor] = [edge.departureTime, currCost + edge.cost];
                        parent[neighbor] = currNode;
                        travelMode[neighbor] = edge.mode;
                        pq.push([currCost + edge.cost, neighbor]);
                    }
                }
            }
        }

        // Check if a path was found
        if (minArrivalTime[dest][0] === Infinity) {
            console.log(`No valid path found from ${this.cityNotoName.get(origin)} to ${this.cityNotoName.get(dest)}.`);
            return [-1, -1];
        }

        // Reconstruct path
        const path = [];
        const modes = [];
        let node = dest;
        while (node !== -1) {
            path.unshift(node);
            if (node !== origin) {
                modes.unshift(travelMode[node]);
            }
            node = parent[node];
        }

        // Reset route details
        this.routeDetails = {
            origin: this.cityNotoName.get(origin),
            destination: this.cityNotoName.get(dest),
            totalCost: minArrivalTime[dest][1],
            arrivalTime: this.convertMinutesToTime(minArrivalTime[dest][0]),
            route: []
        };

        // Populate route details
        for (let i = 0; i < path.length - 1; i++) {
            const from = path[i];
            const to = path[i + 1];
            const mode = modes[i];

            const routeSegment = {
                fromCity: this.cityNotoName.get(from),
                toCity: this.cityNotoName.get(to),
                mode: this.modeNumtoString[mode],
                price: this.storage2[from][to][mode].cost,
                startTime: this.convertMinutesToTime(this.storage2[from][to][mode].arrivalTime),
                endTime: this.convertMinutesToTime(this.storage2[from][to][mode].departureTime)
            };

            this.routeDetails.route.push(routeSegment);

            // Console logging for reference
            console.log(`${routeSegment.fromCity} --> ${routeSegment.toCity}`);
            console.log(`Mode: ${routeSegment.mode}`);
            console.log(`Price: ${routeSegment.price}`);
            console.log(`Timing: ${routeSegment.startTime} - ${routeSegment.endTime}`);
        }

        return [minArrivalTime[dest][0], minArrivalTime[dest][1]];
    }

    // Main method to run the routing
    runRouting(origin, dest, arrivalTime) {
        this.constructGraph();
        
        console.log(`Origin: ${this.cityNotoName.get(origin)}, Destination: ${this.cityNotoName.get(dest)}`);
        
        const [arrTime, minCost] = this.dijkstramincost(origin, dest, this.parseminutes(arrivalTime));
        
        console.log(`Minimum cost is: ${minCost}`);
        console.log(`When minimized cost, the parcel will arrive at: ${this.convertMinutesToTime(arrTime)}`);

        // Return the structured route details
        return this.routeDetails;
    }
}

// Simple MinPriorityQueue implementation
class MinPriorityQueue {
    constructor(comparator) {
        this.heap = [];
        this.comparator = comparator || ((a, b) => a - b);
    }

    push(val) {
        this.heap.push(val);
        this.bubbleUp(this.heap.length - 1);
    }

    pop() {
        const top = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.bubbleDown(0);
        }
        return top;
    }

    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.comparator(this.heap[parentIndex], this.heap[index]) <= 0) break;
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }

    bubbleDown(index) {
        const length = this.heap.length;
        while (true) {
            let smallest = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;

            if (leftChild < length && this.comparator(this.heap[leftChild], this.heap[smallest]) < 0) {
                smallest = leftChild;
            }

            if (rightChild < length && this.comparator(this.heap[rightChild], this.heap[smallest]) < 0) {
                smallest = rightChild;
            }

            if (smallest === index) break;

            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}

// Example usage
function main() {
    const router = new TransportRouter();
    const origin = 8;  // Ghaziabad
    const dest = 2;    // Mumbai
    const arrivalTime = "07:30";

    // Run routing and get route details
    const routeDetails = router.runRouting(origin, dest, arrivalTime);
    
    // Convert route details to JSON
    console.log(routeDetails);
    const jsonOutput = JSON.stringify(routeDetails, null, 2);
    console.log('\nRoute Details JSON:');
    console.log(jsonOutput);

    return routeDetails;
}

// Run the main function
main();