// components/Loading.jsx
"use client";

import React from "react";

const Loading = () => {
    return (
        // <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        //     <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        //     <p className="mt-4 text-gray-700 text-lg">Loading...</p>
        // </div>
        <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading...</span>
        </div>
    );
};

export default Loading;
