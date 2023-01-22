Package.describe({
    name: 'pwi:accounts',
    version: '0.90.1',
    summary: 'A bootstrap-based user interface for Meteor:accounts-password (or Meteor:accounts-ui reinvented)',
    git: '',
    documentation: 'README.md'
});

Package.onUse( function( api ){
    configure( api );
    api.export([
        'pwiAccounts'
    ]);
    api.mainModule( 'src/client/js/index.js', 'client' );
    api.mainModule( 'src/server/js/index.js', 'server' );
});

Package.onTest( function( api ){
    configure( api );
    api.use( 'tinytest' );
    api.use( 'pwi:accounts' );
    api.mainModule( 'test/js/index.js' );
});

function configure( api ){
    api.versionsFrom( '2.9.1' );
    api.use( 'blaze-html-templates', 'client' );
    api.use( 'ecmascript' );
    api.use( 'less', 'client' );
    api.use( 'pwi:bootbox', 'client' );
    api.use( 'pwi:i18n' );
    api.use( 'pwi:layout', 'client' );
    api.use( 'pwi:string-prototype' );
    api.use( 'pwi:tolert', 'client' );
    api.addFiles( 'src/client/components/acMenuItems/acMenuItems.js', 'client' );
    api.addFiles( 'src/client/components/acSelect/acSelect.js', 'client' );
    api.addFiles( 'src/client/components/acUserLogin/acUserLogin.js', 'client' );
}

Npm.depends({
    'bootstrap': '5.2.1',
    'uuid': '9.0.0',
    'zxcvbn': '4.4.2'
});
