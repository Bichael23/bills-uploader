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
} from "@react-pdf/renderer";
import { BillData } from "@/lib/types";

const green = "#4CAF50";
const darkGreen = "#2E7D32";
const blue = "#0097A7";
const darkText = "#1a1a1a";
const grayText = "#555555";
const lightGray = "#e0e0e0";

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
    marginBottom: 16,
  },
  headerLeft: {
    width: "50%",
  },
  totalBox: {
    width: "45%",
    borderWidth: 1,
    borderColor: lightGray,
    padding: 10,
  },
  totalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: darkGreen,
  },
  totalAmount: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  sectionHeader: {
    backgroundColor: "#333333",
    padding: 6,
    marginBottom: 6,
    marginTop: 12,
  },
  sectionHeaderText: {
    color: "white",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  costBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  costColumn: {
    alignItems: "center",
    width: "45%",
  },
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: lightGray,
    marginBottom: 4,
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
  },
  footerLine: {
    borderTopWidth: 1,
    borderTopColor: lightGray,
    borderTopStyle: "dashed",
    paddingTop: 8,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerLeft: {
    width: "50%",
  },
  footerRight: {
    width: "45%",
    borderWidth: 1,
    borderColor: lightGray,
  },
  usageBox: {
    borderWidth: 1,
    borderColor: lightGray,
    padding: 8,
    marginTop: 8,
  },
});

export function EversourceBillPDF({ data, logoBase64 }: {
  data: BillData;
  logoBase64: string;
}) {
  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        {/* Header */}
        <View style={s.headerRow}>
          <View style={s.headerLeft}>
            <Image src={logoBase64} style={{ width: 180, height: 27, marginBottom: 6 }} />
            <View style={{ marginTop: 2 }}>
              <Text style={{ fontSize: 8, color: grayText }}>
                Account Number:    <Text style={{ fontFamily: "Helvetica-Bold", color: darkText }}>{data.accountNumber}</Text>
              </Text>
              <Text style={{ fontSize: 8, color: grayText, marginTop: 1 }}>
                Statement Date:    <Text style={{ color: darkText }}>{data.issueDate}</Text>
              </Text>
              <Text style={{ fontSize: 8, color: grayText, marginTop: 4 }}>
                Service Provided To:
              </Text>
              <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold" }}>
                {data.locationName}
              </Text>
            </View>
          </View>

          <View style={s.totalBox}>
            <View style={s.totalHeader}>
              <View>
                <Text style={s.totalLabel}>Total Amount Due</Text>
                <Text style={{ fontSize: 8, color: darkGreen }}>by {data.dueDate}</Text>
              </View>
              <Text style={s.totalAmount}>${data.totalDue}</Text>
            </View>
            <View style={s.divider} />
            <View style={s.summaryRow}>
              <Text style={{ fontSize: 8 }}>Amount Due On {data.paymentDate}</Text>
              <Text style={{ fontSize: 8 }}>${data.lastBill}</Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={{ fontSize: 8 }}>Last Payment Received</Text>
              <Text style={{ fontSize: 8 }}>$0.00</Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={{ fontSize: 8 }}>Balance Forward</Text>
              <Text style={{ fontSize: 8 }}>${data.lastBill}</Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={{ fontSize: 8 }}>Total Current Charges</Text>
              <Text style={{ fontSize: 8 }}>${data.totalDue}</Text>
            </View>
          </View>
        </View>

        {/* Two column content */}
        <View style={{ flexDirection: "row", gap: 16 }}>
          {/* Left: Usage History */}
          <View style={{ width: "48%" }}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionHeaderText}>Electric Usage History - Kilowatt Hours (kWh)</Text>
            </View>

            <Text style={{ fontSize: 7, color: grayText, marginBottom: 4 }}>kWh/Day</Text>

            {/* Bar chart */}
            <Svg width={220} height={80} viewBox="0 0 220 80">
              {["Nov", "Dec", "Jan", "Feb"].map((month, i) => {
                const heights = [5, 28, 26, 30];
                const h = heights[i];
                return (
                  <Rect
                    key={month}
                    x={i * 50 + 15}
                    y={70 - h * 2}
                    width={35}
                    height={h * 2}
                    fill={i === 3 ? "#333" : "#90CAF9"}
                  />
                );
              })}
            </Svg>
            <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 2 }}>
              {["Nov", "Dec", "Jan", "Feb"].map((m) => (
                <Text key={m} style={{ fontSize: 7, color: grayText }}>{m}</Text>
              ))}
            </View>

            {/* Usage summary */}
            <View style={s.usageBox}>
              <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 4 }}>Electric Usage Summary</Text>
              <Text style={{ fontSize: 8, lineHeight: 1.5 }}>
                This month your average daily electric use was
              </Text>
              <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", color: blue, marginTop: 2 }}>29.5 kWh</Text>
            </View>
          </View>

          {/* Right: Cost breakdown */}
          <View style={{ width: "48%" }}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionHeaderText}>Total Cost of Electricity</Text>
            </View>

            <View style={s.costBox}>
              <View style={s.costColumn}>
                <Text style={{ fontSize: 8, color: grayText, marginBottom: 2 }}>Supply</Text>
                <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", color: blue }}>
                  ${data.supplyCharges}
                </Text>
                <Text style={{ fontSize: 7, color: grayText, marginTop: 2, textAlign: "center" }}>
                  Cost of electricity from{"\n"}Eversource
                </Text>
              </View>
              <View style={s.costColumn}>
                <Text style={{ fontSize: 8, color: grayText, marginBottom: 2 }}>Delivery</Text>
                <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", color: green }}>
                  ${data.deliveryCharges}
                </Text>
                <Text style={{ fontSize: 7, color: grayText, marginTop: 2, textAlign: "center" }}>
                  Cost to deliver electricity{"\n"}from Eversource
                </Text>
              </View>
            </View>

            {/* Cost bar */}
            <Svg width={240} height={20} viewBox="0 0 240 20">
              <Rect x={0} y={4} width={115} height={12} fill={blue} />
              <Rect x={115} y={4} width={115} height={12} fill={green} />
            </Svg>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 2 }}>
              <Text style={{ fontSize: 6, color: grayText }}>$0</Text>
              <Text style={{ fontSize: 6, color: grayText }}>${data.totalDue}</Text>
            </View>

            <View style={{ marginTop: 12 }}>
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}>Your electric supplier is</Text>
              <Text style={{ fontSize: 8, marginTop: 2 }}>Eversource</Text>
              <Text style={{ fontSize: 8 }}>247 Station Drive</Text>
              <Text style={{ fontSize: 8 }}>Westwood, MA 02090</Text>
            </View>
          </View>
        </View>

        {/* News section */}
        <View style={{ marginTop: 16, borderWidth: 1, borderColor: lightGray, padding: 8 }}>
          <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 4 }}>News For You</Text>
          <Text style={{ fontSize: 7, color: grayText, lineHeight: 1.5 }}>
            Residential customers will see a 25% reduction on your bill for February and March usage,
            reflected under "current charges for electricity." To manage your bill visit eversource.com/winter-bill.
          </Text>
        </View>

        <Text style={{ fontSize: 7, color: grayText, textAlign: "center", marginTop: 6 }}>
          Remit Payment To: Eversource, PO Box 56007, Boston, MA 02205-6007
        </Text>

        {/* Footer / Payment coupon */}
        <View style={s.footer}>
          <View style={s.footerLine}>
            <View style={s.footerRow}>
              <View style={s.footerLeft}>
                <Image src={logoBase64} style={{ width: 160, height: 24, marginBottom: 8 }} />
                <Text style={{ fontSize: 8 }}>
                  Account Number:    <Text style={{ fontFamily: "Helvetica-Bold" }}>{data.accountNumber}</Text>
                </Text>
                <Text style={{ fontSize: 7, color: grayText, marginTop: 4, lineHeight: 1.4 }}>
                  You may be subject to a 1.08% late payment charge if{"\n"}
                  the "Total Amount Due" is not received by {data.dueDate}
                </Text>
                <Text style={{ fontSize: 7, color: grayText, marginTop: 10 }}>
                  Please make your check payable to Eversource or to make your payment today visit Eversource.com.
                </Text>

                <View style={{ marginTop: 16 }}>
                  <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold" }}>{data.locationName}</Text>
                  <Text style={{ fontSize: 8 }}>{data.addressLine1}</Text>
                  <Text style={{ fontSize: 8 }}>{data.cityStateZip}</Text>
                </View>
              </View>
              <View style={s.footerRight}>
                <View style={{ padding: 8 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <View>
                      <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: darkGreen }}>Total Amount Due</Text>
                      <Text style={{ fontSize: 7, color: darkGreen }}>by {data.dueDate}</Text>
                    </View>
                    <Text style={{ fontSize: 18, fontFamily: "Helvetica-Bold" }}>${data.totalDue}</Text>
                  </View>
                  <View style={s.divider} />
                  <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", marginTop: 4 }}>Amount Enclosed</Text>
                  <View style={{ borderBottomWidth: 1, borderBottomColor: darkText, marginTop: 16 }} />
                </View>

                <View style={{ padding: 8, marginTop: 8 }}>
                  <Text style={{ fontSize: 8 }}>Eversource</Text>
                  <Text style={{ fontSize: 8 }}>PO Box 56007</Text>
                  <Text style={{ fontSize: 8 }}>Boston, MA 02205-6007</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
