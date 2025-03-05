#include <iostream>
#include <vector>
#include <queue>
#include <climits>

using namespace std;

class Graph {
public:
    int V; // Number of vertices
    vector<vector<int>> capacity; // Capacity matrix
    vector<vector<int>> adj; // Adjacency list

    Graph(int V) {
        this->V = V;
        capacity = vector<vector<int>>(V, vector<int>(V, 0));
        adj = vector<vector<int>>(V);
    }

    // Add an edge to the graph
    void addEdge(int u, int v, int cap) {
        capacity[u][v] += cap; // Add capacity in the forward direction
        adj[u].push_back(v);    // Add v to u's adjacency list
        adj[v].push_back(u);    // Add u to v's adjacency list (for the residual graph)
    }

    // Perform BFS to find an augmenting path from source to sink
    bool bfs(int source, int sink, vector<int>& parent) {
        vector<bool> visited(V, false);
        queue<int> q;
        q.push(source);
        visited[source] = true;

        while (!q.empty()) {
            int u = q.front();
            q.pop();

            for (int v : adj[u]) {
                if (!visited[v] && capacity[u][v] > 0) { // Check for available capacity
                    q.push(v);
                    visited[v] = true;
                    parent[v] = u;

                    if (v == sink) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Implement the Edmonds-Karp algorithm for Maximum Flow
    int edmondsKarp(int source, int sink) {
        vector<int> parent(V, -1); // To store the path
        int maxFlow = 0;

        // Augment the flow while there is a path from source to sink
        while (bfs(source, sink, parent)) {
            int pathFlow = INT_MAX;

            // Find the maximum flow through the path found by BFS
            for (int v = sink; v != source; v = parent[v]) {
                int u = parent[v];
                pathFlow = min(pathFlow, capacity[u][v]);
            }

            // Update the capacities of the edges and the reverse edges along the path
            for (int v = sink; v != source; v = parent[v]) {
                int u = parent[v];
                capacity[u][v] -= pathFlow; // Reduce forward edge capacity
                capacity[v][u] += pathFlow; // Increase reverse edge capacity
            }

            maxFlow += pathFlow;
        }
        return maxFlow;
    }
};

int main() {
    int V = 6; // Number of vertices in the graph
    Graph g(V);

    // Add edges (u, v, capacity)
    g.addEdge(0, 1, 16);
    g.addEdge(0, 2, 13);
    g.addEdge(1, 2, 10);
    g.addEdge(1, 3, 12);
    g.addEdge(2, 1, 4);
    g.addEdge(2, 4, 14);
    g.addEdge(3, 2, 9);
    g.addEdge(3, 5, 20);
    g.addEdge(4, 3, 7);
    g.addEdge(4, 5, 4);

    int source = 0; // Source node
    int sink = 5;   // Sink node

    cout << "Maximum Flow: " << g.edmondsKarp(source, sink) << endl;

    return 0;
}