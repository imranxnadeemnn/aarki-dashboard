import { Container, Paper, Typography } from "@mui/material";
import { useState } from "react";
import ReportForm from "./ReportForm";
import DataTable from "./DataTable";
import ChartView from "./ChartView";

function App() {
    const [data, setData] = useState([]);

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" sx={{ mt: 3 }}>
                Aarki Cost Reporting Dashboard
            </Typography>

            <Paper sx={{ p: 3, mt: 2 }}>
                <ReportForm setData={setData} />
            </Paper>

            <Paper sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6">Cost Trend</Typography>
                <ChartView data={data} />
            </Paper>

            <Paper sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6">Report Data</Typography>
                <DataTable data={data} />
            </Paper>
        </Container>
    );
}

export default App;