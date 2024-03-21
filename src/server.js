// Use dynamic import for ES modules
import('node-fetch').then(async (nodeFetch) => {
    const fetch = nodeFetch.default;
  
    // Your server code here
    const express = require('express');
    const app = express();
  
    app.get('/api/ppwp', async (req, res) => {
      try {
        const response = await fetch('https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp.json');
        const data = await response.json();
        res.json(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
      }
    });
  
    app.get('/api/provinces', async (req, res) => {
      try {
        const response = await fetch('https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/0.json');
        const provinceJsonData = await response.json();
        res.json(provinceJsonData);
      } catch (error) {
        console.error('Error fetching province data:', error);
        res.status(500).json({ error: 'Failed to fetch province data' });
      }
    });
  
    const port = 3001;
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  }).catch((error) => {
    console.error('Error importing node-fetch:', error);
  });
  