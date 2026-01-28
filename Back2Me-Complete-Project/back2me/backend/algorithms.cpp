/*
========================================
BACK2ME - C++ ALGORITHM IMPLEMENTATIONS
SEARCH OPTIMIZATION & SORTING
========================================
*/

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <ctime>
using namespace std;

// ===== DATA STRUCTURES =====

struct Post {
    int id;
    int userId;
    string status;
    string itemName;
    string location;
    string description;
    time_t createdAt;
    
    Post(int i, int u, string s, string n, string l, string d, time_t t) 
        : id(i), userId(u), status(s), itemName(n), location(l), description(d), createdAt(t) {}
};

// ===== SEARCH ALGORITHMS =====

/**
 * Linear Search - O(n) time complexity
 * Searches through all posts linearly to find matches
 */
vector<Post> linearSearch(const vector<Post>& posts, const string& query) {
    vector<Post> results;
    
    // Convert query to lowercase for case-insensitive search
    string lowerQuery = query;
    transform(lowerQuery.begin(), lowerQuery.end(), lowerQuery.begin(), ::tolower);
    
    // Search through all posts
    for (const Post& post : posts) {
        // Convert fields to lowercase
        string lowerItemName = post.itemName;
        string lowerLocation = post.location;
        string lowerDescription = post.description;
        
        transform(lowerItemName.begin(), lowerItemName.end(), lowerItemName.begin(), ::tolower);
        transform(lowerLocation.begin(), lowerLocation.end(), lowerLocation.begin(), ::tolower);
        transform(lowerDescription.begin(), lowerDescription.end(), lowerDescription.begin(), ::tolower);
        
        // Check if query matches any field
        if (lowerItemName.find(lowerQuery) != string::npos ||
            lowerLocation.find(lowerQuery) != string::npos ||
            lowerDescription.find(lowerQuery) != string::npos) {
            results.push_back(post);
        }
    }
    
    return results;
}

/**
 * Boyer-Moore String Matching - More efficient for longer patterns
 * Time complexity: O(n/m) best case, O(nm) worst case
 */
int boyerMooreSearch(const string& text, const string& pattern) {
    int n = text.length();
    int m = pattern.length();
    
    if (m == 0) return 0;
    if (m > n) return -1;
    
    // Bad character table
    int badChar[256];
    for (int i = 0; i < 256; i++) {
        badChar[i] = -1;
    }
    for (int i = 0; i < m; i++) {
        badChar[(int)pattern[i]] = i;
    }
    
    // Search
    int shift = 0;
    while (shift <= (n - m)) {
        int j = m - 1;
        
        while (j >= 0 && pattern[j] == text[shift + j]) {
            j--;
        }
        
        if (j < 0) {
            return shift;
        } else {
            shift += max(1, j - badChar[(int)text[shift + j]]);
        }
    }
    
    return -1;
}

/**
 * Optimized search using Boyer-Moore
 */
vector<Post> optimizedSearch(const vector<Post>& posts, const string& query) {
    vector<Post> results;
    
    string lowerQuery = query;
    transform(lowerQuery.begin(), lowerQuery.end(), lowerQuery.begin(), ::tolower);
    
    for (const Post& post : posts) {
        string lowerItemName = post.itemName;
        string lowerLocation = post.location;
        string lowerDescription = post.description;
        
        transform(lowerItemName.begin(), lowerItemName.end(), lowerItemName.begin(), ::tolower);
        transform(lowerLocation.begin(), lowerLocation.end(), lowerLocation.begin(), ::tolower);
        transform(lowerDescription.begin(), lowerDescription.end(), lowerDescription.begin(), ::tolower);
        
        // Use Boyer-Moore for pattern matching
        if (boyerMooreSearch(lowerItemName, lowerQuery) != -1 ||
            boyerMooreSearch(lowerLocation, lowerQuery) != -1 ||
            boyerMooreSearch(lowerDescription, lowerQuery) != -1) {
            results.push_back(post);
        }
    }
    
    return results;
}

// ===== SORTING ALGORITHMS =====

/**
 * Quick Sort - O(n log n) average, O(n²) worst case
 * Sorts posts by creation time (newest first)
 */
int partition(vector<Post>& posts, int low, int high) {
    time_t pivot = posts[high].createdAt;
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (posts[j].createdAt > pivot) { // Descending order (newest first)
            i++;
            swap(posts[i], posts[j]);
        }
    }
    
    swap(posts[i + 1], posts[high]);
    return i + 1;
}

void quickSort(vector<Post>& posts, int low, int high) {
    if (low < high) {
        int pi = partition(posts, low, high);
        quickSort(posts, low, pi - 1);
        quickSort(posts, pi + 1, high);
    }
}

/**
 * Merge Sort - O(n log n) guaranteed
 * More stable than Quick Sort
 */
void merge(vector<Post>& posts, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    vector<Post> L, R;
    for (int i = 0; i < n1; i++)
        L.push_back(posts[left + i]);
    for (int j = 0; j < n2; j++)
        R.push_back(posts[mid + 1 + j]);
    
    int i = 0, j = 0, k = left;
    
    while (i < n1 && j < n2) {
        if (L[i].createdAt >= R[j].createdAt) { // Descending order
            posts[k] = L[i];
            i++;
        } else {
            posts[k] = R[j];
            j++;
        }
        k++;
    }
    
    while (i < n1) {
        posts[k] = L[i];
        i++;
        k++;
    }
    
    while (j < n2) {
        posts[k] = R[j];
        j++;
        k++;
    }
}

void mergeSort(vector<Post>& posts, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(posts, left, mid);
        mergeSort(posts, mid + 1, right);
        merge(posts, left, mid, right);
    }
}

/**
 * Heap Sort - O(n log n) time, O(1) space
 */
void heapify(vector<Post>& posts, int n, int i) {
    int smallest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    
    if (left < n && posts[left].createdAt < posts[smallest].createdAt)
        smallest = left;
    
    if (right < n && posts[right].createdAt < posts[smallest].createdAt)
        smallest = right;
    
    if (smallest != i) {
        swap(posts[i], posts[smallest]);
        heapify(posts, n, smallest);
    }
}

void heapSort(vector<Post>& posts) {
    int n = posts.size();
    
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(posts, n, i);
    
    for (int i = n - 1; i > 0; i--) {
        swap(posts[0], posts[i]);
        heapify(posts, i, 0);
    }
}

// ===== UTILITY FUNCTIONS =====

void printPost(const Post& post) {
    cout << "ID: " << post.id << endl;
    cout << "Item: " << post.itemName << endl;
    cout << "Location: " << post.location << endl;
    cout << "Status: " << post.status << endl;
    cout << "---" << endl;
}

void printResults(const vector<Post>& results) {
    cout << "Found " << results.size() << " results:" << endl;
    for (const Post& post : results) {
        printPost(post);
    }
}

// ===== PERFORMANCE TESTING =====

void testSearchPerformance() {
    // Create sample data
    vector<Post> posts;
    posts.push_back(Post(1, 1, "lost", "Blue Backpack", "Library", "Lost near table 5", time(0) - 3600));
    posts.push_back(Post(2, 2, "found", "iPhone 13", "Cafeteria", "Found on table", time(0) - 7200));
    posts.push_back(Post(3, 3, "lost", "Water Bottle", "Gym", "Silver bottle", time(0) - 10800));
    posts.push_back(Post(4, 4, "found", "Wallet", "Engineering Building", "Black wallet", time(0) - 14400));
    posts.push_back(Post(5, 5, "lost", "AirPods", "Auditorium", "White AirPods case", time(0) - 18000));
    
    string query = "phone";
    
    // Test Linear Search
    clock_t start = clock();
    vector<Post> results1 = linearSearch(posts, query);
    clock_t end = clock();
    double time1 = double(end - start) / CLOCKS_PER_SEC * 1000;
    
    cout << "Linear Search Time: " << time1 << " ms" << endl;
    printResults(results1);
    
    // Test Optimized Search
    start = clock();
    vector<Post> results2 = optimizedSearch(posts, query);
    end = clock();
    double time2 = double(end - start) / CLOCKS_PER_SEC * 1000;
    
    cout << "Optimized Search Time: " << time2 << " ms" << endl;
    printResults(results2);
}

void testSortPerformance() {
    // Create sample data
    vector<Post> posts1, posts2, posts3;
    
    for (int i = 0; i < 10; i++) {
        Post p(i, 1, "lost", "Item " + to_string(i), "Location", "Description", time(0) - rand() % 100000);
        posts1.push_back(p);
        posts2.push_back(p);
        posts3.push_back(p);
    }
    
    // Test Quick Sort
    clock_t start = clock();
    quickSort(posts1, 0, posts1.size() - 1);
    clock_t end = clock();
    double time1 = double(end - start) / CLOCKS_PER_SEC * 1000;
    cout << "Quick Sort Time: " << time1 << " ms" << endl;
    
    // Test Merge Sort
    start = clock();
    mergeSort(posts2, 0, posts2.size() - 1);
    end = clock();
    double time2 = double(end - start) / CLOCKS_PER_SEC * 1000;
    cout << "Merge Sort Time: " << time2 << " ms" << endl;
    
    // Test Heap Sort
    start = clock();
    heapSort(posts3);
    end = clock();
    double time3 = double(end - start) / CLOCKS_PER_SEC * 1000;
    cout << "Heap Sort Time: " << time3 << " ms" << endl;
}

// ===== MAIN =====

int main() {
    cout << "========================================" << endl;
    cout << "BACK2ME - ALGORITHM PERFORMANCE TESTING" << endl;
    cout << "========================================" << endl;
    
    cout << "\n=== SEARCH ALGORITHMS ===" << endl;
    testSearchPerformance();
    
    cout << "\n=== SORTING ALGORITHMS ===" << endl;
    testSortPerformance();
    
    return 0;
}
