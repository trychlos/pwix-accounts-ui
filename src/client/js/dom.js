/*
 * pwix:accounts-ui/src/client/js/dom.js
 */

import _ from 'lodash';

AccountsUI.DOM = {
    // https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
    //  only initialize jQuery plugins when the DOM element is available
    //  returns a Promise which will resolve when the selector will be DOM-ready
    waitFor( selector ){
        //console.debug( 'waitFor', selector );
        return new Promise(( resolve ) => {
            if( document.querySelector( selector )){
                return resolve( document.querySelector( selector ));
            }
            const observer = new MutationObserver(( mutations ) => {
                if( document.querySelector( selector )){
                    resolve( document.querySelector( selector ));
                    observer.disconnect();
                }
            });
            observer.observe( document.body, {
                childList: true,
                subtree: true
            });
        });
    }
};
