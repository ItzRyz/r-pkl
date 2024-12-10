"use client";

import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import RecordingForm from "@/components/form-recording";

type Props = {};

function Page({}: Props) {
  const formRef = useRef<HTMLDivElement>(null); // Reference to the form container

  const generatePdf = async () => {
    if (!formRef.current) return;

    const canvas = await html2canvas(formRef.current, {
      windowWidth: formRef.current.scrollWidth,
      scale: 2,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      format: "letter",
      orientation: "p",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let y = 0;

    while (y < imgHeight) {
      pdf.addImage(
        imgData,
        "PNG",
        0,
        -y,
        pdfWidth,
        (canvas.height * pdfWidth) / canvas.width
      );
      y += pdfHeight;
      if (y < imgHeight) {
        pdf.addPage();
      }
    }

    pdf.save("my-pdf.pdf");
  };

  return (
    <>
      {/* Wrap RecordingForm in a ref container */}
      <div ref={formRef}>
        <RecordingForm />
      </div>
      <div className="text-center mt-8">
        <button
          onClick={generatePdf}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
        >
          Download as PDF
        </button>
      </div>
    </>
  );
}

export default Page;
