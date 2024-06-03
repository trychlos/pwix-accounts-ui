/*
 * pwix:accounts-ui/src/client/js/index.js
 */

import '../../common/js/index.js';

import { acConnection } from '../classes/ac_connection.class.js';

AccountsUI.Connection = new acConnection();

import './account.js';
import './accounts_base.js';
import './bodyevents.js';
import './defaults.js';
import './dom.js';
import './functions.js';
import './panel.js';
import './private.js';
import './ready.js';
import './user.js';
