import React, { useState } from "react";
import TableHeader from "./TableHeader";
import PieChart from "./PieChart";

const FIFO = (props) => {
  const frames = props.frame;
  const pageSeq = props.seq;

  let arr = [];
  for (let i = 0; i < frames; i++) {
    arr.push(i + 1);
  }

  const frameCreator = (f) => {
    return (
      <>
        {f.map((item, index) => (
          <th className="border text-center p-2 bg-green-900 text-white">{`FRAME ${item}`}</th>
        ))}
      </>
    );
  };

  const fifoResultGiver = (frame, seq) => {
    let pageFaults = 0;
    let temp = [frame];
    let result = [];
    let index_arr = [];

    for (let i = 0; i < frame; i++) {
      temp[i] = -1;
    }

    for (let i = 0; i < seq.length; i++) {
      let hit = false;
      let fault = false;
      let flag = 0;

      for (let j = 0; j < frame; j++) {
        if (seq[i] === temp[j]) {
          flag++;
          index_arr.push(j);
          pageFaults--;
          hit = true;
        }
      }
      pageFaults++;
      fault = true;
      if (pageFaults <= frame && flag === 0) {
        temp[i] = seq[i];
        index_arr.push(i);
      } else if (flag === 0) {
        let pageHitAndPageRatio = (pageFaults - 1) % frame;
        temp[pageHitAndPageRatio] = seq[i];
        index_arr.push(pageHitAndPageRatio);
      }

      let elements = [];
      elements.push(`P${i + 1}   (${seq[i]})`);
      for (let j = 0; j < frame; j++) {
        elements.push(temp[j]);
      }
      if (hit === true) {
        elements.push("HIT");
      } else if (fault === true) {
        elements.push("FAULT");
      }

      result.push(elements);
    }

    return { result, pageFaults, index_arr };
  };

  const rowResultMaker = (frames, pageSeq) => {
    const { result, index_arr } = fifoResultGiver(frames, pageSeq);

    return (
      <>
        {result.map((item, index) => {
          let lastEle = item[item.length - 1];
          return (
            <tr key={index}>
              {item.map((i, ind) => {
                const isResultCol = ind === item.length - 1;
                const isIndexMatch = ind === index_arr[index] + 1;
                let bgColor = "bg-white";
                let textColor = "text-black";
                if (isResultCol) {
                  bgColor = lastEle === "HIT" ? "bg-green-300" : "bg-red-400";
                }
                if (isIndexMatch) {
                  bgColor = lastEle === "HIT" ? "bg-lime-400" : "bg-red-500";
                  textColor = "text-white";
                }
                return (
                  <td
                    key={ind}
                    className={`border p-2 text-center ${bgColor} ${textColor}`}
                  >
                    {i}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </>
    );
  };

  const { pageFaults } = fifoResultGiver(frames, pageSeq);
  const pageHits = pageSeq.length - pageFaults;

  return (
    <>
      <TableHeader algoName={"FCFS (First Come First Serve)"} />

      <div className="w-full flex flex-col items-center mt-10 mb-10 px-4">
        <div className="overflow-x-auto w-full max-w-6xl">
          <table className="w-full border border-green-800">
            <thead>
              <tr className="bg-green-900 text-white">
                <th className="border p-2">PAGES</th>
                {frameCreator(arr)}
                <th className="border p-2">RESULT</th>
              </tr>
            </thead>
            <tbody>{rowResultMaker(frames, pageSeq)}</tbody>
          </table>
        </div>

        <div className="mt-10 p-6 border border-green-800 rounded-2xl w-full max-w-4xl bg-white text-green-900">
          <h2 className="text-3xl font-semibold text-center mb-6">Summary</h2>
          <div className="space-y-3 text-lg">
            <p>Total Frames: {props.frame}</p>
            <p>Total Pages: {props.seq.length}</p>
            <p>Page Sequence: {props.mainSeq}</p>
            <p>Page Hit: {pageHits}</p>
            <p>Page Faults: {pageFaults}</p>
          </div>
          <div className="mt-6">
            <PieChart hit={pageHits} fault={pageFaults} />
          </div>
        </div>
      </div>
    </>
  );
};

export default FIFO;
