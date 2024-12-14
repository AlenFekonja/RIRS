import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  BarElement,
  LinearScale,
  Tooltip,
  Title,
} from "chart.js";
import { getAllLeaves } from "../api/requestApi";
import { Box, Typography, CircularProgress } from "@mui/material";

Chart.register(CategoryScale, BarElement, LinearScale, Tooltip, Title);

const DaysOffByEmployeeChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const leaves = await getAllLeaves();

        if (Array.isArray(leaves) && leaves.length > 0) {
          const groupedData = {};
          leaves.forEach((leave) => {
            const name = `${leave.ime} ${leave.priimek}`;
            const start = new Date(leave.zacetek);
            const end = new Date(leave.konec);
            const daysOff = (end - start) / (1000 * 60 * 60 * 24) + 1;

            if (groupedData[name]) {
              groupedData[name] += daysOff;
            } else {
              groupedData[name] = daysOff;
            }
          });

          const names = Object.keys(groupedData);
          const totalDaysOff = Object.values(groupedData);

          setChartData({
            labels: names,
            datasets: [
              {
                label: "Total Days Off",
                data: totalDaysOff,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
            ],
          });
        } else {
          setError("No data available for leave days.");
        }
      } catch (error) {
        console.error("Error fetching leave data:", error);
        setError("Failed to fetch data.");
      }
    };

    fetchLeaves();
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
        Total Days Off by Employee
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
                    text: "Days Off",
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
                      return `Days Off: ${value}`;
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

export default DaysOffByEmployeeChart;