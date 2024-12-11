// import { jsPDF } from "jspdf";
// import Image from "../../../../../public/kop_recording.png";
// import html2canvas from "html2canvas";

// const toBase64 = (file: Blob): Promise<string> => {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onload = () => {
//             if (typeof reader.result === "string") {
//                 resolve(reader.result);
//             } else {
//                 reject(new Error("FileReader result is not a string"));
//             }
//         };
//         reader.onerror = (error) => reject(error);
//     });
// };

// export const createPDF = async () => {

//     const doc = new jsPDF();
//     try {
//         html2canvas((<img src="" />))
//         const imageResponse = Image.src;
//         const imageBlob = await imageResponse.blob();
//         const base64Image = await toBase64(imageBlob);

//         // Set the title
//         doc.setFontSize(14);
//         // doc.text(base64Image, 105, 10, { align: "center" });
//         doc.text("RECORDING KUNJUNGAN SISWA PRAKERIN 2", 105, 15, { align: "center" });

//         doc.addImage(base64Image, 'PNG', 10, 10, 190, 40);

//         // Add subtitle
//         doc.setFontSize(12);
//         doc.text("Di ____________________", 105, 25, { align: "center" });

//         // Add Division and Date
//         doc.setFontSize(10);
//         doc.text("..... DIVISION", 15, 40);
//         doc.text("Hari/Tanggal/Bulan/Tahun : ____________________", 15, 47);

//         // Add Rekap Permasalahan table
//         doc.setFontSize(10);
//         doc.text("1. Rekap Permasalahan", 15, 60);
//         doc.rect(15, 65, 180, 20); // Table outline
//         doc.text("No", 17, 70);
//         doc.text("Evaluasi Hasil Kunjungan", 40, 70);
//         doc.text("Penyelesaian", 140, 70);
//         doc.line(35, 65, 35, 85); // Column line
//         doc.line(135, 65, 135, 85); // Column line

//         // Add Rekap Monitoring table
//         doc.text("2. Rekap monitoring siswa prakerin", 15, 100);
//         doc.rect(15, 105, 180, 60); // Table outline
//         doc.text("NIS", 17, 110);
//         doc.text("NAMA", 35, 110);
//         doc.text("CHECKLIST MONITORING", 70, 110);
//         doc.text("ALPHA", 140, 110);
//         doc.text("TTD SISWA", 160, 110);
//         doc.line(30, 105, 30, 165); // Column line
//         doc.line(65, 105, 65, 165); // Column line
//         doc.line(135, 105, 135, 165); // Column line
//         doc.line(155, 105, 155, 165); // Column line

//         // Add signature area
//         doc.text("Diketahui Oleh :", 15, 180);
//         doc.text("_________________________", 20, 190);
//         doc.text("Perusahaan", 25, 195);
//         doc.text("_________________________", 140, 190);
//         doc.text("Staff Prakerin / Pembimbing Sekolah", 145, 195);

//         // Save the PDF
//         doc.setDocumentProperties({
//             title: "RECORDING KUNJUNGAN SISWA PRAKERIN",
//             author: "Salmanaf"
//         })
//         doc.output('dataurlnewwindow');
//     } catch (e: any) {
//         console.error("Error generating PDF:", e);
//     }

// };