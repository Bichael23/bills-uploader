"use client";

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Svg,
  Circle,
} from "@react-pdf/renderer";
import { BillData } from "@/lib/types";

const blue = "#009FDB";
const darkText = "#1a1a1a";
const grayText = "#555555";
const lightGray = "#e0e0e0";

const s = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: darkText,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  headerRight: {
    borderWidth: 0.5,
    borderColor: lightGray,
    padding: 8,
    width: 230,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  headerLabel: {
    fontSize: 8,
    color: grayText,
    width: 100,
  },
  headerValue: {
    fontSize: 8,
    textAlign: "right",
    flex: 1,
  },
  companyName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  addressText: {
    fontSize: 8,
    color: darkText,
    lineHeight: 1.4,
  },
  premierText: {
    fontSize: 8,
    color: grayText,
    marginTop: 20,
    marginBottom: 10,
    maxWidth: 320,
    lineHeight: 1.5,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: darkText,
    marginBottom: 8,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    marginTop: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  rowLabel: {
    fontSize: 9,
    color: darkText,
  },
  rowValue: {
    fontSize: 9,
    color: darkText,
    textAlign: "right",
  },
  boldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  boldLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  boldValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  totalBox: {
    borderWidth: 1,
    borderColor: lightGray,
    padding: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalBoxLabel: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  totalBoxAmount: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  autoPaySmall: {
    fontSize: 7,
    color: grayText,
    marginTop: 2,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
  },
  waysToPaySmall: {
    fontSize: 7,
    color: grayText,
  },
  footerBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderTopWidth: 0.5,
    borderTopColor: lightGray,
    paddingTop: 10,
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  footerRight: {
    textAlign: "right",
  },
  barcode: {
    fontSize: 8,
    textAlign: "center",
    marginTop: 10,
    letterSpacing: 1,
  },
  serviceSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
});

function TotalDueCircle({ amount, autoPayDate }: { amount: string; autoPayDate: string }) {
  return (
    <View style={{ alignItems: "center" }}>
      <Svg width={160} height={160} viewBox="0 0 160 160">
        <Circle cx="80" cy="80" r="75" fill="none" stroke={blue} strokeWidth="4" />
      </Svg>
      <View style={{ position: "absolute", top: 30, alignItems: "center" }}>
        <Text style={{ fontSize: 9, color: grayText, marginBottom: 4 }}>Total due</Text>
        <Text style={{ fontSize: 28, fontFamily: "Helvetica-Bold", color: darkText }}>
          ${amount}
        </Text>
        <Text style={{ fontSize: 8, color: grayText, marginTop: 6 }}>
          AutoPay is scheduled for:
        </Text>
        <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: darkText, marginTop: 2 }}>
          {autoPayDate}
        </Text>
      </View>
    </View>
  );
}

export function BillPDF({ data, logoBase64, phoneIconBase64, waysToPayBase64 }: {
  data: BillData;
  logoBase64: string;
  phoneIconBase64: string;
  waysToPayBase64: string;
}) {
  const barcodeNum = `999${data.accountNumber.slice(0, 10)}${data.foundationAccount}1000000000${data.totalDue.replace(".", "")}00000000${data.totalDue.replace(".", "")}008`;

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Image src={logoBase64} style={{ width: 100, height: 38 }} />
            <View style={{ marginLeft: 8 }}>
              <Text style={s.companyName}>{data.locationName}</Text>
              <Text style={s.addressText}>{data.addressLine1},</Text>
              <Text style={s.addressText}>{data.cityStateZip}</Text>
            </View>
          </View>
          <View style={s.headerRight}>
            <View style={s.headerRow}>
              <Text style={s.headerLabel}>Page:</Text>
              <Text style={s.headerValue}>1 of 1</Text>
            </View>
            <View style={s.headerRow}>
              <Text style={s.headerLabel}>Issue Date:</Text>
              <Text style={s.headerValue}>{data.issueDate}</Text>
            </View>
            <View style={s.headerRow}>
              <Text style={s.headerLabel}>Account Number:</Text>
              <Text style={s.headerValue}>{data.accountNumber}</Text>
            </View>
            <View style={s.headerRow}>
              <Text style={s.headerLabel}>Foundation Account:</Text>
              <Text style={s.headerValue}>{data.foundationAccount}</Text>
            </View>
            <View style={s.headerRow}>
              <Text style={s.headerLabel}>Invoice:</Text>
              <Text style={s.headerValue}>{data.invoiceNumber}</Text>
            </View>
          </View>
        </View>

        {/* Premier eBill text */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Text style={s.premierText}>
            Want to learn more about your details and usage? Sign into Premier eBill at
            wireless.att.com/premiercare and go to your customizable reporting.
          </Text>
          <TotalDueCircle amount={data.totalDue} autoPayDate={data.autoPayDate} />
        </View>

        {/* Account summary */}
        <Text style={s.sectionTitle}>Account summary</Text>
        <View style={s.divider} />
        <View style={s.row}>
          <Text style={s.rowLabel}>Your last bill</Text>
          <Text style={s.rowValue}>${data.lastBill}</Text>
        </View>
        <View style={s.row}>
          <Text style={s.rowLabel}>Payment, {data.paymentDate} - Thank you!</Text>
          <Text style={s.rowValue}>{data.paymentAmount}</Text>
        </View>
        <View style={s.divider} />
        <View style={s.boldRow}>
          <Text style={s.boldLabel}>Remaining balance</Text>
          <Text style={s.boldValue}>$0.00</Text>
        </View>

        {/* Service summary */}
        <Text style={s.sectionTitle}>Service summary</Text>
        <View style={s.divider} />
        <View style={s.serviceSummary}>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Image src={phoneIconBase64} style={{ width: 14, height: 24 }} />
            <Text style={{ marginLeft: 6, fontSize: 9 }}>Wireless</Text>
            <Text style={{ marginLeft: 16, fontSize: 7, color: grayText }}>Page 2</Text>
          </View>
          <Text style={s.rowValue}>${data.totalDue}</Text>
        </View>
        <View style={s.divider} />
        <View style={s.boldRow}>
          <Text style={s.boldLabel}>Total services</Text>
          <Text style={s.boldValue}>${data.totalDue}</Text>
        </View>

        {/* Total due box */}
        <View style={s.totalBox}>
          <View>
            <Text style={s.totalBoxLabel}>Total due</Text>
            <Text style={s.autoPaySmall}>
              AutoPay is scheduled to debit your bank account on {data.autoPayDate}
            </Text>
          </View>
          <Text style={s.totalBoxAmount}>${data.totalDue}</Text>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          {/* Ways to pay banner */}
          <Image src={waysToPayBase64} style={{ width: 400, height: 67, marginBottom: 16 }} />

          {/* Bottom footer */}
          <View style={s.footerBottom}>
            <View style={s.footerLeft}>
              <Image src={logoBase64} style={{ width: 70, height: 27 }} />
              <View>
                <Text style={s.companyName}>{data.locationName}</Text>
                <Text style={s.addressText}>{data.addressLine1},</Text>
                <Text style={s.addressText}>{data.cityStateZip}</Text>
              </View>
            </View>
            <View style={s.footerRight}>
              <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold" }}>
                AutoPay of ${data.totalDue} is scheduled for
              </Text>
              <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold" }}>
                {data.autoPayDate}
              </Text>
              <Text style={{ fontSize: 8, color: grayText, marginTop: 4 }}>
                Account number: {data.accountNumber.slice(0, 11)}
              </Text>
              <Text style={{ fontSize: 8, color: grayText, marginTop: 2 }}>
                AT&T MOBILITY
              </Text>
            </View>
          </View>

          {/* Barcode number */}
          <Text style={s.barcode}>{barcodeNum}</Text>
        </View>
      </Page>
    </Document>
  );
}
