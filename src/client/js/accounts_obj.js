/*
 * pwix:accounts/src/client/js/accounts_obj.js
 *
 * - attach the acDisplayManager singleton to pwiAccounts
 * - attach the acUser singleton as User to pwiAccounts
 */

import { acDisplayManager } from '../classes/ac_display_manager.class.js';
import { acEventManager } from '../classes/ac_event_manager.class.js';
import { acUser } from '../classes/ac_user.class.js';

pwiAccounts = {
    ...pwiAccounts,
    ...{
        DisplayManager: new acDisplayManager(),
        EventManager: new acEventManager(),
        User: new acUser()
    }
}
