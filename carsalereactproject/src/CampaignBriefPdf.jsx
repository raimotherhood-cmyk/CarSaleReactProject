import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import assetManifest from "../public/Assets/manifest.json" with { type: "json" };
import { getCampaignDetails } from "./campaignBrief";

Font.register({
    family: "VisionBrief",
    fonts: [
        { src: `/Assets/${assetManifest.fonts.pdfRegular.file}`, fontWeight: 400 },
        { src: `/Assets/${assetManifest.fonts.pdfBold.file}`, fontWeight: 700 },
    ],
});

const styles = StyleSheet.create({
    page: { fontFamily: ["Helvetica", "VisionBrief"], fontSize: 10, lineHeight: 1.6, paddingTop: 108, paddingBottom: 72, paddingHorizontal: 44, color: "#172127", backgroundColor: "#ffffff" },
    header: { position: "absolute", top: 90, left: 44, right: 44, height: 2, backgroundColor: "#172127" },
    wordmark: { position: "absolute", top: 30, left: 44, fontSize: 17, fontWeight: 700, color: "#172127" },
    tagline: { position: "absolute", top: 57, left: 44, fontSize: 8, color: "#424f58" },
    headerLabel: { position: "absolute", top: 37, right: 44, fontSize: 9, fontWeight: 700, color: "#115c4f" },
    title: { fontSize: 23, fontWeight: 700, marginBottom: 5, lineHeight: 1.4 },
    date: { fontSize: 9, color: "#424f58", marginBottom: 18 },
    recipient: { backgroundColor: "#f2f6f8", borderLeftWidth: 3, borderLeftColor: "#115c4f", paddingVertical: 11, paddingHorizontal: 15, marginBottom: 22 },
    label: { fontSize: 8, fontWeight: 700, color: "#424f58", marginBottom: 5 },
    recipientName: { fontSize: 11, fontWeight: 700 },
    section: { fontSize: 11, fontWeight: 700, color: "#115c4f", marginBottom: 10 },
    row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#dbe3e7", paddingBottom: 12, marginBottom: 12 },
    cell: { width: "50%", paddingRight: 18 },
    value: { fontSize: 10, lineHeight: 1.65 },
    goals: { marginTop: 8, fontSize: 10, lineHeight: 1.75 },
    consent: { marginTop: 22, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#bdc9cf", fontSize: 8, color: "#424f58" },
    footer: { position: "absolute", top: 792, left: 44, right: 120, fontSize: 8, color: "#424f58" },
    pageNumber: { position: "absolute", top: 792, right: 44, width: 64, minHeight: 14, textAlign: "right", fontSize: 8, color: "#424f58" },
});

export default function CampaignBriefPdf({ brief, content, recipient }) {
    const { brand, enquiry } = content;
    const labels = enquiry.document;
    const details = getCampaignDetails(brief, enquiry);
    const rows = Array.from({ length: Math.ceil(details.length / 2) }, (_, index) => details.slice(index * 2, index * 2 + 2));
    const prepared = new Date(brief.preparedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    const pageLayout = ({ pageNumber, totalPages, children }, contentNodes) => (
        <>
            <View style={styles.header} />
            <Text style={styles.wordmark}>{brand.name}</Text>
            <Text style={styles.tagline}>{brand.tagline}</Text>
            <Text style={styles.headerLabel}>{labels.title}</Text>
            {children ?? contentNodes}
            <Text style={styles.footer}>{labels.status}</Text>
            <Text style={styles.pageNumber}>{labels.page} {pageNumber} / {totalPages ?? pageNumber}</Text>
        </>
    );

    return (
        <Document title={`${labels.title} - ${brief.company}`} author={brand.name} subject={labels.subject} language="en-IN">
            <Page size="A4" style={styles.page} layout={pageLayout} wrap>
                <View wrap={false}>
                    <Text style={styles.title}>{brief.company}</Text>
                    <Text style={styles.date}>{labels.prepared}: {prepared}</Text>
                    <View style={styles.recipient}><Text style={styles.label}>{labels.recipient}</Text><Text style={styles.recipientName}>{brand.name}</Text><Text>{recipient}</Text></View>
                </View>
                <Text style={styles.section} minPresenceAhead={64}>{labels.details}</Text>
                {rows.map(row => (
                    <View key={row[0].field} style={styles.row} wrap={false}>
                        {row.map(detail => <View key={detail.field} style={styles.cell}><Text style={styles.label}>{detail.label}</Text><Text style={styles.value}>{detail.value}</Text></View>)}
                    </View>
                ))}
                <Text style={styles.section} minPresenceAhead={36}>{labels.objectives}</Text>
                <Text style={styles.goals}>{brief.message}</Text>
                <Text style={styles.consent}>{labels.consent}</Text>
            </Page>
        </Document>
    );
}

