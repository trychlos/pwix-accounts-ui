/*
 * pwix:accounts/src/client/js/functions.js
 */

import { Tracker } from 'meteor/tracker';

import emailValidator from 'email-validator';

_dropdownItems = {
    dep: null,
    state: null,
    items: []
};

pwiAccounts = {
    ...pwiAccounts,
    ...{
        /**
         * @returns {Array} the list of dropdown items to be displayed regarding the
         *  current user connection state.
         *  NB: we only return here the list of standard dropdown items as we cannot manage
         *  any acUserLogin configuration at this global level.
         *  A reactive data source.
         */
        dropdownItems(){
            if( !_dropdownItems.dep ){
                _dropdownItems.dep = new Tracker.Dependency();
                _dropdownItems.dep.depend();
            }
            const state = pwiAccounts.User.state();
            if( state !== _dropdownItems.state ){
                _dropdownItems.state = state;
                _dropdownItems.items = _buildStandardItems( _stdMenuItems[pwiAccounts.User.state()]); //_getMenuItems();
                _dropdownItems.dep.changed();
            }
            //console.log( _dropdownItems );
            return _dropdownItems.items;
        },
        
        // validate an inputed email address
        validateEmail( email ){
            //console.log( 'email='+email, 'emailValidator.validate='+emailValidator.validate( email ));
            return emailValidator.validate( email );
        },

        // validate the length of an inputed password
        validatePasswordLength( passwd ){
            return passwd && passwd.trim().length >= pwiAccounts.conf.passwordLength;
        },

        // validate the strength of an inputed password
        validatePasswordStrength( passwd, strength ){
            //console.log( 'strength=', strength, 'conf.passwordStrength', pwiAccounts.conf.passwordStrength );
            return strength >= pwiAccounts.conf.passwordStrength;
        }
    }
};
