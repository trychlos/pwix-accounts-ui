/*
 * pwix:accounts-ui/src/client/js/singletons.js
 */

import { acConnection } from '../classes/ac_connection.class.js';
import { acManager } from '../classes/ac_manager.class.js';

import { acDisplayManager } from '../classes/ac_display_manager.class.js';
import { acEventManager } from '../classes/ac_event_manager.class.js';

AccountsUI = {
    ...AccountsUI,
    ...{
        Manager: new acManager(),
        Connection: new acConnection(),
        //
        DisplayManager: new acDisplayManager(),
        EventManager: new acEventManager(),
    }
}
