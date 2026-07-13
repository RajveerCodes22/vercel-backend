import PDFDocument from "pdfkit";

import {
    drawHeader,
    drawFooter,
    sectionTitle
} from "../utils/pdfStyles.js";

import {
    importanceMap,
    addBullet,
    cleanMarkdown
} from "../utils/pdfHelpers.js";

export const pdfdownload = async(req,res)=>{

    try{

        const {result}=req.body;

        if(!result){
            return res.status(400).json({
                error:"No content"
            });
        }

        const doc=new PDFDocument({
            margin:50
        });

        res.setHeader("Content-Type","application/pdf");

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="ExamNotesAI.pdf"'
        );

        doc.pipe(res);

        drawHeader(doc);

        doc
            .font("Helvetica-Bold")
            .fontSize(15)
            .text(`Importance : ${result.important||"N/A"}`);

        sectionTitle(doc,"SUB TOPICS");

        Object.entries(result.subTopics||{}).forEach(([key,topics])=>{

            doc
                .font("Helvetica-Bold")
                .fontSize(13)
                .text(importanceMap[key]||key);

            topics.forEach(topic=>{

                addBullet(doc,topic);

            });

            doc.moveDown();
        });

        sectionTitle(doc,"NOTES");

        doc
            .font("Helvetica")
            .fontSize(12)
            .text(cleanMarkdown(result.notes));

        sectionTitle(doc,"REVISION POINTS");

        (result.revisionPoints||[]).forEach(point=>{

            addBullet(doc,point);

        });

        sectionTitle(doc,"IMPORTANT QUESTIONS");

        doc.font("Helvetica-Bold").text("Short Questions");

        (result.questions?.short||[]).forEach(q=>{

            addBullet(doc,q);

        });

        doc.moveDown();

        doc.font("Helvetica-Bold").text("Long Questions");

        (result.questions?.long||[]).forEach(q=>{

            addBullet(doc,q);

        });

        doc.moveDown();

        doc.font("Helvetica-Bold").text("Diagram");

        doc.font("Helvetica").text(result.questions?.diagram||"N/A");

        drawFooter(doc);

        doc.end();

    }

    catch(err){

        console.log(err);

        res.status(500).json({
            error:err.message
        });

    }

}