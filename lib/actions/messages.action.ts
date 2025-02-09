"use server";
import nodemailer from "nodemailer";

export async function sendEmail(to: string) {
  const fromEmail = process.env.SMTP_EMAIL;
  const password = process.env.SMTP_PASSWORD;
  const businessName = "ΣΧΟΛΗΣ ΣΚΥΛΩΝ ΑΠΟΛΛΩΝ";
  const businessName2 = "ΣΧΟΛΗ ΣΚΥΛΩΝ ΑΠΟΛΛΩΝ";
  const businessAddress = "Ελευθερίας 5, Κορωπί 194 00, Ελλάδα";
  const mapsLink =
    "https://www.google.com/maps/dir//%CE%95%CE%BB%CE%B5%CF%85%CE%B8%CE%B5%CF%81%CE%AF%CE%B1%CF%82+5,+%CE%9A%CF%81%CF%89%CF%80%CE%AF%CE%B1+194+00/@37.9277205,23.7766024,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x14a190d535cc0029:0x25d8258f810453d6!2m2!1d23.8589869!2d37.9276821?entry=ttu&g_ep=EgoyMDI1MDIwNS4xIKXMDSoASAFQAw%3D%3D";
  try {
    console.log("pass", password);
    console.log("from", fromEmail);
    console.log("to", to);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL, // Your Gmail email
        pass: process.env.SMTP_PASSWORD, // Your App Password
      },
    });

    const mailOptions = {
      from: `"${businessName}" <${process.env.SMTP_EMAIL}>`,
      to,
      subject: `Καλώς ήρθατε στη ${businessName2}!`,
      text: `Αγαπητέ πελάτη,
    
    Είμαστε ενθουσιασμένοι που σας καλωσορίζουμε στη ${businessName2}!
    
    📍 Η διεύθυνσή μας: ${businessAddress}
    
    Για τη διευκόλυνσή σας, μπορείτε να βρείτε οδηγίες εδώ:
    ${mapsLink}
    
    Εάν έχετε οποιαδήποτε ερώτηση, μη διστάσετε να επικοινωνήσετε μαζί μας. Ανυπομονούμε να σας γνωρίσουμε!
    
    Με εκτίμηση,  
    Η ομάδα του ${businessName}
      `,
      html: `
        <p>Αγαπητέ πελάτη,</p>
        <p>Είμαστε ενθουσιασμένοι που σας καλωσορίζουμε στη <strong>${businessName2}</strong>!</p>
        <p>📍 <strong>Η διεύθυνσή μας:</strong> ${businessAddress}</p>
        <p>Για τη διευκόλυνσή σας, μπορείτε να βρείτε οδηγίες <a href="${mapsLink}" target="_blank">εδώ</a>.</p>
        <p>Εάν έχετε οποιαδήποτε ερώτηση, μη διστάσετε να επικοινωνήσετε μαζί μας. Ανυπομονούμε να σας γνωρίσουμε!</p>
        <p>Με εκτίμηση,<br><strong>Η ομάδα της ${businessName}</strong></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent successfully" };
  } catch (error: any) {
    console.error("Nodemailer Error:", error);
    return { success: false, message: "Failed to send email", error };
  }
}
