import {
    TextField,
    Button,
    Grid,
    Switch,
    FormControlLabel,
    CircularProgress
} from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";
import axios from "axios";

export default function ReportForm({ setData }) {
    const [token, setToken] = useState("yvl5t4ona3541uj7tsojzghavc0mw1xt");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const [filters, setFilters] = useState({
        by_campaign: true,
        by_country: true,
        by_platform: true
    });

    const setPresetDays = (days) => {
        const end = dayjs();
        const start = end.subtract(days - 1, "day");

        setStartDate(start.format("YYYY-MM-DD"));
        setEndDate(end.format("YYYY-MM-DD"));
    };

    const handleFetch = async () => {
        if (cooldown > 0) return;

        setCooldown(60);
        const interval = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        setLoading(true);

        try {
            const res = await axios.post("http://localhost:5000/get-report", {
                token,
                start_date: startDate,
                end_date: endDate,
                by_campaign: filters.by_campaign ? 'y' : 'n',
                by_country: filters.by_country ? 'y' : 'n',
                by_platform: filters.by_platform ? 'y' : 'n'
            });

            setData(res.data);
        } catch (err) {
            alert("Error fetching data");
        }

        setLoading(false);
    };

    const handleDownload = async () => {
        const res = await axios.post(
            "http://localhost:5000/download-csv",
            {
                token,
                start_date: startDate,
                end_date: endDate,
                by_campaign: filters.by_campaign ? 'y' : 'n',
                by_country: filters.by_country ? 'y' : 'n',
                by_platform: filters.by_platform ? 'y' : 'n'
            },
            { responseType: "blob" }
        );

        const url = window.URL.createObjectURL(res.data);
        const a = document.createElement("a");
        a.href = url;
        a.download = "report.csv";
        a.click();
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                />
            </Grid>

            <Grid item xs={6}>
                <TextField
                    type="date"
                    label="Start Date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </Grid>

            <Grid item xs={6}>
                <TextField
                    type="date"
                    label="End Date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </Grid>

            <Grid item xs={12}>
                <Button onClick={() => setPresetDays(1)}>Last 1 Day</Button>
                <Button onClick={() => setPresetDays(2)}>Last 2 Days</Button>
                <Button onClick={() => setPresetDays(3)}>Last 3 Days</Button>
            </Grid>

            <Grid item xs={12}>
                <FormControlLabel
                    control={<Switch checked={filters.by_campaign} onChange={(e) => setFilters({...filters, by_campaign: e.target.checked})} />}
                    label="Campaign"
                />
                <FormControlLabel
                    control={<Switch checked={filters.by_country} onChange={(e) => setFilters({...filters, by_country: e.target.checked})} />}
                    label="Country"
                />
                <FormControlLabel
                    control={<Switch checked={filters.by_platform} onChange={(e) => setFilters({...filters, by_platform: e.target.checked})} />}
                    label="Platform"
                />
            </Grid>

            <Grid item xs={6}>
                <Button variant="contained" fullWidth onClick={handleFetch} disabled={cooldown > 0 || loading}>
                    {cooldown > 0 ? `Wait ${cooldown}s` : "Fetch"}
                </Button>
            </Grid>

            <Grid item xs={6}>
                <Button variant="outlined" fullWidth onClick={handleDownload}>
                    Download CSV
                </Button>
            </Grid>

            {loading && <CircularProgress />}
        </Grid>
    );
}