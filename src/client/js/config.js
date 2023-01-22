/*
 * pwi:accounts/src/client/js/conf.js
 *
 * - attach the acPanel singleton as Panel to pwiAccounts.client
 * - attach the acUser singleton as User to pwiAccounts.client
 */

import { acPanel } from '../classes/ac_panel.class.js';
import { acUser } from '../classes/ac_user.class.js';

pwiAccounts.client = {
    ...pwiAccounts.client,
    ...{
        Panel: new acPanel(),
        User: new acUser()
    }
}
