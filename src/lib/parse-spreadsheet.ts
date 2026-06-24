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

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    const parts = dateStr.match(/(\w+)\s+(\d+),\s+(\d+)/);
    if (!parts) return dateStr;
    const months: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    const nd = new Date(+parts[3], months[parts[1]], +parts[2]);
    nd.setDate(nd.getDate() + days);
    return formatDate(nd);
  }
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

function previousMonth3rd(dateStr: string): string {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const parts = dateStr.match(/(\w+)\s+(\d+),\s+(\d+)/);
  if (!parts) return dateStr;
  const month = months[parts[1]];
  const year = +parts[3];
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[prevMonth]} 03`;
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
      : randomAmount(85, 145);

    const accountNumber = String(
      row["Account Number"] || row["account_number"] || generateAccountNumber()
    );

    const foundationAccount = String(
      row["Foundation Account"] || row["foundation_account"] || generateFoundationAccount()
    );

    return {
      locationName: locationName.toUpperCase(),
      addressLine1: addressLine1.toUpperCase(),
      cityStateZip: cityStateZip.toUpperCase(),
      issueDate,
      accountNumber,
      foundationAccount,
      invoiceNumber: generateInvoiceNumber(accountNumber),
      totalDue,
      lastBill: randomAmount(90, 150),
      paymentAmount: "",
      paymentDate: previousMonth3rd(issueDate),
      autoPayDate: addDays(issueDate, 5),
    };
  }).map((bill) => ({
    ...bill,
    paymentAmount: `-$${bill.lastBill}`,
  }));
}
