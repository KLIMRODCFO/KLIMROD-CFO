// Utilidad para generar PDF desde HTML usando html2pdf.js
// Instala html2pdf.js en tu proyecto: npm install html2pdf.js

export async function generateReportPDF(elementId: string): Promise<string> {
  // @ts-ignore
  const html2pdf = (await import('html2pdf.js')).default;
  const element = document.getElementById(elementId);
  if (!element) throw new Error('No se encontró el elemento para PDF');

  return new Promise((resolve, reject) => {
    html2pdf()
      .from(element)
      .set({
        margin: 0.5,
        filename: 'reporte-evento.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      })
      .outputPdf('datauristring')
      .then((pdfUrl: string) => {
        // Extrae el base64 del data URI
        const base64 = pdfUrl.split(',')[1];
        resolve(base64);
      })
      .catch(reject);
  });
}
