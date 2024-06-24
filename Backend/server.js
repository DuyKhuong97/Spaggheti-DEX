const express = require('express');
const path = require('path');
const cors = require('cors'); // Import CORS middleware

const app = express();
const port = 5000; // Bạn có thể thay đổi port nếu cần

// Sử dụng CORS để cho phép các yêu cầu từ mọi nguồn gốc
app.use(cors());

// Phục vụ các file tĩnh trong thư mục Artifacts
app.use('/artifacts', express.static(path.join(__dirname, 'Artifacts')));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
