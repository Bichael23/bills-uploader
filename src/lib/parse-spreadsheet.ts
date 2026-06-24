import * as XLSX from "xlsx";
import { BillData } from "./types";

function generateAccountNumber(): string {
  let num = "";
  for (let i = 0; i < 11; i++) num += Math.floor(Math.random() * 10);
  return num;
}

function generateFoundationAccount(): string {
  let num = "";
  for (let i = 0; i < 8; i++) num += Math.floor(Math.random() * 10);
  return num;
}

function generateInvoiceNumber(accountNum: string): string {
  const suffix = Math.floor(Math.random() * 90000 + 10000);
  return `${accountNum.slice(0, 10)}X${suffix}`;
}

function formatDate(raw: string | number | Date): string {
  let d: Date;
  if (typeof raw === "number") {
    d = new Date(Math.round((raw - 25569) * 86400 * 1000));
  } else if (raw instanceof Date) {
    d = raw;
  } else {
    d = new Date(raw);
  }
  if (isNaN(d.getTime())) return String(raw);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}, ${d.getFullYear()}`;
}

function parseFormattedDate(dateStr: string): Date | null {
  const parts = dateStr.match(/(\w+)\s+(\d+),\s+(\d+)/);
  if (!parts) return null;
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  return new Date(+parts[3], months[parts[1]], +parts[2]);
}

function addDays(dateStr: string, days: number): string {
  const d = parseFormattedDate(dateStr);
  if (!d) return dateStr;
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

function formatShortDate(dateStr: string): string {
  const d = parseFormattedDate(dateStr);
  if (!d) return dateStr;
  return `${d.getMonth() + 1}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
}

function previousMonth3rd(dateStr: string): string {
  const d = parseFormattedDate(dateStr);
  if (!d) return dateStr;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const prevMonth = d.getMonth() === 0 ? 11 : d.getMonth() - 1;
  return `${monthNames[prevMonth]} 03`;
}

function previousMonthDate(dateStr: string, day: number): string {
  const d = parseFormattedDate(dateStr);
  if (!d) return dateStr;
  const prev = new Date(d.getFullYear(), d.getMonth() - 1, day);
  return formatDate(prev);
}

function randomAmount(min: number, max: number): string {
  return (Math.random() * (max - min) + min).toFixed(2);
}

export function parseSpreadsheet(buffer: ArrayBuffer): BillData[] {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

  return rows.map((row) => {
    const locationName = String(
      row["Location Name"] || row["location_name"] || row["locationName"] || ""
    ).trim();

    const addressLine1 = String(
      row["Address Line 1"] || row["address_line1"] || row["addressLine1"] || row["Address"] || ""
    ).trim();

    const cityStateZip = String(
      row["City State Zip"] || row["city_state_zip"] || row["cityStateZip"] || row["City, State Zip"] || ""
    ).trim();

    const rawDate = row["Issue Date"] || row["issue_date"] || row["issueDate"] || row["Date"] || row["date"] || new Date();
    const issueDate = formatDate(rawDate as string | number | Date);

    const totalDue = row["Total Due"] || row["total_due"] || row["totalDue"]
      ? String(row["Total Due"] || row["total_due"] || row["totalDue"])
      : randomAmount(85, 200);

    const accountNumber = String(
      row["Account Number"] || row["account_number"] || generateAccountNumber()
    );

    const foundationAccount = String(
      row["Foundation Account"] || row["foundation_account"] || generateFoundationAccount()
    );

    const totalNum = parseFloat(totalDue);
    const electricPct = 0.5 + Math.random() * 0.2;
    const electricCharges = (totalNum * electricPct).toFixed(2);
    const gasCharges = (totalNum * (1 - electricPct)).toFixed(2);
    const supplyPct = 0.45 + Math.random() * 0.1;
    const supplyCharges = (totalNum * supplyPct).toFixed(2);
    const deliveryCharges = (totalNum * (1 - supplyPct)).toFixed(2);

    return {
      locationName: locationName.toUpperCase(),
      addressLine1: addressLine1.toUpperCase(),
      cityStateZip: cityStateZip.toUpperCase(),
      issueDate,
      accountNumber,
      foundationAccount,
      invoiceNumber: generateInvoiceNumber(accountNumber),
      totalDue,
      lastBill: randomAmount(90, 220),
      paymentAmount: "",
      paymentDate: previousMonth3rd(issueDate),
      autoPayDate: addDays(issueDate, 5),
      dueDate: addDays(issueDate, 20),
      electricCharges,
      gasCharges,
      supplyCharges,
      deliveryCharges,
    };
  }).map((bill) => ({
    ...bill,
    paymentAmount: `-$${bill.lastBill}`,
  }));
}
