import { transporter } from "./mail.transporter.js";
import { priceAlertTemplate } from "./templates/priceAlertTemplates.js";
export const sendPriceAlertEmail = async (
  email: string,
  stockName: string,
  currentPrice: number,
  targetPrice: number,
  alertType:string
) => {
  try{
    if (alertType=="above"){
     await transporter.sendMail({
    from: `"Stock Tracker" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🚨 ${stockName} has crossed over  Target Price `,
    html: priceAlertTemplate(stockName, currentPrice, targetPrice)
  });
  }
  else if(alertType=="below"){
      await transporter.sendMail({
    from: `"Stock Tracker" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🚨 ${stockName} has dropped below Target Price `,
    html: priceAlertTemplate(stockName, currentPrice, targetPrice)
  });
  }
  console.log("Alert email sent");
  }
  catch(error){
    console.error("Email sending failed:", error);
  }
  
 
};