import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, BarElement, LinearScale, Tooltip, Title } from "chart.js";
import { getAllLeaves } from "../api/requestApi";
import { Box, Typography, CircularProgress } from "@mui/material";

Chart.register(CategoryScale, BarElement, LinearScale, Tooltip, Title);

const AverageLeaveDurationChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const leaves = await getAllLeaves();
        if (Array.isArray(leaves) && leaves.length > 0) {
          const leaveDurations = {};
          const leaveCounts = {};

          leaves.forEach((leave) => {
            const name = `${leave.ime} ${leave.priimek}`;
            const start = new Date(leave.zacetek);
            const end = new Date(leave.konec);
            const duration = (end - start) / (1000 * 60 * 60 * 24) + 1;

            if (leaveDurations[name]) {
              leaveDurations[name] += duration;
              leaveCounts[name] += 1;
            } else {
              leaveDurations[name] = duration;
              leaveCounts[name] = 1;
            }
          });

          const employeeNames = Object.keys(leaveDurations);
          const avgDurations = employeeNames.map(
            (name) => leaveDurations[name] / leaveCounts[name]
          );

          setChartData({
            labels: employeeNames,
            datasets: [
              {
                label: "Average Leave Duration (Days)",
                data: avgDurations,
                backgroundColor: "rgba(255, 159, 64, 0.6)",
                borderColor: "rgba(255, 159, 64, 1)",
                borderWidth: 1,
              },
            ],
          });
        } else {
          setError("No data available for leave duration.");
        }
      } catch (error) {
        console.error("Error fetching leave data:", error);
        setError("Failed to fetch data.");
      }
    };

    fetchLeaveData();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: "980px",
        margin: "auto",
        padding: "2rem",
        boxShadow: 3,
        borderRadius: 2,
        marginTop: "40px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #e0e0e0",
      }}
    >
      <Typography variant="h5" component="h3" sx={{ marginBottom: "1rem" }}>
        Average Leave Duration per Employee
      </Typography>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : chartData ? (
        <Box sx={{ height: "400px" }}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Average Duration (Days)",
                  },
                  ticks: {
                    color: "#333",
                  },
                },
                x: {
                  ticks: {
                    color: "#333",
                  },
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem) {
                      const value = tooltipItem.raw;
                      return `Avg Duration: ${value.toFixed(2)} days`;
                    },
                  },
                },
              },
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default AverageLeaveDurationChart;