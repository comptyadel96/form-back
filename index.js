const express = require("express")
const multer = require("multer")
const nodemailer = require("nodemailer")
const app = express()
const PORT = 3000 || process.env.PORT
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


// const express = require("express")
// const multer = require("multer")
// const SibApiV3Sdk = require("sib-api-v3-sdk")
// const app = express()
// const PORT = process.env.PORT || 3000
// const upload = multer({ dest: "uploads/" })
// const cors = require("cors")
// const env = require("dotenv").config()
// const fs = require("fs")
// app.use(cors())

// // Configurer l'API Sendinblue
// const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

// // Initialiser la clé API de Sendinblue
// SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
//   process.env.SENDINBLUE_API_KEY

// app.post("/api/upload-cv", upload.single("cv"), (req, res) => {
//   const { name, email } = req.body
//   const cv = req.file

//   // Lire le fichier à partir du chemin où multer l'a enregistré
//   try {
//     const data = fs.readFileSync(cv.path) // Lire le fichier de manière synchrone

//     // Configurer les options de l'email
//     const sendSmtpEmail = {
//       to: [{ email: "adoula136@gmail.com", name: "Recipient Name" }], // Adresse de destination et nom
//       sender: { email: "digital-natives@rh.dz", name: "Digital Natives" }, // Adresse et nom de l'expéditeur
//       subject: "Nouveau CV reçu",
//       htmlContent: `<p>Vous avez reçu un nouveau CV de ${name} (${email}).</p>`,
//       attachments: [
//         {
//           content: data.toString("base64"), // Contenu du fichier en base64
//           name: cv.originalname, // Nom du fichier attaché
//           contentType: cv.mimetype, // Type MIME du fichier (optionnel mais recommandé)
//         },
//       ],
//     }

//     // Envoyer l'email
//     apiInstance.sendTransacEmail(sendSmtpEmail).then(
//       function (data) {
//         console.log("Email envoyé avec succès. ID de la transaction : ", data)
//         res.status(200).send("CV reçu et email envoyé.")
//       },
//       function (error) {
//         console.error("Erreur lors de l'envoi de l'email : ", error)
//         res.status(500).send("Erreur lors de l'envoi de l'email.")
//       }
//     )
//   } catch (err) {
//     console.error("Erreur lors de la lecture du fichier : ", err)
//     res.status(500).send("Erreur lors de la lecture du fichier.")
//   }
// })

// app.listen(PORT, () => {
//   console.log(`Serveur en cours d'exécution sur le port ${PORT}`)
// })

// const express = require("express")
// const multer = require("multer")
// const Mailjet = require("node-mailjet")
// const app = express()
// const PORT = process.env.PORT || 3000
// const upload = multer({ dest: "uploads/" })
// const cors = require("cors")
// const env = require("dotenv").config()
// const fs = require("fs")
// app.use(cors())

// // Configurer Mailjet
// const mailjet = Mailjet.apiConnect(
//   process.env.MAILJET_API_KEY,
//   process.env.MAILJET_API_SECRET
// )

// app.post("/api/upload-cv", upload.single("cv"), (req, res) => {
//   const { name, email } = req.body
//   const cv = req.file

//   // Lire le fichier à partir du chemin où multer l'a enregistré
//   try {
//     const data = fs.readFileSync(cv.path) // Lire le fichier de manière synchrone

//     // Configurer les options de l'email
//     const emailOptions = {
//       Messages: [
//         {
//           From: {
//             Email: "digital-natives@rh.dz",
//             Name: "Digital Natives",
//           },
//           To: [
//             {
//               Email: "adoula136@gmail.com",
//               Name: "Recipient Name",
//             },
//           ],
//           Subject: "Nouveau CV reçu",
//           TextPart: `Vous avez reçu un nouveau CV de ${name} (${email}).`,
//           Attachments: [
//             {
//               ContentType: cv.mimetype, // Type MIME du fichier
//               Filename: cv.originalname, // Nom du fichier attaché
//               Base64Content: data.toString("base64"), // Contenu du fichier en base64
//             },
//           ],
//         },
//       ],
//     }

//     // Envoyer l'email
//     mailjet
//       .post("send", { version: "v3.1" })
//       .request(emailOptions)
//       .then((result) => {
//         console.log(
//           "Email envoyé avec succès. ID de la transaction : ",
//           result.body
//         )
//         res.status(200).send("CV reçu et email envoyé.")
//       })
//       .catch((err) => {
//         console.error("Erreur lors de l'envoi de l'email : ", err)
//         res.status(500).send("Erreur lors de l'envoi de l'email.")
//       })
//   } catch (err) {
//     console.error("Erreur lors de la lecture du fichier : ", err)
//     res.status(500).send("Erreur lors de la lecture du fichier.")
//   }
// })

// app.listen(PORT, () => {
//   console.log(`Serveur en cours d'exécution sur le port ${PORT}`)
// })
