"use client";

import { useState, useCallback, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import JSZip from "jszip";
import { parseSpreadsheet } from "@/lib/parse-spreadsheet";
import { BillData } from "@/lib/types";
import { BillPDF } from "./BillPDF";

async function fetchAsBase64(url: string, mime: string): Promise<string> {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return `data:${mime};base64,${btoa(binary)}`;
}

export default function BillGenerator() {
  const [bills, setBills] = useState<BillData[]>([]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [images, setImages] = useState<{
    logo: string;
    phoneIcon: string;
    waysToPay: string;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      fetchAsBase64("/att-logo.jpeg", "image/jpeg"),
      fetchAsBase64("/phone-icon.png", "image/png"),
      fetchAsBase64("/ways-to-pay.jpeg", "image/jpeg"),
    ]).then(([logo, phoneIcon, waysToPay]) => {
      setImages({ logo, phoneIcon, waysToPay });
    });
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name);
    const buffer = await file.arrayBuffer();
    const parsed = parseSpreadsheet(buffer);
    setBills(parsed);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const generateAll = useCallback(async () => {
    if (!images) return;
    setGenerating(true);
    setProgress(0);
    const zip = new JSZip();

    for (let i = 0; i < bills.length; i++) {
      const bill = bills[i];
      const doc = (
        <BillPDF
          data={bill}
          logoBase64={images.logo}
          phoneIconBase64={images.phoneIcon}
          waysToPayBase64={images.waysToPay}
        />
      );
      const blob = await pdf(doc).toBlob();
      const safeName = `${bill.locationName} - ${bill.cityStateZip}`.replace(
        /[^a-zA-Z0-9 ,\-]/g,
        ""
      );
      zip.file(`${safeName}.pdf`, blob);
      setProgress(Math.round(((i + 1) / bills.length) * 100));
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "utility-bills.zip";
    a.click();
    URL.revokeObjectURL(url);
    setGenerating(false);
  }, [bills, images]);

  const generateSingle = useCallback(async (bill: BillData) => {
    if (!images) return;
    const doc = (
      <BillPDF
        data={bill}
        logoBase64={images.logo}
        phoneIconBase64={images.phoneIcon}
        waysToPayBase64={images.waysToPay}
      />
    );
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${bill.locationName} - ${bill.cityStateZip}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }, [images]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Upload area */}
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-zinc-300 hover:border-zinc-400"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={onFileChange}
        />
        <div className="text-4xl mb-4">📄</div>
        <p className="text-lg font-medium text-zinc-700">
          {fileName
            ? `Loaded: ${fileName}`
            : "Drop your spreadsheet here or click to upload"}
        </p>
        <p className="text-sm text-zinc-500 mt-2">
          Supports .xlsx, .xls, and .csv files
        </p>
      </div>

      {/* Expected columns */}
      {bills.length === 0 && (
        <div className="mt-8 bg-zinc-50 rounded-xl p-6 border border-zinc-200">
          <h3 className="font-semibold text-zinc-800 mb-3">
            Expected spreadsheet columns:
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-white rounded px-3 py-2 border border-zinc-100">
              <span className="font-mono text-blue-600">Location Name</span>
              <span className="text-zinc-500 ml-2">— e.g. CHIMCARE SEATTLE</span>
            </div>
            <div className="bg-white rounded px-3 py-2 border border-zinc-100">
              <span className="font-mono text-blue-600">Address Line 1</span>
              <span className="text-zinc-500 ml-2">— e.g. 1455 NW LEARY WAY, STE 400</span>
            </div>
            <div className="bg-white rounded px-3 py-2 border border-zinc-100">
              <span className="font-mono text-blue-600">City State Zip</span>
              <span className="text-zinc-500 ml-2">— e.g. SEATTLE, WA 98107</span>
            </div>
            <div className="bg-white rounded px-3 py-2 border border-zinc-100">
              <span className="font-mono text-blue-600">Issue Date</span>
              <span className="text-zinc-500 ml-2">— e.g. 04/11/2026</span>
            </div>
          </div>
          <p className="text-xs text-zinc-400 mt-3">
            Optional: Total Due, Account Number, Foundation Account. If omitted, realistic values are generated.
          </p>
        </div>
      )}

      {/* Bill list */}
      {bills.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-800">
              {bills.length} bill{bills.length !== 1 ? "s" : ""} ready
            </h2>
            <button
              onClick={generateAll}
              disabled={generating || !images}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              {generating
                ? `Generating... ${progress}%`
                : !images
                ? "Loading assets..."
                : `Download All as ZIP`}
            </button>
          </div>

          {generating && (
            <div className="w-full bg-zinc-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <div className="border border-zinc-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-zinc-600">
                    Location
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-600">
                    Address
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-600">
                    Date
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-zinc-600">
                    Total
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill, i) => (
                  <tr
                    key={i}
                    className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50"
                  >
                    <td className="px-4 py-3 font-medium">
                      {bill.locationName}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {bill.addressLine1}, {bill.cityStateZip}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {bill.issueDate}
                    </td>
                    <td className="px-4 py-3 text-right">${bill.totalDue}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => generateSingle(bill)}
                        disabled={!images}
                        className="text-blue-600 hover:text-blue-800 font-medium disabled:text-blue-300"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
