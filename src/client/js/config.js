/*
 * pwix:accounts/src/client/js/config.js
 *
 * - attach the acPanel singleton as Panel to pwiAccounts
 * - attach the acUser singleton as User to pwiAccounts
 */

import { acPanel } from '../classes/ac_panel.class.js';
import { acUser } from '../classes/ac_user.class.js';

pwiAccounts = {
    ...pwiAccounts,
    ...{
        Panel: new acPanel(),
        User: new acUser()
    }
}
