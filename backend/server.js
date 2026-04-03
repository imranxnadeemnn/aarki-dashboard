const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { Parser } = require("json2csv");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Health route (IMPORTANT)
app.get("/", (req, res) => {
    res.send("Backend is alive");
});

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

        const response = await axios.get(
            "https://encore.aarki.com/dsp/api/v2/account_summary.json",
            {
                params: {
                    token,
                    start_date,
                    end_date,
                    by_campaign,
                    by_country,
                    by_platform
                }
            }
        );

        res.json(response.data);

    } catch (err) {
        console.error("API Error:", err.message);
        res.status(500).json({ error: "API failed" });
    }
});

// CSV
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

        const response = await axios.get(
            "https://encore.aarki.com/dsp/api/v2/account_summary.json",
            {
                params: {
                    token,
                    start_date,
                    end_date,
                    by_campaign,
                    by_country,
                    by_platform
                }
            }
        );

        const parser = new Parser();
        const csv = parser.parse(response.data);

        res.header("Content-Type", "text/csv");
        res.attachment("report.csv");
        res.send(csv);

    } catch (err) {
        console.error("CSV Error:", err.message);
        res.status(500).json({ error: "CSV failed" });
    }
});

// 🔥 CRITICAL: keep server alive
const server = app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});

// Prevent exit
process.stdin.resume();

// Debug exits
process.on("exit", (code) => {
    console.log("Process exiting with code:", code);
});

process.on("SIGINT", () => {
    console.log("SIGINT received");
    server.close(() => process.exit(0));
});