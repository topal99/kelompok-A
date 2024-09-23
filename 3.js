function recursiveBubbleSort(arr, n = arr.length) {
    // Base case: jika panjang array tinggal satu, artinya array sudah tersortir
    if (n === 1) return arr;

    // Melakukan satu kali iterasi bubble sort
    for (let i = 0; i < n - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            // Swap elemen jika tidak dalam urutan yang benar
            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        }
    }

    // Panggil fungsi secara rekursif untuk menyortir sisa array
    return recursiveBubbleSort(arr, n - 1);
}

function sortArray(arr) {
    // Sort the array using recursive bubble sort
    const sortedArray = recursiveBubbleSort([...arr]); // Menggunakan spread operator agar tidak mengubah array asli

    // Pisahkan bilangan ganjil dan genap
    const ganjil = sortedArray.filter(num => num % 2 !== 0);
    const genap = sortedArray.filter(num => num % 2 === 0);

    // Output
    return {
        sortedArray: sortedArray,
        ganjil: ganjil,
        genap: genap
    };
}

// Contoh penggunaan
const data = [2, 24, 32, 22, 31, 100, 56, 21, 99, 7, 5, 37, 97, 25, 13, 11];
const result = sortArray(data);

console.log("Array yang sudah disusun: " + result.sortedArray.join(', '));
console.log("Bilangan ganjil: " + result.ganjil.join(', '));
console.log("Bilangan genap: " + result.genap.join(', '));