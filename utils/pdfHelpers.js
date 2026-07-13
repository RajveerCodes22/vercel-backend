// utils/pdfHelpers.js

export const importanceMap = {
  "+P": "🔥 Must Study",
  "+P+P": "⭐ Exam Focus",
  "+P+P+P": "📚 Additional Topics",
};

export function addBullet(doc, text) {
  doc
    .font("Helvetica")
    .fontSize(12)
    .fillColor("#374151")
    .text(`• ${text}`, {
      indent: 15,
      lineGap: 4,
    });
}

export function cleanMarkdown(text) {
  if (!text) return "";

  return text
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/`/g, "")              // Remove inline code
    .replace(/#{1,6}\s*/g, "")      // Remove markdown headings
    .replace(/\*\*/g, "")           // Remove bold
    .replace(/\*/g, "")             // Remove italic
    .replace(/_/g, "")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")     // Remove excessive blank lines
    .trim();
}