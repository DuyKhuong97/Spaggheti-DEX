const x = 1; // Số lượng token AA muốn swap
const x_r = 12; // Số lượng token AA trong pool
const y_r = 8.3; // Số lượng token AB trong pool
const fee = 0.0001; // Phí giao dịch

const x_after_fee = x * (1 - fee);
const y = (x_after_fee * y_r) / (x_r + x_after_fee);

console.log(`Số lượng token AB nhận được: ${y}`);