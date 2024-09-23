// Fungsi untuk mengecek apakah suatu angka merupakan bilangan prima
function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

// Fungsi untuk menghasilkan bilangan prima sebanyak yang dibutuhkan
function generatePrimes(limit) {
    let primes = [];
    let num = 2;
    while (primes.length < limit) {
        if (isPrime(num)) {
            primes.push(num);
        }
        num++;
    }
    return primes;
}

// Fungsi utama untuk menggambar segitiga siku-siku dengan deret prima
function drawSikuSiku(n) {
    if (n <= 0 || n >= 10) {
        console.log("Nilai alas/tinggi harus lebih besar dari 0 dan kurang dari 10.");
        return;
    }

    // Menentukan jumlah bilangan prima yang dibutuhkan
    let totalNumbers = (n * (n + 1)) / 2;
    
    // Menghasilkan deret bilangan prima sebanyak yang dibutuhkan
    let primes = generatePrimes(totalNumbers);

    let index = 0;
    // Membuat segitiga
    for (let i = 1; i <= n; i++) {
        let row = "";
        for (let j = 0; j < i; j++) {
            row += primes[index] + " ";
            index++;
        }
        console.log(row.trim());  // Cetak baris dan hapus spasi berlebih
    }
}

// Contoh penggunaan
drawSikuSiku(7);
