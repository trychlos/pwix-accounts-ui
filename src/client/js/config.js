/*
 * pwix:accounts/src/client/js/config.js
 *
 * - attach the acDisplayer singleton as Display to pwiAccounts
 * - attach the acUser singleton as User to pwiAccounts
 */

import { acDisplayer } from '../classes/ac_displayer.class.js';
import { acUser } from '../classes/ac_user.class.js';

pwiAccounts = {
    ...pwiAccounts,
    ...{
        Display: new acDisplayer(),
        User: new acUser()
    }
}
