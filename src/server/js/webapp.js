/*
 * pwix:accounts-ui/src/server/js/webapp.js
 *
 * Meteor #12524 workaround: make sure assets load happen from the canonic url
 */

import url from 'url';

import { WebApp } from 'meteor/webapp';

// returns true if the url has been redirected (so it is no worth to try others redirecters)
const _meteorWorkAround = function( url, res ){
    const usedPath = [
        '/packages/pwix_accounts-ui/'
    ];
    let found = false;
    usedPath.every(( path ) => {
        const indexOf = url.indexOf( path );
        //console.debug( 'url', url, 'path', path, 'index', indexOf );
        if( indexOf > 0 ){
            found = true;
            const newurl = path + url.substring( indexOf+path.length );
            console.debug( 'redirecting', url, 'to', newurl );
            res.writeHead( 301, {
                Location: newurl
            });
            res.end();
        }
        return !found;
    });
    return found;
}

// when route='/doc/res', a path like /images/... is transformed by Meteor in /doc/images...
// this is a known Meteor bug
WebApp.connectHandlers.use( function( req, res, next ){
    //console.debug( req.url );
    if( !_meteorWorkAround( req.url, res )){
        next();
    }
});
