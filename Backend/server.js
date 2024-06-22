const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());

app.use('/artifacts', express.static(path.join(__dirname, 'Artifacts')));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
