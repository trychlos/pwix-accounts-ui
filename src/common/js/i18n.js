/*
 * pwix:accounts-ui/src/common/js/i18n.js
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import '../i18n/en_US.js';
pwixI18n.namespace( I18N, 'en', AccountsUI.i18n.en_US );

import '../i18n/fr_FR.js';
pwixI18n.namespace( I18N, 'fr', AccountsUI.i18n.fr_FR );

AccountsUI.i18n.namespace = function(){
    return I18N;
};
