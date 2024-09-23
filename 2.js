function hitungVoucher(voucher, totalBelanja, uangBayar) {
    let diskon = 0;
    let uangYangHarusDibayar = totalBelanja;
  
    if (voucher === 'DumbWaysJos' && totalBelanja >= 50000) {
      diskon = totalBelanja * 0.211;
      if (diskon > 20000) {
        diskon = 20000;
      }
      uangYangHarusDibayar = totalBelanja - diskon;
    } else if (voucher === 'DumbWaysMantap' && totalBelanja >= 80000) {
      diskon = totalBelanja * 0.30;
      if (diskon > 40000) {
        diskon = 40000;
      }
      uangYangHarusDibayar = totalBelanja - diskon;
    } else {
      console.log('Voucher tidak berlaku atau total belanja tidak memenuhi syarat.');
      return;
    }
  
    let kembalian = uangBayar - uangYangHarusDibayar;
  
    console.log('Uang yang harus dibayar : ' + uangYangHarusDibayar);
    console.log('Diskon : ' + diskon);
    console.log('Kembalian : ' + kembalian);
  }
  
  // Contoh penggunaan:
  hitungVoucher('DumbWaysJos', 100000, 100000);  