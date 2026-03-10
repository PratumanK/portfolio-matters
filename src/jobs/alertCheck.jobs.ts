import cron from "node-cron";
import { User } from "../models/user.js";
import { sendPriceAlertEmail } from "../modules/mail/mail.sendPriceAlert.js";

export const startPriceAlertCron = () => {

  cron.schedule("37 23 * * *", async () => {
    try {

      console.log("Running price alert cron...");

      const users = await User.find({
        "wishlist.alertActive": true
      }).populate("wishlist.stock");

      for (const user of users) {

        for (const item of user.wishlist) {

          if (!item.alertActive || item.alertTriggered) continue;

          const stock = item.stock as any;

          if (!stock) continue;
          if (!item.alertPrice || !item.alertType) continue;
          const shouldTrigger =
            (item.alertType === "above" && stock.currentPrice >= item.alertPrice) ||
            (item.alertType === "below" && stock.currentPrice <= item.alertPrice);

          if (shouldTrigger) {

            await sendPriceAlertEmail(
              user.email,
              stock.name,
              stock.currentPrice,
              item.alertPrice,
              item.alertType
            );

            item.alertTriggered = true;
            item.alertActive = false;

          }
        }

        await user.save();

      }

      console.log("Price alert cron finished");

    } catch (error) {
      console.error("Cron job failed:", error);
    }

  });

};