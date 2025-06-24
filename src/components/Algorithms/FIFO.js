import React, { useState } from "react";
import TableHeader from "./TableHeader";
import PieChart from "./PieChart";
import videobg from "../Video/fcfs.mp4"; // Assuming the video file is in the same directory

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
          <th key={index} className="border text-center p-2 bg-green-900 text-white">{`FRAME ${item}`}</th>
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
        elements.push("HIT", `Page already in Frame ${index_arr[index_arr.length - 1]}`);
      } else if (fault === true) {
        elements.push("FAULT", `Page placed in Frame ${index_arr[index_arr.length - 1]}`);
      }

      result.push(elements);
    }

    return { result, pageFaults, index_arr };
  };

  const { result, pageFaults, index_arr } = fifoResultGiver(frames, pageSeq);
  const pageHits = pageSeq.length - pageFaults;

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
    link.setAttribute("download", "fifo_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
                <th className="border p-2">REPORT</th>
              </tr>
            </thead>
            <tbody>
              {result.map((item, index) => {
                let lastEle = item[item.length - 2];
                return (
                  <tr key={index}>
                    {item.map((i, ind) => {
                      const isResultCol = ind === item.length - 2;
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
                        <td key={ind} className={`border p-2 text-center ${bgColor} ${textColor}`}>
                          {i}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
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

          {/* Video Tutorial Section */}
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2 text-center">Watch FIFO Tutorial</h3>
            <div className="flex justify-center">
              <video width="640" height="360" controls autoPlay loop muted className="rounded shadow-lg">
                <source src={videobg} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <div className="mt-6">
            <PieChart hit={pageHits} fault={pageFaults} />
          </div>
          {/* FIFO Full Documentation */}
<div className="mt-10 text-left">
  <h3 className="text-2xl font-bold mb-4">📘 In-Depth: FIFO Page Replacement Algorithm</h3>

  <p className="text-lg mb-4">
    FIFO (First-In-First-Out) is one of the most fundamental page replacement algorithms used in operating systems to manage memory. When a new page needs to be loaded into memory and no empty frame is available, FIFO replaces the page that was loaded first (i.e., the oldest one).
  </p>

  <h4 className="text-xl font-semibold mt-4 mb-2">🔍 Basic Principle</h4>
  <p className="text-lg mb-4">
    Pages are kept in a queue. When a page must be replaced, the oldest page (the one at the front of the queue) is removed, and the new page is added to the rear.
  </p>

  <h4 className="text-xl font-semibold mt-4 mb-2">📊 Visual Example</h4>
  <img
    src="https://www.studytonight.com/os/images/fifo-page-replacement-algorithm.png"
    alt="FIFO Working Example"
    className="my-4 rounded shadow-lg"
  />

  <h4 className="text-xl font-semibold mt-4 mb-2">🧠 Step-by-Step Illustration</h4>
  <p className="text-lg mb-4">
    Let’s say we have 3 memory frames and the page reference string is: <code>7, 0, 1, 2, 0, 3, 0, 4</code>. The page replacement follows this order:
  </p>
  <ul className="list-disc list-inside text-lg mb-4">
    <li>Initially all frames are empty → page fault for 7, 0, 1</li>
    <li>Page 2 replaces 7 (first loaded) → fault</li>
    <li>0 is already in memory → hit</li>
    <li>Page 3 replaces 0 (FIFO) → fault</li>
    <li>Page 0 replaces 1 → fault</li>
    <li>Page 4 replaces 2 → fault</li>
  </ul>

  <h4 className="text-xl font-semibold mt-4 mb-2">⚖️ Pros and Cons</h4>
  <ul className="list-disc list-inside text-lg mb-4">
    <li><strong>Pros:</strong> Simple, easy to implement, no additional hardware needed.</li>
    <li><strong>Cons:</strong> Can suffer from Belady’s anomaly (more frames can cause more page faults).</li>
  </ul>

  <h4 className="text-xl font-semibold mt-4 mb-2">📌 Real-Life Use Cases</h4>
  <p className="text-lg mb-4">
    FIFO is mostly used in simple embedded systems or where implementation complexity must be minimal. It is less efficient for general-purpose operating systems.
  </p>

  <h4 className="text-xl font-semibold mt-4 mb-2">🆚 FIFO vs LRU vs Optimal</h4>
  <table className="w-full text-left table-auto border border-collapse border-gray-300 text-sm mb-4">
    <thead className="bg-green-800 text-white">
      <tr>
        <th className="border px-4 py-2">Algorithm</th>
        <th className="border px-4 py-2">Uses History?</th>
        <th className="border px-4 py-2">Belady’s Anomaly</th>
        <th className="border px-4 py-2">Best For</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="border px-4 py-2">FIFO</td>
        <td className="border px-4 py-2">No</td>
        <td className="border px-4 py-2">Yes</td>
        <td className="border px-4 py-2">Simple Systems</td>
      </tr>
      <tr>
        <td className="border px-4 py-2">LRU</td>
        <td className="border px-4 py-2">Yes (recent use)</td>
        <td className="border px-4 py-2">No</td>
        <td className="border px-4 py-2">Interactive apps</td>
      </tr>
      <tr>
        <td className="border px-4 py-2">Optimal</td>
        <td className="border px-4 py-2">Yes (future use)</td>
        <td className="border px-4 py-2">No</td>
        <td className="border px-4 py-2">Theoretical/Simulators</td>
      </tr>
    </tbody>
  </table>

  <h4 className="text-xl font-semibold mt-4 mb-2">📚 More Learning Resources</h4>
  <ul className="list-disc list-inside text-blue-700 underline text-lg">
    <li><a href="https://www.javatpoint.com/os-page-replacement-algorithms" target="_blank">Javatpoint - OS Page Replacement</a></li>
    <li><a href="https://www.geeksforgeeks.org/page-replacement-algorithms-in-operating-systems/" target="_blank">GeeksForGeeks - Replacement Algorithms</a></li>
    <li><a href="https://en.wikipedia.org/wiki/Page_replacement_algorithm" target="_blank">Wikipedia - Page Replacement</a></li>
  </ul>
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

export default FIFO;
