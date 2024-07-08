# pwix:accounts-ui

## onEmailverificationLink

// Rationale: starting with AccountsUI v 1.4.0, we try to give application and other packages
//  a way to have a stack of onEmailVerificationLink() functions while the standard meteor/accounts-base package
//  only offers a single function
// So we do here:
//  - check that the used linked is known and still valid (not expired)
//  - call each function of the stack, providing the token, the user document, the validated email
//      each function can return false to stop and abort the process
//      note that at the time, the email is not yet flagged validated in the database
//  - at the end, and unless prematurement stopped, let the accounts-base terminate, flagging the email as validated and logging in the user
