/*
 * pwix:accounts-ui/src/client/js/singletons.js
 */

import { acConnection } from '../classes/ac_connection.class.js';
import { acDisplay } from '../classes/ac_display.class.js';
import { acManager } from '../classes/ac_manager.class.js';

AccountsUI.Manager = new acManager();
AccountsUI.Connection = new acConnection();
AccountsUI.Display = new acDisplay();
