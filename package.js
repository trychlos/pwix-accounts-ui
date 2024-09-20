Package.describe({
    name: 'pwix:accounts-ui',
    version: '1.8.1-rc',
    summary: 'A Bootstrap-based user interface for Meteor:accounts-password (or Meteor:accounts-ui reinvented)',
    git: 'https://github.com/trychlos/pwix-accounts-ui',
    documentation: 'README.md'
});

Package.onUse( function( api ){
    configure( api );
    api.export([
        'AccountsUI'
    ]);
    api.mainModule( 'src/client/js/index.js', 'client' );
    api.mainModule( 'src/server/js/index.js', 'server' );
});

Package.onTest( function( api ){
    configure( api );
    api.use( 'tinytest' );
    api.use( 'pwix:accounts-ui' );
    api.mainModule( 'test/js/index.js' );
});

function configure( api ){
    api.versionsFrom([ '2.9.0', '3.0-rc.0' ]);
    api.use( 'accounts-password@2.3.3 || 3.0.0-rc300.2' );
    api.use( 'aldeed:simple-schema@1.13.1 || 2.0.0' );
    api.use( 'blaze-html-templates@2.0.0 || 3.0.0-alpha300.0', 'client' );
    api.use( 'ecmascript' );
    api.use( 'less@4.0.0', 'client' );
    api.use( 'pwix:accounts-conf@1.0.0' );
    api.use( 'pwix:accounts-tools@2.0.0' );
    api.use( 'pwix:bootbox@1.5.5' );
    api.use( 'pwix:i18n@1.5.7' );
    api.use( 'pwix:modal@1.10.0 || 2.0.0' );
    api.use( 'pwix:options@2.1.1' );
    api.use( 'pwix:tolert@1.4.2' );
    api.use( 'pwix:ui-layout@2.0.0' );
    api.use( 'random', 'client' );
    api.use( 'tmeasday:check-npm-versions@1.0.2 || 2.0.0-beta.0', 'server' );
    api.addFiles( 'src/client/components/acMandatoryField/acMandatoryField.js', 'client' );
    api.addFiles( 'src/client/components/acMandatoryFooter/acMandatoryFooter.js', 'client' );
    api.addFiles( 'src/client/components/acMenuItems/acMenuItems.js', 'client' );
    api.addFiles( 'src/client/components/acUserLogin/acUserLogin.js', 'client' );
    api.addAssets( 'src/client/svg/asterisk.svg', 'client' );
}

// NPM dependencies are checked in /src/server/js/check_npms.js
// See also https://guide.meteor.com/writing-atmosphere-packages.html#peer-npm-dependencies
