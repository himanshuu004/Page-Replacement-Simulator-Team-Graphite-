// OPR component with report and download functionality added
import React from "react";
import { Box, Typography, makeStyles } from "@material-ui/core";
import PieChart from "./PieChart";
import TableHeader from "./TableHeader";

const useStyles = makeStyles({
  table: {
    width: "100%",
    fontFamily: "arial, sans-serif",
    borderCollapse: "collapse",
    marginTop: 40,
    marginBottom: 40,
    fontSize: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  result: {
    "& tr:nth-child(even)": {
      backgroundColor: "#273c3c",
    },
  },
  main: {
    border: "1px solid #dddddd",
    textAlign: "center",
    padding: "10px",
  },
  summary: {
    textAlign: "center",
    marginTop: 30,
    border: "1px solid white",
    borderRadius: "25px",
  },
  header: {
    fontSize: 46,
    textAlign: "center",
  },
  sum: {
    padding: "40px",
  },
  sumText: {
    fontSize: 30,
    textAlign: "left",
  },
  downloadButton: {
    margin: "20px auto",
    padding: "10px 20px",
    backgroundColor: "#2e7d32",
    color: "white",
    fontWeight: "bold",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    '&:hover': {
      backgroundColor: "#1b5e20",
    },
  },
});

const OPR = (props) => {
  const classes = useStyles();
  const frames = props.frame;
  const pageSeq = props.seq;

  let arr = [];
  for (let i = 0; i < frames; i++) arr.push(i + 1);

  const frameCreator = (f) => (
    <>
      {f.map((item, index) => (
        <th key={index} className={classes.main} style={{ backgroundColor: "#273c3c" }}>{`FRAME ${item}`}</th>
      ))}
    </>
  );

  const oprResultMaker = (frame, seq) => {
    let temp = [];
    let flag1, flag2, flag3, pos, max;
    let faults = 0;
    let result = [];
    let frame_arr = [];
    let hit, fault;
    let index_arr = [];

    for (let i = 0; i < frames; i++) frame_arr[i] = -1;

    for (let i = 0; i < seq.length; i++) {
      flag1 = flag2 = 0;
      hit = fault = false;

      for (let j = 0; j < frame; j++) {
        if (seq[i] === frame_arr[j]) {
          flag1 = flag2 = 1;
          hit = true;
          index_arr.push(j);
          break;
        }
      }

      if (flag1 === 0) {
        for (let j = 0; j < frame; j++) {
          if (frame_arr[j] === -1) {
            faults++;
            frame_arr[j] = seq[i];
            index_arr.push(j);
            flag2 = 1;
            fault = true;
            break;
          }
        }
      }

      if (flag2 === 0) {
        flag3 = 0;
        for (let j = 0; j < frame; j++) {
          temp[j] = -1;
          for (let k = i + 1; k < seq.length; k++) {
            if (frame_arr[j] === seq[k]) {
              temp[j] = k;
              break;
            }
          }
        }
        for (let j = 0; j < frame; j++) {
          if (temp[j] === -1) {
            pos = j;
            flag3 = 1;
            break;
          }
        }
        if (flag3 === 0) {
          max = temp[0];
          pos = 0;
          for (let j = 1; j < frame; j++) {
            if (temp[j] > max) {
              max = temp[j];
              pos = j;
            }
          }
        }
        frame_arr[pos] = seq[i];
        index_arr.push(pos);
        faults++;
        fault = true;
      }

      let elements = [];
      elements.push(`P${i + 1}   (${seq[i]})`);
      for (let j = 0; j < frame; j++) elements.push(frame_arr[j]);

      if (hit) {
        elements.push("HIT", `Page already in Frame ${index_arr[index_arr.length - 1]}`);
      } else if (fault) {
        elements.push("FAULT", `Page placed in Frame ${index_arr[index_arr.length - 1]}`);
      }

      result.push(elements);
    }

    return { result, faults, index_arr };
  };

  const { result, faults, index_arr } = oprResultMaker(frames, pageSeq);
  const pageHits = pageSeq.length - faults;

  const downloadReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = ["PAGE", ...arr.map(n => `FRAME ${n}`), "RESULT", "REPORT"];
    csvContent += headers.join(",") + "\n";

    result.forEach(row => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "opr_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <TableHeader algoName={"OPR (Optimal Page Replacement)"} />
      <Box className={classes.table}>
        <table style={{ overflowX: "auto" }}>
          <thead>
            <tr>
              <th className={classes.main} style={{ backgroundColor: "#273c3c", padding: "20px" }}>PAGES</th>
              {frameCreator(arr)}
              <th className={classes.main} style={{ backgroundColor: "#273c3c", padding: "20px" }}>RESULT</th>
              <th className={classes.main} style={{ backgroundColor: "#273c3c", padding: "20px" }}>REPORT</th>
            </tr>
          </thead>
          <tbody className={classes.result}>
            {result.map((item, index) => (
              <tr key={index}>
                {item.map((i, ind) => {
                  const isResultCol = ind === item.length - 2;
                  const isIndexMatch = ind === index_arr[index] + 1;
                  let bg = {}, color = {};
                  if (ind === item.length - 1) return <td key={ind} className={classes.main}>{i}</td>;
                  if (isResultCol) bg = { backgroundColor: item[ind] === "HIT" ? "#7C99AC" : "#FFCDDD" };
                  if (isIndexMatch) bg = { backgroundColor: item[ind - 1] === "HIT" ? "#69e400" : "#fa2c2c" };
                  return <td key={ind} className={classes.main} style={{ ...bg }}>{i}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <Box className={classes.summary}>
          <Box style={{ textAlign: "center", marginTop: 14 }}>
            <Typography className={classes.header}>Summary</Typography>
          </Box>
          <Box className={classes.sum}>
            <Typography className={classes.sumText}>Total Frames: {props.frame}</Typography>
            <Typography className={classes.sumText}>Total Pages: {props.seq.length}</Typography>
            <Typography className={classes.sumText}>Page Sequence: {props.mainSeq}</Typography>
            <Typography className={classes.sumText}>Page Hit: {pageHits}</Typography>
            <Typography className={classes.sumText}>Page Faults: {faults}</Typography>
          </Box>
          <Box className={classes.chart}>
            <PieChart hit={pageHits} fault={faults} />
          </Box>
          <button onClick={downloadReport} className={classes.downloadButton}>Download Report</button>
        </Box>
      </Box>
    </>
  );
};

export default OPR;
