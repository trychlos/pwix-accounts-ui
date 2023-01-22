/*
 * /src/client/classes/ac_user.class.js
 *
 * This class manages the interface with the currently logged-in user.
 * A singleton is attached to the global 'pwiAccounts' object.
 */
import { Accounts } from 'meteor/accounts-base';
import { ReactiveVar } from 'meteor/reactive-var';

import { pwiI18n } from 'meteor/pwi:i18n';
import { pwiTolert } from 'meteor/pwi:tolert';

export class acUser {

    // private data
    static Singleton = null;

    // maintains a LOGGED/UNLOGGED status
    //  is expected to be exactly consistant with Meteor.user() but adds a (very) thin conceptualization level
    _state = new ReactiveVar( null );

    // private functions

    //public data

    /**
     * Constructor
     * @returns {acUser}
     */
    constructor(){
        if( acUser.Singleton ){
            console.log( 'pwi:accounts returning already instanciated acUser' );
            return acUser.Singleton;
        }

        console.log( 'pwi:accounts instanciating new acUser' );

        this.state( Meteor.userId() ? AC_LOGGED : AC_UNLOGGED );

        acUser.Singleton = this;
        return this;
    }

    /**
     * Change the user's password
     * @param {String} oldpwd the current password
     * @param {String} newpwd the new password to be set
     * @param {Object} target the target of the sent events
     */
    changePwd( oldpwd, newpwd, target ){
        const self = this;
        Accounts.changePassword( oldpwd, newpwd, ( err ) => {
            if( err ){
                console.error( err );
                target.trigger( 'ac-dialog-error', pwiI18n.label( pwiAccounts.strings, 'user', 'error_change_pwd' ));
            } else {
                pwiAccounts.client.Panel.asked( AC_PANEL_NONE );
                pwiTolert.success( pwiI18n.label( pwiAccounts.strings, 'user', 'success_change_pwd' ));
                $( '.acUserLogin' ).trigger( 'ac-user-changepwd', self.mailAddress());
            }
        });
    }

    /**
     * Create a new user with a (mail,password) couple
     * Change the connection state to 'LOGGED' if OK, or send an 'ac-error' message to the target
     * We try to verify emails, so send simultaneouly (in the background) an email to check that.
     * Note that the 'Accounts.createUser()' method doesn't force any security rule on the password.
     * We have to rely on pwiAccounts.client.fn.validatePassword() for that.
     * @param {String} mail the entered mail address
     * @param {String} password the entered password
     * @param {Object} target the target of the sent events
     * @param {Boolean} autoConnect whether to automatically login the newly created user
     */
    createUser( mail, password, target, autoConnect=true ){
        const self = this;
        console.log( 'mail='+mail, 'password='+password, 'autoConnect='+autoConnect );
        if( autoConnect ){
            Accounts.createUser({ email:mail, password:password }, ( err ) => {
                if( err ){
                    console.error( err );
                    target.trigger( 'ac-dialog-error', pwiI18n.label( pwiAccounts.strings, 'user', 'error_signup' ));
                } else {
                    self.state( AC_LOGGED );
                    pwiAccounts.client.Panel.asked( AC_PANEL_NONE );
                    $( '.acUserLogin' ).trigger( 'ac-user-create', mail );
                }
            });
        } else {
            Meteor.call( 'pwiAccounts.createUser', mail, password, ( err, res ) => {
                if( err ){
                    console.error( err );
                    target.trigger( 'ac-dialog-error', pwiI18n.label( pwiAccounts.strings, 'user', 'error_signup' ));
                } else {
                    pwiTolert.success( pwiI18n.label( pwiAccounts.strings, 'user', 'success_signup' ).format( mail ));
                    $( '.acUserLogin' ).trigger( 'ac-user-create', mail );
                }
            });
        }
    }

    /**
     * Login with a (mail,password) couple
     * Change the connection state to 'LOGGED' if OK, or send an 'ac-error' message to the target
     * @param {String} mail the entered mail address
     * @param {String} password the entered password
     * @param {Object} target the target of the sent events
     */
    loginWithPassword( mail, password, target ){
        const self = this;
        Meteor.loginWithPassword( mail, password, ( err ) => {
            if( err ){
                console.error( err );
                target.trigger( 'ac-dialog-error', pwiI18n.label( pwiAccounts.strings, 'user', 'error_login' ));
            } else {
                self.state( AC_LOGGED );
                pwiAccounts.client.Panel.asked( AC_PANEL_NONE );
                $( '.acUserLogin' ).trigger( 'ac-user-login', mail );
            }
        });
    }

    /**
     * Logout
     */
    logout(){
        const email = this.mailAddress();
        Meteor.logout();
        this.state( AC_UNLOGGED );
        pwiAccounts.client.Panel.asked( AC_PANEL_NONE );
        $( '.acUserLogin' ).trigger( 'ac-user-logout', email );
    }

    /**
     * @returns {String} the (first) mail address of the currently logged-in user
     */
    mailAddress(){
        return pwiAccounts.email( Meteor.userId());
    }

    /**
     * @returns {Boolean} whether the (first) mail address is verified
     */
    mailVerified(){
        return Meteor.user() ? Meteor.user().emails[0].verified : false;
    }

    /**
     * Send a mail to let the user reset his/her password
     * @param {String} mail the entered mail address
     * @param {Object} target the target of the sent events
     */
    resetPwd( mail, target ){
        const self = this;
        Accounts.forgotPassword({ email: mail }, ( err ) => {
            if( err ){
                console.error( err );
                target.trigger( 'ac-dialog-error', pwiI18n.label( pwiAccounts.strings, 'user', 'error_reset_send' ));
            } else {
                pwiAccounts.client.Panel.asked( AC_PANEL_NONE );
                $( '.acUserLogin' ).trigger( 'ac-user-resetasked', mail );
            }
        });
    }

    /**
     * Getter/Setter
     * @param {String} state the new logged-in status
     * @returns {String} the logged-in status as AC_LOGGED or AC_UNLOGGED
     */
    state( state ){
        if( state && ( state === AC_LOGGED || state === AC_UNLOGGED )){
            this._state.set( state );
        }
        return this._state.get();
    }

    /**
     * Re-send a mail to let us verify the user's email
     */
    verifyMail(){
        const self = this;
        Meteor.call( 'pwiAccounts.sendVerificationEmail', Meteor.userId());
        pwiTolert.success( pwiI18n.label( pwiAccounts.strings, 'user', 'verify_success' ));
        pwiAccounts.client.Panel.asked( AC_PANEL_NONE );
        $( '.acUserLogin' ).trigger( 'ac-user-verifyreasked', self.mailAddress());
    }
}
