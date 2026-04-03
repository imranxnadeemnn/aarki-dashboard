const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { Parser } = require("json2csv");

const app = express();
app.use(cors());
app.use(express.json());

const BASE_URL = "https://encore.aarki.com/dsp/api/v2/account_summary.json";

// Fetch report
app.post("/get-report", async (req, res) => {
    try {
        const {
            token,
            start_date,
            end_date,
            by_campaign,
            by_country,
            by_platform
        } = req.body;

        const response = await axios.get(BASE_URL, {
            params: {
                token,
                start_date,
                end_date,
                by_campaign,
                by_country,
                by_platform
            }
        });

        res.json(response.data);
    } catch (err) {
        res.status(500).json({
            error: err.response?.data || err.message
        });
    }
});

// CSV download
app.post("/download-csv", async (req, res) => {
    try {
        const {
            token,
            start_date,
            end_date,
            by_campaign,
            by_country,
            by_platform
        } = req.body;

        const response = await axios.get(BASE_URL, {
            params: {
                token,
                start_date,
                end_date,
                by_campaign,
                by_country,
                by_platform
            }
        });

        const parser = new Parser();
        const csv = parser.parse(response.data);

        res.header("Content-Type", "text/csv");
        res.attachment("report.csv");
        res.send(csv);

    } catch (err) {
        res.status(500).json({
            error: err.response?.data || err.message
        });
    }
});

app.listen(5000, () => {
    console.log("Backend running on http://localhost:5000");
});