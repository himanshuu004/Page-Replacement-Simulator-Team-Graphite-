import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navigation/Navbar";

const Landing = () => {
  return (
    <div className="min-h-screen bg-green-50 text-green-900 font-sans overflow-hidden">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="pt-24 px-6 sm:px-10 lg:px-24 h-[calc(100vh-6rem)] flex flex-col justify-start items-center space-y-10 overflow-hidden">

        {/* Heading and Description */}
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-snug mb-4">
            Page Replacement Algorithms
          </h1>
          <p className="text-lg sm:text-xl text-green-800 leading-relaxed">
            Understand how operating systems manage memory by deciding which memory pages to replace during page faults.
            Explore FIFO, LRU, Optimal, and MRU algorithms with our interactive simulator and see how each strategy impacts system performance.
          </p>
          <Link
            to="/home"
            className="mt-6 inline-flex items-center bg-green-700 hover:bg-green-800 transition duration-300 text-white font-medium rounded-full px-7 py-3 shadow-md hover:shadow-xl transform hover:scale-105"
          >
            Go To Simulator
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Concepts Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl mt-4">
          {[
            {
              title: "Page",
              descr:
                "A fixed-length block of logical memory. It is the basic unit of data for memory management in virtual memory systems and enables non-contiguous memory allocation.",
            },
            {
              title: "Frame",
              descr:
                "A fixed-length block of physical memory that holds one page. Frames and pages are of the same size, allowing seamless page-to-frame mapping in RAM.",
            },
            {
              title: "Paging",
              descr:
                "A memory management scheme that allows processes to be stored in non-contiguous memory locations, preventing fragmentation and making memory usage more efficient.",
            },
            {
              title: "Page Fault",
              descr:
                "An event that occurs when a program tries to access a page not currently in main memory. It triggers the OS to fetch the page from secondary storage into RAM.",
            },
          ].map(({ title, descr }) => (
            <div
              key={title}
              className="bg-green-100 rounded-xl p-4 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition"
            >
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm text-green-800">{descr}</p>
            </div>
          ))}
        </div>

        {/* Algorithms Section */}
        <div className="w-full max-w-5xl mt-4">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Algorithms You Can Explore
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              {
                name: "FIFO",
                desc:
                  "First-In, First-Out replaces the oldest page in memory first. It is simple and easy to implement but may not always provide the best performance.",
              },
              {
                name: "LRU",
                desc:
                  "Least Recently Used replaces the page that has not been used for the longest period of time, based on past access behavior.",
              },
              {
                name: "Optimal",
                desc:
                  "Replaces the page that will not be used for the longest time in the future. It offers the best performance but is impractical in real-time systems due to future knowledge requirement.",
              },
              {
                name: "MRU",
                desc:
                  "Most Recently Used replaces the page that was accessed most recently. Suitable for workloads where recently accessed pages are less likely to be used again soon.",
              },
            ].map(({ name, desc }) => (
              <div
                key={name}
                className="bg-white border border-green-200 p-4 rounded-lg hover:shadow-lg transition"
              >
                <h3 className="text-green-700 font-bold text-lg mb-2">{name}</h3>
                <p className="text-sm text-green-800">{desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Landing;
