import { app } from './app.js';
import { configureCloudinary } from './utils/cloudinary.js';
import { notifyUsersCron } from './services/notifyUsers.js';
import { removeUnverifiedAccountsCron } from './services/removeUnverifiedAccounts.js';

// Configure Cloudinary
configureCloudinary();

// Start Automation Services (Cron Jobs)
notifyUsersCron();
removeUnverifiedAccountsCron();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

