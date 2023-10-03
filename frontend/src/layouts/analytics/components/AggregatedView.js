import { useState } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import SuiBox from "components/SuiBox";
import SuiInput from "components/SuiInput";
import SuiTypography from "components/SuiTypography";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import TableComponent from "../../instruments/components/Table";
import ChatbotButton from "./ChatbotButton";
import { useEffect } from "react";
import { get } from "api/api";
import Loading from "components/Loading";

export default function AggregatedView(props) {
    const { aggregateKey } = props;
    const [fundId, setFundId] = useState(1);
    const [startDate, setStartDate] = useState(dayjs("2022-01-01"));
    const [endDate, setEndDate] = useState(dayjs());
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    function formatDayjs(date) {
        return date.format('YYYY-MM-DD');
    }
    
    async function fetchData() {
        setLoading(true);
        const res = await get(`/analytics/${aggregateKey}/${fundId}/${formatDayjs(startDate)}/${formatDayjs(endDate)}`);
        setData(res.data.map((item) => ({ name: item._id , ...item })));
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [fundId, startDate, endDate]);

    return (
        <SuiBox mb={3}>
            <Card>
                {loading && <Loading />}
                <SuiBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                    <Box>
                        <SuiTypography variant="h5" fontWeight="bold" >
                            Aggregated View ({aggregateKey})
                        </SuiTypography>
                        <Box sx={{ marginTop: "12px" }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                <SuiTypography variant="h6" >
                                    Fund ID:
                                </SuiTypography>
                                <SuiInput
                                    style={{ height: 42, width: 200 }}
                                    value={fundId}
                                    onChange={(e) => setFundId(e.target.value)} />
                            </Box>
                        </Box>
                    </Box>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DesktopDatePicker']}>
                            <DemoItem label="Start Date" sx={{ mb: "2px" }} >
                                <DesktopDatePicker
                                    value={startDate}
                                    onChange={setStartDate} />
                            </DemoItem>
                            <DemoItem label="End Date">
                                <DesktopDatePicker
                                    value={endDate}
                                    onChange={setEndDate} />
                            </DemoItem>
                        </DemoContainer>
                    </LocalizationProvider>
                </SuiBox>

                <SuiBox>
                    <Card style={{ borderRadius: 0 }}>
                        <TableComponent
                            data={data} />
                        <ChatbotButton />
                        <SuiBox sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: "0px" }} >
                        </SuiBox>
                    </Card>

                </SuiBox>
            </Card>
        </SuiBox>
    )
}