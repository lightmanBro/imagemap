function areArraysConnected(arrays) {
    for (let i = 0; i < arrays.length - 1; i++) {
        for (let j = i + 1; j < arrays.length; j++) {
            if (arrays[i].some(num => arrays[j].includes(num))) {
                return arrays[i]; // Found a common number, arrays are connected
            }
        }
    }
    return false; // No common numbers found, arrays are not connected
}

const arrays = [
    [1, 2, 3, 4],
    [4, 5, 6],
    [6, 7, 8],
    [9, 10, 11]
];

console.log(areArraysConnected(arrays)); // Output: false
