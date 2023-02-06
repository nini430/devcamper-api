const nodemailer=require('nodemailer')

const sendEmail=async(options)=>{
    const transporter=nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        auth:{
            user:process.env.SMTP_EMAIL,
            pass:process.env.SMTP_PASSWORD
        }
    })

    const message={
        from:`${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to:options.email,
        text:options.message,
        subject:options.subject
    }

    const info=await transporter.sendMail(message).catch(err=>console.log(err));

    console.log("Message Sent!",info.messageId);

 

    
}

module.exports=sendEmail;