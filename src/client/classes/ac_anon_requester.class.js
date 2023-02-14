/*
 * /src/client/classes/ac_anon_requester.class.js
 *
 * A companion class which implements the IDisplayRequester interface.
 * 
 * A unique instance of this class is allocated and managed by pwiAccounts global.
 * It targets the cases where we do not have any acUserLogin Blaze template instance.
 */

import { Accounts } from 'meteor/accounts-base';

import { IDisplayRequester } from './idisplay_requester.interface.js';
import { Interface } from './interface.class';

export class acAnonRequester {

    // static data
    //

    // static methods
    //

    // private data
    //

    // private methods
    //

    /*
    'ac-submit '( event, instance ){
    }
    */
    
    /*
     * pwiAccounts manages all its modal through a combination of pwixModal (attached to the body) and ac_footer.
     * As a consequence, the displayed panel cannot intercept - nor manage - the buttons events.
     * We have to deal here we the validation of ac_reset_pwd panel.
     */
    _submit_handler( event, data ){
        console.debug( '_submit_handler()', event, data );
        switch( event.type ){
            case 'ac-submit':
                const pwd = $( '.ac-reset-pwd .ac-newone .ac-input-password input' ).val().trim();
                Accounts.resetPassword( token, passwd, ( err ) => {
                    if( err ){
                        console.error( err );
                        this._resetExpired();
                    } else {
                        pwixBootbox.alert({
                            title: i18n.label( AC_I18N, 'user.resetpwd_title' ),
                            message: i18n.label( AC_I18N, 'user.resetpwd_text' )
                        });
                        pwiAccounts.Displayer.IEventManager.trigger( 'ac-user-resetdone-even', { email: user.services.password.reset.email });
                        done();
                    }
                });
                break;
        }
    }

    // public data
    //

    // public methods
    //

    /**
     * Constructor
     * @returns {acAnonRequester}
     * @throws {Error}
     */
    constructor(){
        const self = this;
        console.log( 'pwix:accounts instanciating acAnonRequester' );

        Interface.add( this, IDisplayRequester, {
        });

        // install an event handler
        //$( document ).on( 'ac-submit', self._submit_handler.bind( self ));

        return this;
    }
}
