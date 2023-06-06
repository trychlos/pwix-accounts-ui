/*
 * pwix:accounts/src/common/js/i18n.js
 */

import { pwixI18n as i18n } from 'meteor/pwix:i18n';

import '../i18n/en_US.js';
i18n.namespace( AC_I18N, 'en_US', pwiAccounts.i18n.en_US );

import '../i18n/fr_FR.js';
i18n.namespace( AC_I18N, 'fr_FR', pwiAccounts.i18n.fr_FR );
