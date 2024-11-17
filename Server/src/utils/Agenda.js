import Agenda from 'agenda';
import maintenanceModel from '../models/maintenance.model.js';
import notificationModel from '../models/notification.model.js';
import CONFIG from '../config/config.js';

const agenda = new Agenda({ db: { address: CONFIG.MONGO_DB_URL + '/' + CONFIG.DB_NAME } });

// Define the notification job
agenda.define('send maintenance notification', async (job) => {
    const { maintenanceId } = job.attrs.data;

    const maintenanceTask = await maintenanceModel.findById(maintenanceId);
    if (maintenanceTask) {
        let tempNotification = {
            equip_id: maintenanceTask.equip_id,
            content: `Maintenance task "${maintenanceTask.title}" is due now.`,
            type: maintenanceTask.type,
            title: maintenanceTask.title
        };

        let savedNotification = new notificationModel(tempNotification);
        await savedNotification.save();
    
        console.log(`Notification sent for maintenance task: ${maintenanceTask.title}`);
    }
});

export { agenda };