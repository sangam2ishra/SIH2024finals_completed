#include <bits/stdc++.h>
using namespace std;

// Structure to store edge information
struct EdgeInfo {
    int arrivalTime;     // Arrival time at the destination
    int departureTime;   // Departure time from the source
    int cost;            // Travel cost in INR
    int mode;         // Mode of transport//1 means by air
};

struct EdgeInfo2 {
    int arrivalTime;     // Arrival time at the destination
    int departureTime;   // Departure time from the source
    int cost;            // Travel cost in INR
};

// Graph representation using 2D vector (matrix) with edges stored in vector<EdgeInfo>
vector<vector<vector<EdgeInfo>>> storage;
EdgeInfo2 storage2[500][500][5];
vector<vector<int>> graph(500);

// Map to retrieve city names from their numeric IDs
map<int, string> cityNotoName;
map<string, int> cityNametoNo;

// Map Level 2 nodes to their corresponding Level 1 nodes using numeric IDs
map<int, int> level2ToLevel1 = {
    {6, 1}, {7, 1}, {8, 1}, {9, 1},{10, 1}, // Noida, Gurgaon, Ghaziabad, Faridabad, Meerut -> Delhi
    {11, 2}, {12, 2}, {13, 2}, {14, 2},{15, 2}, // Thane, Navi Mumbai, Pune, Nagpur, Aurangabad -> Mumbai
    {16, 3}, {17, 3}, {18, 3}, {19, 3}, {20, 3}, // Howrah, Durgapur, Asansol, Siliguri, Kharagpur -> Kolkata
    {21, 4}, {22, 4}, {23, 4}, {24, 4}, {25, 4}, // Amritsar, Ludhiana, Jalandhar, Patiala, Bathinda -> Punjab
    {26, 5}, {27, 5}, {28, 5}, {29, 5}, {30, 5}  // Coimbatore, Madurai, Trichy, Salem, Vellore -> Chennai
};

map<string,int> modeStringtoNum={{"Flight",1},{"Train",2},{"Truck",3},{"Seaway",4}};

// Function to parse time in HH:MM format to minutes
int parseminutes(const string& time) {
    int hour = stoi(time.substr(0, 2));
    int minute = stoi(time.substr(3, 2));
    return hour * 60 + minute;
}

// Function to convert time in minutes to original HH:MM format
string convertMinutesToTime(int minutes) {
    int hours = minutes / 60;
    int mins = minutes % 60;

    // Ensure hours are within the 0-23 range
    if (hours < 0) hours = 0;
    if (hours >= 24) hours = 23;

    // Ensure minutes are within the 0-59 range
    if (mins < 0) mins = 0;
    if (mins >= 60) mins = 59;

    char timeStr[6];  // To store the formatted time as a string

    // Use snprintf to format time, ensure it's not exceeding buffer size
    snprintf(timeStr, sizeof(timeStr), "%02d:%02d", hours, mins);

    return string(timeStr);
}

// Function to add an edge to the storage using numeric IDs
void addEdge(int from, int to, string arrivalTime, string departureTime, int cost, string mode) {
    int at = parseminutes(arrivalTime);
    int dt = parseminutes(departureTime);
    
    // Ensure the storage has enough space for the nodes
    if (from >= storage.size()) storage.resize(from + 1);
    if (to >= storage[from].size()) storage[from].resize(to + 1);

    // Add the edge to the corresponding storage location
    storage[from][to].push_back({at, dt, cost,modeStringtoNum[mode]});
    storage2[from][to][modeStringtoNum[mode]]={at, dt, cost};
    // cout<<from<<" "<<to<<" "<<modeStringtoNum[mode]<<"\n";
    graph[from].push_back(to);

}

// Hardcoded graph construction
void constructGraph() {
    // Map city names to numeric IDs (1-based indexing)
    cityNotoName[1] = "New Delhi";    // Capital city of India
    cityNotoName[2] = "Mumbai";       // Formerly known as Bombay, financial hub of India
    cityNotoName[3] = "Kolkata";      // Capital of West Bengal, major cultural and commercial hub
    cityNotoName[4] = "Amritsar";     // City in Punjab, home to the Golden Temple
    cityNotoName[5] = "Chennai";      // Capital of Tamil Nadu, known for its beaches and culture
    cityNotoName[6] = "Noida";        // Satellite city of Delhi, known for IT industries and modern infrastructure
    cityNotoName[7] = "Gurgaon";      // Major financial and tech hub in Haryana, near Delhi
    cityNotoName[8] = "Ghaziabad";    // City in Uttar Pradesh, part of the NCR, known for its industrial growth
    cityNotoName[9] = "Faridabad";    // Industrial city in Haryana, near Delhi
    cityNotoName[10] = "Meerut";      // City in Uttar Pradesh, known for its historical importance and sports industries
    cityNotoName[11] = "Thane";       // City in Maharashtra, a part of the Mumbai Metropolitan Region
    cityNotoName[12] = "Navi Mumbai"; // Planned city in Maharashtra, an extension of Mumbai
    cityNotoName[13] = "Pune";        // City in Maharashtra, known for education, IT, and cultural significance
    cityNotoName[14] = "Nagpur";      // City in Maharashtra, known for its oranges and as a major trade hub
    cityNotoName[15] = "Aurangabad";  // City in Maharashtra, known for historical sites like Ajanta and Ellora Caves
    cityNotoName[16] = "Howrah";      // City in West Bengal, part of the Kolkata Metropolitan Area
    cityNotoName[17] = "Durgapur";    // City in West Bengal, known for its steel plants and industrial growth
    cityNotoName[18] = "Asansol";     // City in West Bengal, known for coal mining and heavy industry
    cityNotoName[19] = "Siliguri";    // City in West Bengal, a gateway to Northeast India and Darjeeling
    cityNotoName[20] = "Kharagpur";   // City in West Bengal, home to IIT Kharagpur
    cityNotoName[21] = "Ludhiana";    // City in Punjab, known for its hosiery and textile industry
    cityNotoName[22] = "Jalandhar";   // City in Punjab, known for its sports goods industry
    cityNotoName[23] = "Patiala";     // City in Punjab, known for its rich cultural heritage and history
    cityNotoName[24] = "Bathinda";    // City in Punjab, known for its agricultural and industrial significance
    cityNotoName[25] = "Rajpura";     // City in Punjab, known for its agricultural and industrial significance
    cityNotoName[26] = "Coimbatore";  // City in Tamil Nadu, known for its textile industry and educational institutions
    cityNotoName[27] = "Madurai";     // City in Tamil Nadu, known for the Meenakshi Temple and its ancient history
    cityNotoName[28] = "Trichy";      // City in Tamil Nadu, known for its temples and as a hub for education
    cityNotoName[29] = "Salem";       // City in Tamil Nadu, known for its steel industry and agricultural products
    cityNotoName[30] = "Vellore";     // City in Tamil Nadu, known for the VIT University and its historical temples

    for (auto x : cityNotoName) cityNametoNo[x.second] = x.first;

    // Add connections between Level 1 nodes (numeric IDs)
    // Add more edges between 1, 2, 3, 4, and 5

    // Connections from 1 (New Delhi) to 2 (Mumbai)
    addEdge(1, 2, "09:00", "10:00", 5500, "Flight");
    addEdge(1, 2, "10:00", "12:00", 1200, "Train");
    addEdge(1, 2, "14:00", "15:30", 800, "Truck");
    addEdge(1, 2, "17:00", "18:30", 350, "Seaway");

    // Connections from 2 (Mumbai) to 3 (Kolkata)
    addEdge(2, 3, "09:00", "11:00", 6500, "Flight");
    addEdge(2, 3, "12:30", "14:00", 1300, "Train");
    addEdge(2, 3, "15:30", "17:00", 950, "Truck");
    addEdge(2, 3, "19:00", "21:00", 450, "Seaway");

    // Connections from 3 (Kolkata) to 4 (Amritsar)
    addEdge(3, 4, "10:00", "12:00", 7100, "Flight");
    addEdge(3, 4, "14:00", "16:00", 1600, "Train");
    addEdge(3, 4, "17:00", "18:30", 1050, "Truck");
    addEdge(3, 4, "20:30", "22:00", 550, "Seaway");

    // Connections from 4 (Amritsar) to 5 (Chennai)
    addEdge(4, 5, "12:00", "14:00", 8200, "Flight");
    addEdge(4, 5, "16:30", "18:00", 1700, "Train");
    addEdge(4, 5, "19:30", "21:00", 1150, "Truck");
    addEdge(4, 5, "22:30", "23:30", 650, "Seaway");

    // Connections from 1 (New Delhi) to 3 (Kolkata)
    addEdge(1, 3, "08:00", "10:00", 6000, "Flight");
    addEdge(1, 3, "12:00", "14:00", 1400, "Train");
    addEdge(1, 3, "15:30", "17:00", 900, "Truck");
    addEdge(1, 3, "17:30", "19:00", 400, "Seaway");

    // Connections from 2 (Mumbai) to 4 (Amritsar)
    addEdge(2, 4, "07:00", "09:00", 6900, "Flight");
    addEdge(2, 4, "11:00", "13:00", 1500, "Train");
    addEdge(2, 4, "14:00", "15:30", 1000, "Truck");
    addEdge(2, 4, "18:00", "19:30", 500, "Seaway");

    // Connections from 3 (Kolkata) to 5 (Chennai)
    addEdge(3, 5, "09:00", "11:00", 7500, "Flight");
    addEdge(3, 5, "12:30", "14:30", 1600, "Train");
    addEdge(3, 5, "16:00", "17:30", 1100, "Truck");
    addEdge(3, 5, "19:30", "21:00", 600, "Seaway");

    // Connections from 1 (New Delhi) to 5 (Chennai)
    addEdge(1, 5, "10:30", "12:30", 8400, "Flight");
    addEdge(1, 5, "14:30", "16:00", 1800, "Train");
    addEdge(1, 5, "17:30", "19:00", 1200, "Truck");
    addEdge(1, 5, "19:00", "20:30", 700, "Seaway");


    for (const auto& [level2, level1] : level2ToLevel1) {
        // Reversed departure and arrival times for level1 -> level2
        addEdge(level1, level2, "09:30", "10:00", 50, "Train");
        addEdge(level1, level2, "12:00", "12:30", 100, "Flight");
        addEdge(level1, level2, "14:30", "15:00", 30, "Truck");
        addEdge(level1, level2, "16:30", "17:00", 20, "Seaway");

        // Reversed departure and arrival times for level2 -> level1
        addEdge(level2, level1, "10:00", "10:30", 50, "Train");
        addEdge(level2, level1, "12:30", "13:00", 100, "Flight");
        addEdge(level2, level1, "08:10", "09:00", 30, "Truck");
        addEdge(level2, level1, "12:00", "09:00", 20, "Seaway");
    }


    for(auto x : level2ToLevel1){graph[x.first].push_back(x.second);graph[x.second].push_back(x.first);}
}


pair<int, int> dijkstramincost(int origin, int dest, int arrtime,int maxtime) {
    // Minimum cost at each node, initialized to infinity
    vector<pair<int, int>> minArrivalTime(500, {INT_MAX, INT_MAX});
    vector<int> parent(500, -1);  // To store the parent of each node
    vector<int> travelMode(500, -1);  // To store the travel mode between nodes
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;

    // Initialize the source node with the provided arrival time and 0 cost
    minArrivalTime[origin] = {arrtime, 0};
    pq.push({0, origin}); // Push {cost, node}

    while (!pq.empty()) {
        auto it = pq.top();
        pq.pop();
        int currCost = it.first;
        int currNode = it.second;
        int currTime = minArrivalTime[currNode].first;

        // If we process a node with a larger time than we have already visited, skip it
        if (currTime > minArrivalTime[currNode].first) {
            continue;
        }

        // Explore all neighbors of the current node
        for (int neighbor : graph[currNode]) {
            if (neighbor >= storage.size() || currNode >= storage.size() || neighbor >= storage[currNode].size()) {
                continue; // Skip invalid neighbors
            }

            for (const auto& edge : storage[currNode][neighbor]) {
                // Check if this edge provides a valid path (departure time >= current arrival time)
                if (edge.arrivalTime >= currTime && currCost + edge.cost < minArrivalTime[neighbor].second && edge.departureTime<=maxtime) {
                    // Update the minimum cost and arrival time at the neighbor
                    minArrivalTime[neighbor] = {edge.departureTime, currCost + edge.cost};
                    parent[neighbor] = currNode;  // Set the parent of the neighbor
                    travelMode[neighbor] = edge.mode;  // Store the mode of travel
                    pq.push({currCost + edge.cost, neighbor});
                }
            }
        }
    }

    // If no valid path is found to the destination, return {-1, -1}
    if (minArrivalTime[dest].first == INT_MAX) {
        cout << "No valid path found from " << cityNotoName[origin] << " to " << cityNotoName[dest] << ".\n";
        return {-1, -1};
    }

    // Reconstruct the path from destination to origin
    vector<int> path;
    vector<int> modes;
    for (int node = dest; node != -1; node = parent[node]) {
        path.push_back(node);
        if (node != origin) {
            modes.push_back(travelMode[node]);
        }
    }
    reverse(path.begin(), path.end());
    reverse(modes.begin(), modes.end());

    // Print the path and details
    vector<vector<int>> outpt;
    for (int i = 0; i < path.size() - 1; i++) {
        outpt.push_back({path[i], path[i + 1], modes[i]});
    }

    // Print the path and travel details
    for (auto x : outpt) {
        cout << cityNotoName[x[0]] << " --> " << cityNotoName[x[1]] << "\n";
        cout << "Mode: " << (x[2] == 1 ? "Flight" : x[2] == 2 ? "Train" : x[2] == 3 ? "Truck" : "Seaway") << "\n";
        cout << "Price: " << storage2[x[0]][x[1]][x[2]].cost << "\n";
        cout << "Timing: " << convertMinutesToTime(storage2[x[0]][x[1]][x[2]].arrivalTime) << " "
             << convertMinutesToTime(storage2[x[0]][x[1]][x[2]].departureTime) << "\n";
    }

    // Return the minimum cost and arrival time at destination
    return minArrivalTime[dest];
}





int main() {
    constructGraph();  // Construct the graph

    string originstring;
    int origin = 8; // Ghaziabad 
    int dest = 2;   // Bombay 
    cout<<"Arritime should be less than departure time of the origin node\n";
    string AT="07:30";
    // cin>>AT;
    int arrtime=parseminutes(AT);

    string maxtime="13:00";
    int deadline=parseminutes(maxtime);

    // for(int i=1;i<=30;i++){
    //     cout<<i<<"  :  ";
    //     for(auto x : graph[i])cout<<x<<" ";cout<<"\n";
    // }

    cout << "Origin: " << cityNotoName[origin] << ", Destination: " << cityNotoName[dest] << endl;

    pair<int,int> vs=dijkstramincost(origin,dest,arrtime,deadline);
    cout<<"min cost is : "<<vs.second<<"\n";
    cout<<"when minimised cost the parcel will arrive at  : "<<convertMinutesToTime(vs.first)<<"\n";
    // Print the graph for verification
    // printGraph();

    return 0;
}