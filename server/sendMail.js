import nodemailer from 'nodemailer'
import {OAuth2Client} from 'google-auth-library';
import dotenv from 'dotenv';
const OAUTH_PLAYGROUND= 'https://developers.google.com/oauthplayground'
dotenv.config();
const {
MAILING_SERVICE_CLIENT_ID,
CLIENT_SECRET,
MAILING_SERVICE_REFRESH_TOKEN,
SENDER_EMAIL_ADDRESS
} = process.env
const oauth2client = new OAuth2Client(
    MAILING_SERVICE_CLIENT_ID,
    CLIENT_SECRET,
     MAILING_SERVICE_REFRESH_TOKEN,
     SENDER_EMAIL_ADDRESS
)


  export const sendEmail = (to,url)=>{
        oauth2client.setCredentials({
            refresh_token:MAILING_SERVICE_REFRESH_TOKEN
        })  
        const accessToken = oauth2client.getAccessToken()
        console.log(accessToken);
        const smtpTransport= nodemailer.createTransport({
            service:'gmail',
            auth:{
            type:'OAuth2',
            user:SENDER_EMAIL_ADDRESS,
            clientId:MAILING_SERVICE_CLIENT_ID,
            clientSecret:CLIENT_SECRET,
            refreshToken:MAILING_SERVICE_REFRESH_TOKEN,
            accessToken
        }
        })
        const mailOptions={
            from:SENDER_EMAIL_ADDRESS,
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
       <a href=${url} style="background: crimson;text-decoration: none; color: white;padding: 10px 20px;"></a>
    <p>If the button doesnt work you can click the link below</p>
    <div>${url}</div>
     </h2>
      </div>
              </div>
            `
        }
        smtpTransport.sendMail(mailOptions,(err,infor)=>{
            if(err) return err
            return infor
        })
   }