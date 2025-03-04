import { type App } from 'vue';
import userManager, { getUser } from '../services/auth';

export default {
    install: (app: App) => {
        app.config.globalProperties.$oidc = userManager;

        // Fetch user on app initialization
        getUser().then((user) => {
            if (user) {
                app.config.globalProperties.$user = user;
            }
        });
    },
};