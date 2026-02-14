require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { calculateROI } = require('./roiEngine');
const { generateInvestmentAdvice, DEFAULT_ADVICE } = require('./aiAdvisor');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/analyze-roi', async (req, res) => {
  try {
    const { lat, lon, ndvi, change, landType } = req.body;

    if (lat == null || lon == null || ndvi == null || change == null || landType == null) {
      return res.status(400).json({
        error: 'Missing required fields: lat, lon, ndvi, change, landType',
      });
    }

    console.log("Incoming request:", req.body);

    const roiResult = await calculateROI(req.body);
    console.log("ROI RESULT:", roiResult);

    const context = { ...req.body, ...roiResult };
    const aiAdvice = generateInvestmentAdvice(context);
    console.log("Sending to AI:", roiResult);

    const payload = {
      growthScore: Number(roiResult?.growthScore) || 0,
      futureValue: Number(roiResult?.futureValue) || 0,
      roi5yr: Number(roiResult?.roi5yr) || 0,
      roi10yr: Number(roiResult?.roi10yr) || 0,
      aiAdvice: aiAdvice && typeof aiAdvice === 'object' ? aiAdvice : DEFAULT_ADVICE
    };
    console.log("Sending response:", payload);

    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Analysis failed', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`ROI Intelligence API running at http://localhost:${PORT}`);
});
