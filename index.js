const express = require("express")
const multer = require("multer")
const nodemailer = require("nodemailer")
const app = express()
const PORT = 3000
const env = require("dotenv").config()
const upload = multer({ dest: "uploads/" })
const cors = require("cors")

app.use(cors())

app.post("/api/upload-cv", upload.single("cv"), (req, res) => {
  const { name, email } = req.body
  const cv = req.file

  // Configurer nodemailer pour envoyer un email
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Ou un autre service email
    auth: {
      user: process.env.Email,
      pass: process.env.mdp,
    },
  })

  const mailOptions = {
    from: "digital-natives@rh.dz",
    to: "adoula136@gmail.com",
    subject: "Nouveau CV reçu",
    text: `Vous avez reçu un nouveau CV de ${name} (${email}).`,
    attachments: [
      {
        filename: cv.originalname,
        path: cv.path,
      },
    ],
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
      res.status(500).send("Erreur lors de l'envoi de l'email.")
    } else {
      console.log("Email envoyé: " + info.response)
      res.status(200).send("CV reçu et email envoyé.")
    }
  })
})

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`)
})
