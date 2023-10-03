import { useState } from "react";
import Card from "@mui/material/Card";
import SuiBox from "components/SuiBox";
import SuiInput from "components/SuiInput";
import SuiTypography from "components/SuiTypography";
import Box from '@mui/material/Box';
import TableComponent from "../../instruments/components/Table";
import ChatbotButton from "./ChatbotButton";
import { useEffect } from "react";
import { get } from "api/api";

export default function TopN() {
    const [n, setN] = useState(3)
    const [data, setData] = useState([]);

    function processResult(res) {
        const result = [];
        for (const [key, value] of Object.entries(JSON.parse(res))) {
            result.push({ fundName: key, investmentReturns: `${value.toFixed(2)}%` });
        }
        result.sort(function (a, b) {
            return b.investmentReturns - a.investmentReturns;
        })

        return result.map((item, index) => { return { ranking: index + 1, ...item } });
    }

    async function fetchData() {
        const res = await get(`/analytics/returns/topN`);
        setData(processResult(res.data));
    }

    useEffect(() => {
        fetchData();
    }, [n]);

    return (
        <SuiBox mb={3}>
            <Card>
                <SuiBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                    <Box>
                        <SuiTypography variant="h5" fontWeight="bold" >
                            Top N Fund Ranking
                        </SuiTypography>
                        <SuiInput
                            sx={{ marginTop: 2 }}
                            value={n}
                            onChange={(e) => setN(e.target.value)} />
                    </Box>
                </SuiBox>
                <SuiBox>
                    <TableComponent
                        data={data.slice(0, n)} />
                    <ChatbotButton></ChatbotButton>
                </SuiBox>
            </Card>
        </SuiBox>
    )
}