/*
 * pwix:accounts-ui/src/client/js/singletons.js
 *
 * - attach the acDisplayManager singleton to AccountsUI
 * - attach the acUser singleton as User to AccountsUI
 */

import { acDisplayManager } from '../classes/ac_display_manager.class.js';
import { acEventManager } from '../classes/ac_event_manager.class.js';
import { acUser } from '../classes/ac_user.class.js';

AccountsUI = {
    ...AccountsUI,
    ...{
        DisplayManager: new acDisplayManager(),
        EventManager: new acEventManager(),
        User: new acUser()
    }
}
