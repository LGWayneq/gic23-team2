// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Soft UI Dashboard React components
import SuiBox from "components/SuiBox";
import SuiTypography from "components/SuiTypography";

// Soft UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Table from "examples/Table";

// Custom styles for the Tables
import styles from "layouts/tables/styles";

// Data
import instrumentTable from "layouts/analytics/data/instrumentTable";

import React, { useRef } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';



function Analytics() {
  const classes = styles();
  const { columns: prCols, rows: prRows } = instrumentTable;
  const [value, setValue] = React.useState(dayjs('year-month-day'));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SuiBox py={3}>
        <SuiBox mb={3}>
          <Card>

            <SuiBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DesktopDatePicker']}>
                  <DemoItem label="Start Date">
                    <DesktopDatePicker defaultValue={dayjs()} />
                  </DemoItem>
                  <DemoItem label="End Date">
                    <DesktopDatePicker defaultValue={dayjs()} />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </SuiBox>

            <SuiBox mb={3}>
              <Grid container spacing={3}>
                <Grid item xs={8}>
                  <Card className="h-100" style={{ paddingLeft: '10px' }}>
                    <SuiBox p={2}>
                      <SuiBox display="flex" flexDirection="column" height="100%">
                        <SuiTypography variant="h5" fontWeight="bold">
                          Time Series Forecasting
                        </SuiTypography>
                        <SuiBox mb={6}>
                          <SuiTypography variant="body2" textColor="text">
                            Insights about instrument performance
                          </SuiTypography>
                        </SuiBox>
                        <SuiTypography
                          component="a"
                          href="#"
                          variant="button"
                          textColor="text"
                          fontWeight="medium"
                          customClass={classes.buildByDevelopers_button}
                        >
                          Read More
                        </SuiTypography>
                      </SuiBox>
                    </SuiBox>
                  </Card>
                </Grid>

                <Grid item xs={4}>
                  <Card className="h-100" style={{ paddingTop: "15px", paddingLeft: '15px', paddingBottom: "10px" }}>
                    <SuiTypography variant="h5" fontWeight="bold">
                      Details
                    </SuiTypography>
                    <SuiBox>
                      <SuiTypography variant="button" fontWeight="bold" textTransform="capitalize">
                        Country:
                      </SuiTypography>
                      <SuiTypography variant="button" fontWeight="regular" textColor="text" padding="10px">
                        test
                      </SuiTypography>
                    </SuiBox>
                    <SuiBox>
                      <SuiTypography variant="button" fontWeight="bold" textTransform="capitalize">
                        Currency:
                      </SuiTypography>
                      <SuiTypography variant="button" fontWeight="regular" textColor="text" padding="10px">
                        test
                      </SuiTypography>
                    </SuiBox>
                    <SuiBox>
                      <SuiTypography variant="button" fontWeight="bold" textTransform="capitalize">
                        Sector:
                      </SuiTypography>
                      <SuiTypography variant="button" fontWeight="regular" textColor="text" padding="10px">
                        test
                      </SuiTypography>
                    </SuiBox>
                    <SuiBox>
                      <SuiTypography variant="button" fontWeight="bold" textTransform="capitalize">
                        Instrument Type:
                      </SuiTypography>
                      <SuiTypography variant="button" fontWeight="regular" textColor="text" padding="10px">
                        test
                      </SuiTypography>
                    </SuiBox>
                    <SuiBox>
                      <SuiTypography variant="button" fontWeight="bold" textTransform="capitalize">
                        Created At:
                      </SuiTypography>
                      <SuiTypography variant="button" fontWeight="regular" textColor="text" padding="10px">
                        test
                      </SuiTypography>
                    </SuiBox>
                    <SuiBox>
                      <SuiTypography variant="button" fontWeight="bold" textTransform="capitalize">
                        Modified At:
                      </SuiTypography>
                      <SuiTypography variant="button" fontWeight="regular" textColor="text" padding="10px">
                        test
                      </SuiTypography>
                    </SuiBox>
                    <SuiBox>
                      <SuiTypography variant="button" fontWeight="bold" textTransform="capitalize">
                        Remarks:
                      </SuiTypography>
                      <SuiTypography variant="button" fontWeight="regular" textColor="text" padding="10px">
                        test
                      </SuiTypography>
                    </SuiBox>
                  </Card>
                </Grid>

              </Grid>
            </SuiBox>
          </Card>
        </SuiBox>

        <Card>
          <SuiBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
            <SuiTypography variant="h5" fontWeight="bold">
              Instrument Peformance
            </SuiTypography>
          </SuiBox>
          <SuiBox customClass={classes.tables_table}>
            <Table columns={prCols} rows={prRows} />
          </SuiBox>
        </Card>
      </SuiBox>
    </DashboardLayout>
  );
}

export default Analytics;