import React, { useState } from "react";
import PieChart from "./PieChart";
import TableHeader from "./TableHeader";
import RowResultMaker from "./RowResultMaker";

const LRU = (props) => {
  const frames = props.frame;
  const pageSeq = props.seq;

  let arr = [];
  for (let i = 0; i < frames; i++) arr.push(i + 1);

  const frameCreator = (f) => {
    return (
      <>
        {f.map((item, index) => {
          return (
            <th
              className="border border-white text-center px-4 py-2 bg-green-800 text-black"
              key={index}
            >
              {`FRAME ${item}`}
            </th>
          );
        })}
      </>
    );
  };

  const findLru = (temp, frame) => {
    let minimum = temp[0];
    let pos = 0;
    for (let i = 0; i < frame; i++) {
      if (temp[i] < minimum) {
        minimum = temp[i];
        pos = i;
      }
    }
    return pos;
  };

  const lruResultMaker = (frame, seq) => {
    let temp = [];
    let flag1;
    let flag2;
    let pos;
    let faults = 0;
    let counter = 0;
    let result = [];
    let frame_arr = [];
    let hit;
    let fault;
    let index_arr = [];

    for (let i = 0; i < frames; i++) frame_arr[i] = -1;

    for (let i = 0; i < seq.length; i++) {
      flag1 = 0;
      flag2 = 0;
      hit = false;
      fault = false;

      for (let j = 0; j < frame; j++) {
        if (seq[i] === frame_arr[j]) {
          counter++;
          temp[j] = counter;
          index_arr.push(j);
          flag1 = 1;
          flag2 = 1;
          hit = true;
          break;
        }
      }

      if (flag1 === 0) {
        for (let j = 0; j < frame; j++) {
          if (frame_arr[j] === -1) {
            faults++;
            frame_arr[j] = seq[i];
            index_arr.push(j);
            counter++;
            temp[j] = counter;
            flag2 = 1;
            fault = true;
            break;
          }
        }
      }

      if (flag2 === 0) {
        pos = findLru(temp, frame);
        faults++;
        counter++;
        temp[pos] = counter;
        frame_arr[pos] = seq[i];
        index_arr.push(pos);
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

  const { result, faults, index_arr } = lruResultMaker(frames, pageSeq);
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
    link.setAttribute("download", "lru_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <TableHeader algoName="LRU (Least Recently Used)" />

      <div className="bg-green-100 border-l-4 border-green-600 text-green-900 p-4 my-6 rounded shadow-md max-w-4xl w-full mx-auto">
        <h2 className="text-xl font-bold mb-2">What is LRU?</h2>
        <p className="text-md">
          <strong>LRU (Least Recently Used)</strong> is a page replacement algorithm that replaces the page which has not been used for the longest time. 
          It is based on the assumption that pages used recently will likely be used again soon, and pages not used recently are less likely to be used in the future.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center w-full text-black">
        <table className="border-collapse w-full overflow-x-auto mt-10 mb-10 text-black">
          <thead>
            <tr>
              <th className="border border-white text-center px-4 py-2 bg-green-800 text-black">PAGES</th>
              {frameCreator(arr)}
              <th className="border border-white text-center px-4 py-2 bg-green-800 text-black">RESULT</th>
              <th className="border border-white text-center px-4 py-2 bg-green-800 text-black">REPORT</th>
            </tr>
          </thead>
          <tbody className="text-black">
            <RowResultMaker result={result} index_arr={index_arr} />
          </tbody>
        </table>

        <div className="border border-white rounded-3xl mt-8 text-black w-full max-w-4xl">
          <div className="text-center mt-4">
            <h2 className="text-4xl">Summary</h2>
          </div>

          <div className="p-10 text-left text-2xl">
            <p>Total Frames: {props.frame}</p>
            <p>Total Pages: {props.seq.length}</p>
            <p>Page Sequence: {props.mainSeq}</p>
            <p>Page Hit: {pageHits}</p>
            <p>Page Faults: {faults}</p>
          </div>

          <div className="flex justify-center">
            <PieChart hit={pageHits} fault={faults} />
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={downloadReport}
              className="px-6 py-2 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition"
            >
              Download Report
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LRU;
