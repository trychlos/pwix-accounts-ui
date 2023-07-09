/*
 * pwix:accounts-ui/src/common/js/save_restore.js
 */

/**
 * @summary Restore the (previously saved) specified package parameter(s)
 * @locus Anywhere
 * @param {String} prefix the prefix of the parameters name
 * @returns {Integer} the count of restored parameters
 */
AccountsUI.restore = function( prefix ){
    let count = 0;
    if( AccountsUI._saved && AccountsUI._saved[prefix] ){
        Object.keys( AccountsUI._saved[prefix] ).every(( opt ) => {
            AccountsUI.opts()[opt]( AccountsUI._saved[prefix][opt] );
            count += 1;
            return true;
        });
    }
    return count;
};

/**
 * @summary Save the specified package parameter(s)
 *  This is an in-memory save which doesn't survive the page reload
 * @locus Anywhere
 * @param {String} prefix the prefix of the parameters name
 * @returns {Integer} the count of saved parameters
 */
AccountsUI.saveOnce = function( prefix ){
    AccountsUI._saved = AccountsUI._saved || {};
    let count = 0;
    if( !AccountsUI._saved[prefix] ){
        AccountsUI._saved[prefix] = {};
        console.debug( 'prefix', prefix, 'opts', AccountsUI.opts().baseOpt_options());
        AccountsUI.opts().baseOpt_options().every(( opt ) => {
            if( opt.startsWith( prefix )){
                AccountsUI._saved[prefix][opt] = AccountsUI.opts()[opt]();
                count += 1;
            }
            return true;
        });
    }
    return count;
};
