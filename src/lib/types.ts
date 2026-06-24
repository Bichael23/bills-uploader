export type TemplateId = "att" | "pse" | "eversource";

export interface TemplateOption {
  id: TemplateId;
  name: string;
  provider: string;
  description: string;
}

export const TEMPLATES: TemplateOption[] = [
  { id: "att", name: "AT&T Wireless", provider: "AT&T", description: "Wireless phone bill" },
  { id: "pse", name: "Puget Sound Energy", provider: "PSE", description: "Electric & gas bill" },
  { id: "eversource", name: "Eversource", provider: "Eversource", description: "Electric bill" },
];

export interface BillData {
  locationName: string;
  addressLine1: string;
  cityStateZip: string;
  issueDate: string;
  accountNumber: string;
  foundationAccount: string;
  invoiceNumber: string;
  totalDue: string;
  lastBill: string;
  paymentAmount: string;
  paymentDate: string;
  autoPayDate: string;
  dueDate: string;
  electricCharges: string;
  gasCharges: string;
  supplyCharges: string;
  deliveryCharges: string;
}
