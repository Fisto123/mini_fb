import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer'
// fhynkbgouzihmamk
let transporter =  nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    secure:false,
    auth:{
        user:'iyiolafisayo@gmail.com',
        pass: 'fhynkbgouzihmamk'
    }
})
export const sendEmail= async(to,url,txt) => {
    try {
        let info = await transporter.sendMail({
            from : 'iyiolafisayo@gmail.com',
            to:to,
             subject:'Fisto channel',
            html:`
              <div>
               <div style='max-width:700px ;margin:auto; border:10px solid #ddd; padding:50px 20px;font-size:1.6rem'>
    <h2 style="text-align: center;text-transform:uppercase;color:teal;"
    >
        Welcome to fistos channel
        <p>
            Congratulations you are about to use fistos fb channeljust click below to validate youe email address
        </p>
       <a href=${url} style="background: crimson;text-decoration: none; color: white;padding: 10px 20px;">
       ${txt}
       </a>
    <p>If the button doesnt work you can click the link below</p>
    <div>${url}</div>
     </h2>
      </div>
              </div>
            `

        })
    } catch (error) {
      console.log(error);   
    }
}