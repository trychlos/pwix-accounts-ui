/*
 * pwi:accounts/src/client/js/conf.js
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