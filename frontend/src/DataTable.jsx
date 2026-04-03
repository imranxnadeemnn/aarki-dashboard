import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

export default function DataTable({ data }) {
    if (!data || data.length === 0) return <p>No data</p>;

    const headers = Object.keys(data[0]);

    return (
        <Table>
            <TableHead>
                <TableRow>
                    {headers.map((h) => <TableCell key={h}>{h}</TableCell>)}
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((row, i) => (
                    <TableRow key={i}>
                        {headers.map((h) => (
                            <TableCell key={h}>{row[h]}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}