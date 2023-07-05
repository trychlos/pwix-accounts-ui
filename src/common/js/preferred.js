/*
 * pwix:accounts-ui/src/common/js/preferred.js
 */

import _ from 'lodash';

/*
 * @locus Anywhere
 * @returns {Promise} on client side, which resolves to the specified user account
 * @returns {Object} on server side, the user account itself
 */
AccountsUI._identity = function( id ){
    return Meteor.isClient ? Meteor.callPromise( 'AccountsUI.byId', id ) : AccountsUI._byId( id );
};

/*
 * @summary Returns the preferred label of the user
 * @param {String} arg the user identifier
 * @param {String} preferred the optional caller preference
 */
AccountsUI._preferredLabelById = function( id, preferred, result ){
    if( Meteor.isClient ){
        return AccountsUI._identity( id )
            .then(( user ) => {
                if( user ){
                    return AccountsUI._preferredLabelByDoc( user, preferred );
                }
                console.error( 'id='+id, 'user not found' );
                return result;
            });
    } else {
        const user = AccountsUI._identity( id );
        return user ? AccountsUI._preferredLabelByDoc( user, preferred ) : result;
    }
};

/*
 * @summary returns either a username or an email address
 *  depending of the fields required in the global configuration, of the field availability in the user provided document and of the specified preference
 * @locus Anywhere
 * @param {Object} user the user document got from the database
 * @param {String} preferred an optional preference, either AccountsUI.C.PreferredLabel.USERNAME or AccountsUI.C.PreferredLabel.EMAIL_ADDRESS,
 *  defaulting to the configured value.
 * @returns: an object:
 *  - label: the label to preferentially use when referring to the user
 *  - origin: whether it was a AccountsUI.C.PreferredLabel.USERNAME or a AccountsUI.C.PreferredLabel.EMAIL_ADDRESS
 */
AccountsUI._preferredLabelByDoc = function( user, preferred, result ){
    let mypref = preferred;
    if( !mypref || !Object.keys( AccountsUI.C.PreferredLabel ).includes( mypref )){
        mypref = AccountsUI.opts().preferredLabel();
    }

    if( mypref === AccountsUI.C.PreferredLabel.USERNAME && user.username ){
        result = { label: user.username, origin: AccountsUI.C.PreferredLabel.USERNAME };

    } else if( mypref === AccountsUI.C.PreferredLabel.EMAIL_ADDRESS && user.emails[0].address ){
        result = { label: user.emails[0].address, origin: AccountsUI.C.PreferredLabel.EMAIL_ADDRESS };

    } else if( user.username ){
        console.log( 'fallback to username while preferred is', mypref );
        result = { label: user.username, origin: AccountsUI.C.PreferredLabel.USERNAME };

    } else if( user.emails[0].address ){
        console.log( 'fallback to email name while preferred is', mypref );
        const words = user.emails[0].address.split( '@' );
        result = { label: words[0], origin: AccountsUI.C.PreferredLabel.EMAIL_ADDRESS };
    }
    //console.log( 'mypref='+mypref, 'id='+user._id, 'result', result );
    return result;
};

/**
 * @summary Returns the preferred label of the user
 * @locus Anywhere
 * @param {String|Object} arg the user identifier or the user document
 * @param {String} preferred the optional caller preference, either AC_USERNAME or AC_EMAIL_ADDRESS,
 *  defaulting to the configured value
 * @returns {Promise} on client side, which resolves to the result
 * @returns {Object} the result itself on server side, as:
 *  - label: the computed preferred label
 *  - origin: the origin, which may be 'ID' or AC_USERNAME or AC_EMAIL_ADDRESS
 */
AccountsUI.preferredLabel = function( arg, preferred=AccountsUI.C.PreferredLabel.USERNAME ){
    const id = _.isString( arg ) ? arg : arg._id;
    let result = {
        label: id,
        origin: 'ID'
    };
    const fn = _.isString( arg ) ? 'ById' : 'ByDoc';
    return AccountsUI['_preferredLabel'+fn]( arg, preferred, result );
};
