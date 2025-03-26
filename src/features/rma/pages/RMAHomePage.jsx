import { Box } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { axisClasses } from "@mui/x-charts/ChartsAxis"; // Ensure correct import

const dataset = [
    { week: 'Week 1', RMAsent: 10, RMAcompleted: 8 },
    { week: 'Week 2', RMAsent: 12, RMAcompleted: 10 },
];

const valueFormatter = (value) => `${value}`;

const chartSetting = {
    yAxis: [
      {
        label: 'Number of parts',
      },
    ],
    width: 1000,  
    height: 500,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: 'translate(-20px, 0)',
      },
    },
};

function RMAHomePage() {
    return (
        <Box 
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflowX: "auto",
                marginTop: "100px",
                width: "100%",
                maxWidth: "95vw",
            }}
        >
            <BarChart
                dataset={dataset}
                xAxis={[{ scaleType: 'band', dataKey: 'week' }]}
                series={[
                    { 
                        dataKey: 'RMAsent', 
                        label: 'RMA Sent', 
                        valueFormatter, 
                        color: "#D7B943",
                        layoutPadding: 0.2, // Adjusts bar thickness
                    },
                    { 
                        dataKey: 'RMAcompleted', 
                        label: 'RMA Completed', 
                        valueFormatter, 
                        color: "#008080",
                        layoutPadding: 0.2, // Adjusts bar thickness
                    },
                ]}
                {...chartSetting}
            />
        </Box>
    );
}

export default RMAHomePage;
