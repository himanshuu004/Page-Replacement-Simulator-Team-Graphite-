import React, { useState } from "react";
import { Box, Typography, Button, makeStyles } from "@material-ui/core";
import FIFO from "../Algorithms/FIFO";
import OPR from "../Algorithms/OPR";
import LRU from "../Algorithms/LRU";
import MRU from "../Algorithms/MRU";
import Navbar from "../Navigation/Navbar";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#e6f4ea",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(5),
    color: "#1b4332",
  },
  box: {
    width: "90%",
    maxWidth: 800,
    padding: theme.spacing(4),
    backgroundColor: "#ffffff",
    borderRadius: theme.spacing(2),
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    marginBottom: theme.spacing(4),
  },
  inputBox: {
    width: "100%",
    marginBottom: theme.spacing(3),
  },
  label: {
    fontSize: 18,
    marginBottom: theme.spacing(1),
    color: "#2d6a4f",
  },
  input: {
    width: "100%",
    fontSize: 16,
    padding: theme.spacing(1.5),
    borderRadius: 8,
    border: "1px solid #2d6a4f",
    outline: "none",
    color: "#1b4332",
  },
  btns: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
  btn: {
    backgroundColor: "#40916c",
    color: "#ffffff",
    padding: theme.spacing(1, 3),
    borderRadius: 8,
    textTransform: "none",
    '&:hover': {
      backgroundColor: "#2d6a4f",
    },
  },
  errorMsg: {
    color: "#d00000",
    marginTop: theme.spacing(2),
  },
}));

const Home = () => {
  const classes = useStyles();
  const [frame, setFrame] = useState(0);
  const [seq, setSeq] = useState("");
  const [error, setError] = useState(null);
  const [result, setResult] = useState("");
  const [seqArr, setSeqArr] = useState([]);

  const frameHanadler = (e) => {
    setFrame(e.target.value);
  };

  const seqHandler = (e) => {
    const rawInput = e.target.value;
    setSeq(rawInput);
    const cleaned = rawInput.trim().replace(/ +/g, " ");
    const arr = cleaned.split(" ").filter((item) => item !== "");
    setSeqArr(arr);
  };

  const validateInput = () => {
    if (frame < 0) return "Frames can not be Negative";
    if (frame === 0 || seq.length === 0) return "Please fill all the fields";
    for (let i = 0; i < seqArr.length; i++) {
      if (parseInt(seqArr[i]) < 0 || isNaN(parseInt(seqArr[i]))) {
        return "Only non-negative integers allowed in Page Sequence";
      }
    }
    return null;
  };

  const handleClick = (type) => {
    const err = validateInput();
    if (err) return setError(err);
    setError(null);
    setResult(type);
  };

  const handleReset = () => {
    setFrame(0);
    setSeq("");
    setSeqArr([]);
    setResult("");
    setError(null);
  };

  const buttons = [
    { title: "FCFS", action: () => handleClick("fifo") },
    { title: "OPR", action: () => handleClick("opr") },
    { title: "LRU", action: () => handleClick("lru") },
    { title: "MRU", action: () => handleClick("mru") },
    { title: "RESET", action: handleReset },
  ];

  return (

    <>
      <Navbar />
      <Box className={classes.container}>
        <Box className={classes.box}>
          <Typography variant="h4" className={classes.header}>Simulator</Typography>
          <Box className={classes.inputBox}>
            <Typography className={classes.label}>Enter Number of Frames</Typography>
            <input type="number" value={frame} onChange={frameHanadler} className={classes.input} />
          </Box>
          <Box className={classes.inputBox}>
            <Typography className={classes.label}>Enter The Page Sequence</Typography>
            <input type="text" value={seq} onChange={seqHandler} className={classes.input} />
          </Box>
          <Box className={classes.btns}>
            {buttons.map((btn, idx) => (
              <Button key={idx} className={classes.btn} onClick={btn.action}>{btn.title}</Button>
            ))}
          </Box>
          {error && <Typography className={classes.errorMsg}>{error}</Typography>}
        </Box>

        {result === "fifo" && !error && <FIFO frame={frame} seq={seqArr} mainSeq={seq} />}
        {result === "opr" && !error && <OPR frame={frame} seq={seqArr} mainSeq={seq} />}
        {result === "lru" && !error && <LRU frame={frame} seq={seqArr} mainSeq={seq} />}
        {result === "mru" && !error && <MRU frame={frame} seq={seqArr} mainSeq={seq} />}
      </Box>
    </>
  );
};

export default Home;