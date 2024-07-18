const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 5001;

app.use(cors());
app.use('/artifacts', express.static(path.join(__dirname, 'Artifacts')));

app.get('/artifacts/spagghetiDEX.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'Artifacts', 'spagghetiDEX.json'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
