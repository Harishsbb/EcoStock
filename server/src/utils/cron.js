import cron from "node-cron";
import Shop from "../models/Shop.js";
import { updateAllProductStatuses } from "../services/expiryService.js";
import { generateAutomatedNotifications } from "../services/notificationService.js";

export const initCronJobs = () => {
  // Scheduled check every midnight (0 0 * * *)
  cron.schedule("0 0 * * *", async () => {
    console.log("[Cron] Running daily midnight inventory expiry & notification check...");
    try {
      const shops = await Shop.find();
      for (const shop of shops) {
        await updateAllProductStatuses(shop._id);
        await generateAutomatedNotifications(shop._id);
      }
      console.log("[Cron] Midnight check complete.");
    } catch (error) {
      console.error("[Cron Error]:", error.message);
    }
  });

  console.log("Cron scheduler initialized.");
};
