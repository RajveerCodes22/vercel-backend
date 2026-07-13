import NoteModel from "../models/notes.model.js";
import UserModel from "../models/user.model.js";
import { buildPrompt } from "../utils/promptBuilder.js";
import { generateGeminiResponse } from "../services/gemini.services.js";

export const generateNotes = async (req, res) => {
    try {
        const {
            topic,
            classLevel,
            examType,
            revisionMode,
            includeDiagram,
            includeChart
        } = req.body;

        if (!topic) {
            return res.status(200).json({ message: "Topic is required" })
        }

        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(400).json({ message: "user is not found" })
        }

        if (user.credits < 10) {
            user.isCreditAvailable = false;
            await user.save();
            return res.status(403).json({
                message: "Insufficient Credits"
            })
        }

        const prompt = buildPrompt({
            topic,
            classLevel,
            examType,
            revisionMode,
            includeDiagram,
            includeChart
        })

        const aiResponse = await generateGeminiResponse(prompt);

        const notes = await NoteModel.create({
            user: user._id,
            topic,
            classLevel,
            examType,
            revisionMode,
            includeDiagram,
            includeChart,
            content: aiResponse
        })

        user.credits -= 10;

        if (user.credits <= 0) {
            user.isCreditAvailable = false;
        }

        if(!Array.isArray(user.notes)) {
            user.notes = [];
        }

        user.notes.push(notes._id);

        await user.save();

        return res.status(200).json({
            data : aiResponse,
            noteId: notes._id,
            creditsLeft : user.credits
        });
      

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "AI genration failed",
            message: error.message,
        });
    }

}