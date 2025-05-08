
import * as XLSX from 'xlsx';

export interface ExportOptions {
  fileName: string;
  sheets: {
    name: string;
    data: any[];
  }[];
}

export const exportToExcel = (options: ExportOptions): void => {
  const workbook = XLSX.utils.book_new();

  options.sheets.forEach(sheet => {
    const worksheet = XLSX.utils.json_to_sheet(sheet.data);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
  });

  XLSX.writeFile(workbook, `${options.fileName}.xlsx`);
};

export const exportToPDF = (elementId: string, fileName: string): void => {
  // This would typically use a PDF library like jspdf
  // For now, we'll log a message
  console.log(`Exporting ${elementId} to PDF as ${fileName}`);
  alert('PDF export functionality is coming soon!');
};

export const printElement = (elementId: string): void => {
  const printContent = document.getElementById(elementId);
  if (!printContent) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups for this website');
    return;
  }

  printWindow.document.write('<html><head><title>Print</title>');
  printWindow.document.write('<link rel="stylesheet" href="/src/index.css" type="text/css" />');
  printWindow.document.write('</head><body>');
  printWindow.document.write(printContent.innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};
