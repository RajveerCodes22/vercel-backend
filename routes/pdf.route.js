import express from 'express'
import isAuth from '../middleware/IsAuth.js'
import { generateNotes } from '../controllers/generate.controller.js'
import { pdfdownload } from '../controllers/pdf.controller.js'


const pdfRouter = express.Router()

pdfRouter.post("/generate-pdf" , isAuth, pdfdownload)

export default pdfRouter;