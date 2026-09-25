import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export interface PdfExportOptions {
  elementId?: string;
  fileName?: string;
}

const PAGE_WIDTH_PX = 800;
const PAGE_HEIGHT_PX = 1131; // A4 aspect ratio: 800 * (297 / 210) = 1131.42px
const PADDING_PX = 48; // Exact 4-side margin matching preview padding
const MAX_USABLE_PAGE_HEIGHT = PAGE_HEIGHT_PX; // 1131px total container

function createPageContainer(fontFamily?: string): HTMLElement {
  const page = document.createElement("div");
  page.className = "resume-sheet bg-white text-neutral-900";
  page.style.width = `${PAGE_WIDTH_PX}px`;
  page.style.minHeight = `${PAGE_HEIGHT_PX}px`;
  page.style.height = `${PAGE_HEIGHT_PX}px`;
  page.style.padding = `${PADDING_PX}px`;
  page.style.boxSizing = "border-box";
  page.style.backgroundColor = "#ffffff";
  page.style.color = "#111827";
  page.style.position = "relative";
  page.style.overflow = "hidden";
  page.style.fontSize = "11pt";
  page.style.lineHeight = "1.32";
  if (fontFamily) {
    page.style.fontFamily = fontFamily;
  }
  return page;
}

function isDivider(node: Node): boolean {
  if (node instanceof HTMLElement) {
    return (
      node.tagName.toLowerCase() === "hr" ||
      (Boolean(node.style.borderTop) && node.style.borderTop !== "none" && node.children.length === 0)
    );
  }
  return false;
}

function trimTrailingDivider(page: HTMLElement) {
  const lastChild = page.lastElementChild;
  if (lastChild && isDivider(lastChild)) {
    page.removeChild(lastChild);
  }
}

/**
 * Paginates resume elements into separate A4 page containers with exact 4-side margins.
 */
function paginateResumeElements(
  sourceElement: HTMLElement,
  container: HTMLElement,
  fontFamily?: string
): HTMLElement[] {
  const children = Array.from(sourceElement.children) as HTMLElement[];

  // If content naturally fits on 1 page:
  if (sourceElement.scrollHeight <= MAX_USABLE_PAGE_HEIGHT) {
    const singlePage = createPageContainer(fontFamily);
    children.forEach((child) => singlePage.appendChild(child.cloneNode(true)));
    container.appendChild(singlePage);
    return [singlePage];
  }

  // Multi-page flow (divides into 2 or more clean A4 pages)
  const pages: HTMLElement[] = [];
  let currentPage = createPageContainer(fontFamily);
  container.appendChild(currentPage);
  pages.push(currentPage);

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    // Omit dividers at the very top of a new page
    if (currentPage.children.length === 0 && isDivider(child)) {
      continue;
    }

    const clonedChild = child.cloneNode(true) as HTMLElement;
    currentPage.appendChild(clonedChild);

    if (currentPage.scrollHeight <= MAX_USABLE_PAGE_HEIGHT) {
      // Fits comfortably within current page
      continue;
    }

    // Does not fit: remove test element
    currentPage.removeChild(clonedChild);

    // Try splitting composite sections (e.g. Experience or Education with multiple sub-items)
    let splitSuccess = false;
    if (child.tagName.toLowerCase() === "section") {
      const heading = child.querySelector("h2");
      const listContainer = child.querySelector(".space-y-2, ul");

      if (listContainer && listContainer.children.length > 1) {
        const partialSec1 = child.cloneNode(false) as HTMLElement;
        if (heading) partialSec1.appendChild(heading.cloneNode(true));
        const partialList1 = listContainer.cloneNode(false) as HTMLElement;
        partialSec1.appendChild(partialList1);
        currentPage.appendChild(partialSec1);

        const subItems = Array.from(listContainer.children) as HTMLElement[];
        let addedCount = 0;

        for (const item of subItems) {
          const clonedItem = item.cloneNode(true) as HTMLElement;
          partialList1.appendChild(clonedItem);
          if (currentPage.scrollHeight <= MAX_USABLE_PAGE_HEIGHT) {
            addedCount++;
          } else {
            partialList1.removeChild(clonedItem);
            break;
          }
        }

        if (addedCount > 0) {
          splitSuccess = true;
          trimTrailingDivider(currentPage);

          // Advance to next page
          currentPage = createPageContainer(fontFamily);
          container.appendChild(currentPage);
          pages.push(currentPage);

          const partialSec2 = child.cloneNode(false) as HTMLElement;
          const partialList2 = listContainer.cloneNode(false) as HTMLElement;
          partialSec2.appendChild(partialList2);

          for (let j = addedCount; j < subItems.length; j++) {
            partialList2.appendChild(subItems[j].cloneNode(true));
          }
          currentPage.appendChild(partialSec2);
          continue;
        } else {
          // If not even 1 item fit alongside heading, revert partial section
          currentPage.removeChild(partialSec1);
        }
      }
    }

    if (!splitSuccess) {
      trimTrailingDivider(currentPage);

      // Start new page
      currentPage = createPageContainer(fontFamily);
      container.appendChild(currentPage);
      pages.push(currentPage);

      if (isDivider(child)) {
        continue;
      }

      currentPage.appendChild(child.cloneNode(true));
    }
  }

  pages.forEach((p) => trimTrailingDivider(p));
  return pages;
}

/**
 * Directly exports an HTML resume as an A4 PDF with exact 4-side margins on all pages.
 * If content exceeds 1 page, cleanly distributes into two (or more) pages.
 */
export async function exportResumeToPdf({
  elementId = "printable-resume",
  fileName = "ATS_Resume.pdf",
}: PdfExportOptions = {}): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Resume element #${elementId} not found in DOM`);
  }

  const fontFamily = element.style.fontFamily || "Arial, Helvetica, sans-serif";

  // Hidden offscreen container for pixel-accurate measuring and rendering
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = `${PAGE_WIDTH_PX}px`;
  container.style.background = "#ffffff";
  container.style.zIndex = "-9999";
  document.body.appendChild(container);

  try {
    // Generate clean A4 pages with uniform 48px padding (margins) on all 4 sides
    const pages = paginateResumeElements(element, container, fontFamily);

    // Allow fonts and layouts to settle
    await new Promise((resolve) => setTimeout(resolve, 150));

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    for (let i = 0; i < pages.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }

      const canvas = await html2canvas(pages[i], {
        scale: 2, // High resolution (300 DPI equivalent)
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 1024,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      // Fits entire A4 sheet (210mm x 297mm); the 48px padding creates identical 4-side margins
      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
    }

    const cleanFileName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
    pdf.save(cleanFileName);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
