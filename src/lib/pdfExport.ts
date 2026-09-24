import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export interface PdfExportOptions {
  elementId?: string;
  fileName?: string;
}

/**
 * Directly exports an HTML element (default: #printable-resume) as an A4 PDF
 * and initiates automatic browser file download without opening the print dialog.
 */
export async function exportResumeToPdf({
  elementId = "printable-resume",
  fileName = "ATS_Resume.pdf",
}: PdfExportOptions = {}): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Resume element #${elementId} not found in DOM`);
  }

  // Clone element so it can be rendered unscaled at fixed A4 aspect ratio off-screen
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.transform = "none";
  clone.style.maxWidth = "800px";
  clone.style.width = "800px";
  clone.style.margin = "0";
  clone.style.boxShadow = "none";
  clone.style.borderRadius = "0";
  clone.style.border = "none";
  clone.style.backgroundColor = "#ffffff";
  clone.style.color = "#111827";
  if (element.style.fontFamily) {
    clone.style.fontFamily = element.style.fontFamily;
  }

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "800px";
  container.style.background = "#ffffff";
  container.style.zIndex = "-9999";
  container.style.overflow = "hidden";
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    // Allow any pending fonts / SVGs to settle
    await new Promise((resolve) => setTimeout(resolve, 150));

    const canvas = await html2canvas(clone, {
      scale: 2, // High resolution (crisp 300 DPI equivalent)
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 1024,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    // Standard A4: 210mm x 297mm with fixed 10mm all-around margin
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 10; // Fixed 10mm margin on top, bottom, left, and right
    const printableWidth = pageWidth - margin * 2; // 190mm
    const printableHeight = pageHeight - margin * 2; // 277mm

    // Calculate canvas pixel height corresponding to one printable A4 page
    const pageCanvasHeight = Math.floor((printableHeight / printableWidth) * canvas.width);
    const totalPages = Math.max(1, Math.ceil(canvas.height / pageCanvasHeight));

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage();
      }

      const sourceY = page * pageCanvasHeight;
      const currentChunkHeight = Math.min(pageCanvasHeight, canvas.height - sourceY);

      // Render each page into a dedicated canvas with fixed margins and white backdrop
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = pageCanvasHeight;
      const ctx = pageCanvas.getContext("2d");

      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvasHeight);
        ctx.drawImage(
          canvas,
          0,
          sourceY,
          canvas.width,
          currentChunkHeight,
          0,
          0,
          canvas.width,
          currentChunkHeight
        );
      }

      const pageImgData = pageCanvas.toDataURL("image/jpeg", 0.98);
      pdf.addImage(pageImgData, "JPEG", margin, margin, printableWidth, printableHeight, undefined, "FAST");
    }

    const cleanFileName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
    pdf.save(cleanFileName);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
