"use client";

import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

export async function exportToPNG(element: HTMLElement, filename = "document.png") {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export async function exportToPDF(element: HTMLElement, filename = "document.pdf") {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  // A4 dimensions in mm
  const pdfWidth = 210;
  const pdfHeight = 297;

  const ratio = pdfWidth / imgWidth;
  const scaledHeight = imgHeight * ratio;

  const pdf = new jsPDF({
    orientation: scaledHeight > pdfHeight ? "portrait" : "portrait",
    unit: "mm",
    format: "a4",
  });

  // If content fits on one page
  if (scaledHeight <= pdfHeight) {
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, scaledHeight);
  } else {
    // Multi-page: slice the canvas into page-sized chunks
    let yOffset = 0;
    let pageNum = 0;
    const pageHeightPx = pdfHeight / ratio;

    while (yOffset < imgHeight) {
      if (pageNum > 0) {
        pdf.addPage();
      }

      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = imgWidth;
      sliceCanvas.height = Math.min(pageHeightPx, imgHeight - yOffset);

      const ctx = sliceCanvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(
          canvas,
          0,
          yOffset,
          imgWidth,
          sliceCanvas.height,
          0,
          0,
          imgWidth,
          sliceCanvas.height
        );
      }

      const sliceData = sliceCanvas.toDataURL("image/png");
      const sliceScaledHeight = sliceCanvas.height * ratio;
      pdf.addImage(sliceData, "PNG", 0, 0, pdfWidth, sliceScaledHeight);

      yOffset += pageHeightPx;
      pageNum++;
    }
  }

  pdf.save(filename);
}
