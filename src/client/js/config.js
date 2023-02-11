/*
 * pwix:accounts/src/client/js/config.js
 *
 * - attach the acDisplay singleton as Display to pwiAccounts
 * - attach the acUser singleton as User to pwiAccounts
 */

import { acDisplay } from '../classes/ac_display.class.js';
import { acUser } from '../classes/ac_user.class.js';

pwiAccounts = {
    ...pwiAccounts,
    ...{
        Display: new acDisplay(),
        User: new acUser()
    }
}
