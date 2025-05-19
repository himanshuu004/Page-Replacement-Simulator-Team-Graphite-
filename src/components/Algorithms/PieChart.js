import React from "react";
import Chart from "react-google-charts";
import { Box, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  graph: {
    width: "100%",
    marginTop: 30,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      padding: "0 10px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      padding: "0 10px",
    },
  },
  header: {
    marginBottom: 15,
    fontSize: 45,
  },
}));

const PieChart = (props) => {
  const classes = useStyles();

  const pieData = [
    ["Page Sequence", "Hit/Fault"],
    ["Hit", props.hit],
    ["Fault", props.fault],
  ];

  const pieOptions = {
    title: "Hit Vs Fault Comparison",
    is3D: true,
    backgroundColor: "#1a202c",
    titleTextStyle: {
      color: "#FFFFFF",
      fontSize: 24,
    },
    legend: {
      textStyle: {
        color: "#FFFFFF", // legend label color (Hit/Fault)
        fontSize: 18,
      },
    },
    pieSliceTextStyle: {
      color: "#FFFFFF", // in-slice value color
      fontSize: 18,
    },
    slices: {
      0: { color: "#7C99AC" },
      1: { color: "#FFCDDD" },
    },
  };

  return (
    <Box className={classes.graph}>
      <Typography className={classes.header}>Pie Chart</Typography>
      <Chart
        width={"900px"}
        height={"500px"}
        chartType="PieChart"
        loader={<div>Loading Chart</div>}
        data={pieData}
        options={pieOptions}
        rootProps={{ "data-testid": "3" }}
      />
    </Box>
  );
};

export default PieChart;
  