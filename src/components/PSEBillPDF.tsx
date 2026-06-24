"use client";

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Svg,
  Rect,
  Path,
  G,
} from "@react-pdf/renderer";
import { BillData } from "@/lib/types";

const green = "#5B8C2A";
const darkGreen = "#3D6B1E";
const orange = "#F5A623";
const yellow = "#FFF8DC";
const lightBlue = "#E8F4FD";
const lightGreen = "#EAF5E0";
const darkText = "#1a1a1a";
const grayText = "#555555";
const lightGray = "#cccccc";

const s = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: darkText,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  infoBox: {
    backgroundColor: "#FFF3CD",
    borderWidth: 1,
    borderColor: orange,
    padding: 8,
    width: 190,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  dueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: orange,
    padding: 4,
    marginTop: 4,
  },
  servingBox: {
    backgroundColor: lightBlue,
    borderWidth: 1,
    borderColor: "#B8D4E8",
    padding: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: lightGray,
    marginBottom: 4,
    marginTop: 4,
  },
  boldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  helpBox: {
    backgroundColor: lightGreen,
    borderWidth: 1,
    borderColor: "#C5DEB0",
    padding: 8,
    marginTop: 8,
  },
  contactBox: {
    borderWidth: 1,
    borderColor: lightGray,
    padding: 8,
    marginTop: 8,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 2,
    borderTopColor: darkText,
    paddingTop: 10,
  },
  couponLeft: {
    width: "55%",
  },
  couponRight: {
    width: "40%",
    borderWidth: 1,
    borderColor: darkText,
    padding: 8,
  },
});

export function PSEBillPDF({ data, logoBase64 }: { data: BillData; logoBase64: string }) {
  const totalNum = parseFloat(data.totalDue);

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        {/* Header */}
        <View style={s.headerRow}>
          <Image src={logoBase64} style={{ width: 200, height: 22 }} />
          <View style={s.infoBox}>
            <View style={s.infoRow}>
              <Text style={{ fontSize: 8, color: grayText }}>Issued:</Text>
              <Text style={{ fontSize: 8 }}>{data.issueDate}</Text>
            </View>
            <View style={s.infoRow}>
              <Text style={{ fontSize: 8, color: grayText }}>Account Number:</Text>
              <Text style={{ fontSize: 8 }}>{data.accountNumber}</Text>
            </View>
            <View style={s.dueRow}>
              <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "white" }}>DUE DATE</Text>
              <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "white" }}>{data.dueDate}</Text>
            </View>
            <View style={[s.dueRow, { marginTop: 1 }]}>
              <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "white" }}>TOTAL DUE</Text>
              <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "white" }}>${data.totalDue}</Text>
            </View>
          </View>
        </View>

        {/* Page indicator */}
        <Text style={{ fontSize: 7, color: grayText, textAlign: "right", marginBottom: 4 }}>Page 1 of 3</Text>

        {/* Two column layout */}
        <View style={{ flexDirection: "row" }}>
          {/* Left column */}
          <View style={{ width: "48%", paddingRight: 10 }}>
            {/* Serving box */}
            <View style={s.servingBox}>
              <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 4 }}>
                {data.locationName}
              </Text>
              <Text style={{ fontSize: 9 }}>Serving: {data.addressLine1}, {data.cityStateZip.split(",")[0]?.trim()}</Text>
            </View>

            {/* Usage info header */}
            <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", color: green, marginBottom: 8 }}>
              Your Usage Information
            </Text>

            {/* Electric usage chart placeholder */}
            <View style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 8 }}>
                <Svg width={12} height={12} viewBox="0 0 12 12">
                  <Path d="M7 1L3 7h3l-1 4 4-6H6l1-4z" fill={green} />
                </Svg>
                <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold" }}>Electric</Text>
              </View>

              {/* Simple bar chart */}
              <Svg width={240} height={80} viewBox="0 0 240 80">
                {[0,1,2,3,4,5,6,7,8,9,10,11,12].map((i) => {
                  const h = 15 + Math.floor(Math.abs(Math.sin(i * 0.8)) * 50);
                  return (
                    <G key={i}>
                      <Rect x={i * 18 + 2} y={75 - h} width={14} height={h} fill={i === 12 ? "#7CB342" : "#A5D6A7"} />
                    </G>
                  );
                })}
              </Svg>

              {/* Usage stats */}
              <View style={{ borderWidth: 0.5, borderColor: lightGray, marginTop: 4 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 3, backgroundColor: "#f5f5f5" }}>
                  <Text style={{ fontSize: 7 }}></Text>
                  <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold" }}>Last Year</Text>
                  <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold" }}>This Year</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 3 }}>
                  <Text style={{ fontSize: 7 }}>Average daily kilowatt hours</Text>
                  <Text style={{ fontSize: 7 }}>8.69</Text>
                  <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold" }}>14.17</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 3 }}>
                  <Text style={{ fontSize: 7 }}>Average daily cost</Text>
                  <Text style={{ fontSize: 7 }}>$1.82</Text>
                  <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold" }}>$3.32</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 3 }}>
                  <Text style={{ fontSize: 7 }}>Days in billing cycle</Text>
                  <Text style={{ fontSize: 7 }}>29</Text>
                  <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold" }}>29</Text>
                </View>
              </View>
            </View>

            {/* Gas section */}
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 8 }}>
                <Svg width={12} height={12} viewBox="0 0 12 12">
                  <Path d="M6 1C6 1 2 5 2 7.5C2 9.5 3.8 11 6 11C8.2 11 10 9.5 10 7.5C10 5 6 1 6 1Z" fill={orange} />
                </Svg>
                <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold" }}>Natural Gas</Text>
              </View>

              <Svg width={240} height={60} viewBox="0 0 240 60">
                {[0,1,2,3,4,5,6,7,8,9,10,11,12].map((i) => {
                  const h = i >= 4 && i <= 9 ? 3 : 10 + Math.floor(Math.abs(Math.cos(i * 0.6)) * 35);
                  return (
                    <G key={i}>
                      <Rect x={i * 18 + 2} y={55 - h} width={14} height={h} fill={i === 12 ? "#F9A825" : "#FFE082"} />
                    </G>
                  );
                })}
              </Svg>
            </View>
          </View>

          {/* Right column */}
          <View style={{ width: "52%" }}>
            {/* Account Summary */}
            <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 6 }}>
              Your Account Summary
            </Text>

            <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 4 }}>Previous Charges:</Text>
            <View style={s.row}>
              <Text style={{ fontSize: 8 }}>Amount of Your Last Bill (dated {data.paymentDate})</Text>
              <Text style={{ fontSize: 8 }}>$ {data.lastBill}</Text>
            </View>
            <View style={s.row}>
              <Text style={{ fontSize: 8 }}>Payment received {data.paymentDate} – Thank you!</Text>
              <Text style={{ fontSize: 8 }}>{data.paymentAmount}</Text>
            </View>
            <View style={s.divider} />
            <View style={s.boldRow}>
              <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold" }}>Total Previous Charges</Text>
              <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold" }}>$ 0.00</Text>
            </View>

            <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", marginTop: 8, marginBottom: 4 }}>Current Charges:</Text>
            <View style={s.row}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Svg width={8} height={8} viewBox="0 0 8 8">
                  <Path d="M5 0.5L2 4.5h2l-0.5 3 3-4H4.5L5 0.5z" fill={green} />
                </Svg>
                <Text style={{ fontSize: 8 }}>Electric Charges</Text>
              </View>
              <Text style={{ fontSize: 8 }}>$ {data.electricCharges}</Text>
            </View>
            <View style={s.row}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Svg width={8} height={8} viewBox="0 0 8 8">
                  <Path d="M4 0.5C4 0.5 1 3 1 5C1 6.4 2.3 7.5 4 7.5C5.7 7.5 7 6.4 7 5C7 3 4 0.5 4 0.5Z" fill={orange} />
                </Svg>
                <Text style={{ fontSize: 8 }}>Natural Gas Charges</Text>
              </View>
              <Text style={{ fontSize: 8 }}>{data.gasCharges}</Text>
            </View>
            <View style={s.divider} />
            <View style={s.boldRow}>
              <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold" }}>Total Current Charges</Text>
              <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold" }}>$ {data.totalDue}</Text>
            </View>

            <View style={{ borderTopWidth: 1, borderTopColor: darkText, marginTop: 4, paddingTop: 4 }}>
              <View style={s.boldRow}>
                <Text style={{ fontSize: 8, color: grayText, fontStyle: "italic" }}>
                  Total includes current and past due charges
                </Text>
                <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold" }}>Total $ {data.totalDue}</Text>
              </View>
            </View>

            <Text style={{ fontSize: 8, marginTop: 6 }}>
              A credit card payment is scheduled for {data.dueDate} for charges due.
            </Text>

            {/* Late payment notice */}
            <View style={{ borderTopWidth: 1, borderTopColor: lightGray, borderTopStyle: "dashed", marginTop: 8, paddingTop: 6 }}>
              <Text style={{ fontSize: 7, color: grayText, lineHeight: 1.4 }}>
                Late Payments | A late payment fee of 1% per month will apply to past due
                charges, if any, and amounts unpaid more than 10 business days after the
                statement due date.
              </Text>
            </View>

            {/* Help box */}
            <View style={s.helpBox}>
              <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: green, marginBottom: 3 }}>
                We're here to help
              </Text>
              <Text style={{ fontSize: 7, color: grayText, lineHeight: 1.4 }}>
                If you're having difficulty paying your PSE bill, consider setting up payment
                arrangements for smaller, multiple payments over time. Sign in to your
                account or contact us.
              </Text>
              <Text style={{ fontSize: 7, color: green, marginTop: 2 }}>pse.com/paymentarrangement</Text>
            </View>

            {/* Contact */}
            <View style={s.contactBox}>
              <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 4 }}>How to reach us</Text>
              <Text style={{ fontSize: 7, lineHeight: 1.5 }}>For self-service options visit our website at pse.com.</Text>
              <Text style={{ fontSize: 7, lineHeight: 1.5 }}>Email: customercare@pse.com</Text>
              <Text style={{ fontSize: 7, lineHeight: 1.5 }}>Customer Service: 1-888-225-5773    TTY: 1-800-962-9498</Text>
              <Text style={{ fontSize: 7, lineHeight: 1.5 }}>Hours: 7:30 a.m. – 6:30 p.m. M – F</Text>
              <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", marginTop: 4 }}>
                24 Hour Emergency and Outage line: 1-888-225-5773
              </Text>
            </View>
          </View>
        </View>

        {/* Footer / Payment coupon */}
        <View style={s.footer}>
          <View style={s.footerRow}>
            <View style={s.couponLeft}>
              <Image src={logoBase64} style={{ width: 180, height: 20 }} />
              <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", marginTop: 8, marginBottom: 4 }}>
                Your Ways to Pay
              </Text>
              <Text style={{ fontSize: 8, marginBottom: 2 }}>
                To pay or find pay station locations go to pse.com or call 1-888-225-5773
              </Text>
              <Text style={{ fontSize: 8 }}>
                Mail this coupon and make check payable to Puget Sound Energy
              </Text>
              <View style={{ marginTop: 16 }}>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold" }}>{data.locationName}</Text>
                <Text style={{ fontSize: 8 }}>{data.addressLine1}</Text>
                <Text style={{ fontSize: 8 }}>{data.cityStateZip}</Text>
              </View>
            </View>
            <View style={s.couponRight}>
              <View style={{ backgroundColor: "#FFF3CD", padding: 4, marginBottom: 6 }}>
                <Text style={{ fontSize: 8 }}>Account Number:  {data.accountNumber}</Text>
              </View>
              <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", textAlign: "center", marginBottom: 4 }}>
                AUTOMATIC WITHDRAWAL
              </Text>
              <Text style={{ fontSize: 8, textAlign: "center", marginBottom: 8 }}>
                ${data.totalDue} will be withdrawn from your credit card{"\n"}on {data.dueDate}
              </Text>
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}>Serving:</Text>
              <Text style={{ fontSize: 8 }}>{data.addressLine1}, {data.cityStateZip.split(",")[0]?.trim()}</Text>
              <View style={{ marginTop: 12 }}>
                <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}>Puget Sound Energy</Text>
                <Text style={{ fontSize: 8 }}>P.O. BOX 91269</Text>
                <Text style={{ fontSize: 8 }}>Bellevue, WA 98009-9269</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
