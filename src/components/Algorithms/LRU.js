import React from "react";
import TableHeader from "./TableHeader";
import PieChart from "./PieChart";
import videobg1 from "../Video/LRU.mp4"; // Ensure this path is correct

const LRU = ({ frame, seq, mainSeq }) => {
  const frames = frame;
  const pageSeq = seq;

  let arr = [];
  for (let i = 0; i < frames; i++) arr.push(i + 1);

  const findLru = (temp, frame) => {
    let minimum = temp[0];
    let pos = 0;
    for (let i = 1; i < frame; i++) {
      if (temp[i] < minimum) {
        minimum = temp[i];
        pos = i;
      }
    }
    return pos;
  };

  const lruResultMaker = (frame, seq) => {
    let temp = [], counter = 0, faults = 0;
    let frame_arr = new Array(frame).fill(-1);
    let result = [], index_arr = [];

    for (let i = 0; i < seq.length; i++) {
      let hit = false, fault = false;
      let flag1 = 0, flag2 = 0;

      for (let j = 0; j < frame; j++) {
        if (seq[i] === frame_arr[j]) {
          flag1 = flag2 = 1;
          counter++;
          temp[j] = counter;
          index_arr.push(j);
          hit = true;
          break;
        }
      }

      if (!flag1) {
        for (let j = 0; j < frame; j++) {
          if (frame_arr[j] === -1) {
            faults++;
            frame_arr[j] = seq[i];
            counter++;
            temp[j] = counter;
            index_arr.push(j);
            flag2 = 1;
            fault = true;
            break;
          }
        }
      }

      if (!flag2) {
        let pos = findLru(temp, frame);
        faults++;
        counter++;
        frame_arr[pos] = seq[i];
        temp[pos] = counter;
        index_arr.push(pos);
        fault = true;
      }

      let elements = [`P${i + 1}   (${seq[i]})`, ...frame_arr];
      elements.push(hit ? "HIT" : "FAULT", hit ? `Page already in Frame ${index_arr[index_arr.length - 1]}` : `Page placed in Frame ${index_arr[index_arr.length - 1]}`);
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
    result.forEach(row => { csvContent += row.join(",") + "\n"; });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "lru_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col items-center mt-10 mb-10 px-4">
      <TableHeader algoName="LRU (Least Recently Used)" />

      <div className="overflow-x-auto w-full max-w-6xl">
        <table className="w-full border border-green-800">
          <thead>
            <tr className="bg-green-900 text-white">
              <th className="border p-2">PAGES</th>
              {arr.map((item, index) => (
                <th key={index} className="border p-2">{`FRAME ${item}`}</th>
              ))}
              <th className="border p-2">RESULT</th>
              <th className="border p-2">REPORT</th>
            </tr>
          </thead>
          <tbody>
            {result.map((row, index) => {
              const lastEle = row[row.length - 2];
              return (
                <tr key={index}>
                  {row.map((cell, i) => {
                    const isResultCol = i === row.length - 2;
                    const isIndexMatch = i === index_arr[index] + 1;
                    let bgColor = "bg-white", textColor = "text-black";
                    if (isResultCol) bgColor = lastEle === "HIT" ? "bg-green-300" : "bg-red-400";
                    if (isIndexMatch) {
                      bgColor = lastEle === "HIT" ? "bg-lime-400" : "bg-red-500";
                      textColor = "text-white";
                    }
                    return <td key={i} className={`border p-2 text-center ${bgColor} ${textColor}`}>{cell}</td>;
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
          <p>Total Frames: {frame}</p>
          <p>Total Pages: {seq.length}</p>
          <p>Page Sequence: {mainSeq}</p>
          <p>Page Hit: {pageHits}</p>
          <p>Page Faults: {faults}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2 text-center">Watch LRU Tutorial</h3>
          <div className="flex justify-center">
            <video width="640" height="360" controls autoPlay loop muted className="rounded shadow-lg">
  <source src={videobg1} type="video/mp4" />
  Your browser does not support the video tag.
</video>

          </div>
        </div>

        <div className="mt-6">
          <PieChart hit={pageHits} fault={faults} />
        </div>

        <div className="mt-10 text-left">
          <h3 className="text-2xl font-bold mb-4">📘 LRU Page Replacement Algorithm - Explanation</h3>
          <p className="text-lg mb-4">
            LRU (Least Recently Used) replaces the page that has not been used for the longest time. It works on the assumption that pages used recently will likely be used again soon.
          </p>
          <h4 className="text-xl font-semibold mt-4 mb-2">📌 How LRU Works</h4>
          <ul className="list-disc list-inside text-lg mb-4">
            <li>Track usage history of all pages.</li>
            <li>Replace the page with the oldest recent use.</li>
          </ul>
          <h4 className="text-xl font-semibold mt-4 mb-2">📈 Example Diagram</h4>
          <img
            src="https://media.geeksforgeeks.org/wp-content/uploads/20200904140202/LRUPageReplacement.png"
            alt="LRU Example"
            className="my-4 rounded shadow-lg"
          />
          <p className="text-lg mb-4">
            In the diagram above, LRU maintains the recent usage of pages in memory and discards the least used page when necessary.
          </p>
          <h4 className="text-xl font-semibold mt-4 mb-2">✅ Pros and Cons</h4>
          <ul className="list-disc list-inside text-lg">
            <li><strong>Pros:</strong> Better hit rate than FIFO, considers recent usage.</li>
            <li><strong>Cons:</strong> Needs more memory to track history or timestamps.</li>
          </ul>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={downloadReport}
            className="px-6 py-2 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default LRU;
