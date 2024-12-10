import React, { forwardRef } from "react";

// Define the props interface for the RecordingForm
interface RecordingFormProps {}

// Use forwardRef to pass a reference to the parent for PDF generation
const RecordingForm = () => {
  return (
    <div className="flex flex-col justify-center bg-white shadow-lg py-6 px-2">
      <img src="/kop_recording.png" alt="kop" className="mb-8" />
      <div className="flex flex-col items-center">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold uppercase">
            Recording Kunjungan Siswa Prakerin
          </h1>
          <p className="mt-2">
            Di .......................................................
          </p>
        </div>

        <div className="max-w-2xl w-full">
          {/* Division Section */}
          <div className="mt-4">
            <p>DIVISION</p>
            <p>
              Hari/Tanggal/Bulan/Tahun: ....................................
            </p>
          </div>

          {/* Rekap Permasalahan */}
          <div className="mt-6">
            <h2 className="text-lg font-bold">1. Rekap Permasalahan</h2>
            <table className="w-full mt-2 border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 p-2">No</th>
                  <th className="border border-gray-400 p-2">
                    Evaluasi Hasil Kunjungan
                  </th>
                  <th className="border border-gray-400 p-2">Penyelesaian</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-400 p-2"></td>
                  <td className="border border-gray-400 p-2"></td>
                  <td className="border border-gray-400 p-2"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Rekap Monitoring */}
          <div className="mt-6">
            <h2 className="text-lg font-bold">
              2. Rekap Monitoring Siswa Prakerin
            </h2>
            <table className="w-full mt-2 border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 p-2">NIS</th>
                  <th className="border border-gray-400 p-2">Nama</th>
                  <th className="border border-gray-400 p-2">
                    Checklist Monitoring
                  </th>
                  <th className="border border-gray-400 p-2">Alpha</th>
                  <th className="border border-gray-400 p-2">TTD Siswa</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(3)].map((_, index) => (
                  <tr key={index}>
                    <td className="border border-gray-400 p-2"></td>
                    <td className="border border-gray-400 p-2"></td>
                    <td className="border border-gray-400 p-2">
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-col space-y-1">
                          <label>
                            <input type="checkbox" className="mr-2" />
                            Jurnal
                          </label>
                          <label>
                            <input type="checkbox" className="mr-2" />
                            LKSP
                          </label>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label>
                            <input type="checkbox" className="mr-2" />
                            APD
                          </label>
                          <label>
                            <input type="checkbox" className="mr-2" />
                            Kinerja
                          </label>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label>
                            <input type="checkbox" className="mr-2" />
                            Rambut
                          </label>
                          <label>
                            <input type="checkbox" className="mr-2" />
                            Penampilan
                          </label>
                        </div>
                      </div>
                    </td>
                    <td className="border border-gray-400 p-2"></td>
                    <td className="border border-gray-400 p-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signature Section */}
          <div className="mt-8">
            <p className="font-bold">Diketahui Oleh</p>
            <div className="flex justify-between mt-4">
              <div className="text-center">
                <p>.....................................</p>
                <p>Perusahaan</p>
              </div>
              <div className="text-center">
                <p>.....................................</p>
                <p>Staf Prakerin</p>
              </div>
              <div className="text-center">
                <p>.....................................</p>
                <p>Pembimbing Sekolah</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordingForm;
