// const express = require("express")
// const multer = require("multer")
// const nodemailer = require("nodemailer")
// const app = express()
// const PORT = 3000 || process.env.PORT
// const env = require("dotenv").config()
// const upload = multer({ dest: "uploads/" })
// const cors = require("cors")

// app.use(cors())

// app.post("/api/upload-cv", upload.single("cv"), (req, res) => {
//   const { name, email } = req.body
//   const cv = req.file

//   // Configurer nodemailer pour envoyer un email
//   const transporter = nodemailer.createTransport({
//     service: "Gmail", // Ou un autre service email
//     auth: {
//       user: process.env.Email,
//       pass: process.env.mdp,
//     },
//   })

//   const mailOptions = {
//     from: "digital-natives@rh.dz",
//     to: "adoula136@gmail.com",
//     subject: "Nouveau CV reçu",
//     text: `Vous avez reçu un nouveau CV de ${name} (${email}).`,
//     attachments: [
//       {
//         filename: cv.originalname,
//         path: cv.path,
//       },
//     ],
//   }

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log(error)
//       res.status(500).send("Erreur lors de l'envoi de l'email.")
//     } else {
//       console.log("Email envoyé: " + info.response)
//       res.status(200).send("CV reçu et email envoyé.")
//     }
//   })
// })

// app.listen(PORT, () => {
//   console.log(`Serveur en cours d'exécution sur le port ${PORT}`)
// })

const express = require("express")
const multer = require("multer")
const SibApiV3Sdk = require("sib-api-v3-sdk")
const app = express()
const PORT = process.env.PORT || 3000
const upload = multer({ dest: "uploads/" })
const cors = require("cors")
const env = require("dotenv").config()

app.use(cors())

// Configurer l'API Sendinblue
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

// Initialiser la clé API de Sendinblue
SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
  process.env.SENDINBLUE_API_KEY

app.post("/api/upload-cv", upload.single("cv"), (req, res) => {
  const { name, email } = req.body
  const cv = req.file

  // Configurer les options de l'email
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
    to: [{ email: "adoula136@gmail.com" }], // Adresse de destination
    sender: { email: "digital-natives@rh.dz", name: "Digital natives" },
    subject: "Nouveau CV reçu",
    htmlContent: `<p>Vous avez reçu un nouveau CV de ${name} (${email}).</p>`,
    attachments: [
      {
        content: cv.buffer.toString("base64"), // Contenu du fichier en base64
        name: cv.originalname,
      },
    ],
  })

  // Envoyer l'email
  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log("Email envoyé avec succès. ID de la transaction : ", data)
      res.status(200).send("CV reçu et email envoyé.")
    },
    function (error) {
      console.error(error)
      res.status(500).send("Erreur lors de l'envoi de l'email.")
    }
  )
})

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`)
})
