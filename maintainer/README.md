# pwix:accounts-ui

## Constants

ack -l AC_ACT_ | while read f; do sed -i -e 's|AC_ACT_|AccountsUI.C.Button.|g' $f; done
ack -l AC_COLORED_ | while read f; do sed -i -e 's|AC_COLORED_|AccountsUI.C.Colored.|g' $f; done
ack -l AC_LOGGED | while read f; do sed -i -e 's|AC_LOGGED|AccountsUI.C.Connection.LOGGED|g' $f; done
ack -l AC_UNLOGGED | while read f; do sed -i -e 's|AC_UNLOGGED|AccountsUI.C.Connection.UNLOGGED|g' $f; done
ack -l AC_FIELD_ | while read f; do sed -i -e 's|AC_FIELD_|AccountsUI.C.Input.|g' $f; done
ack -l AC_PANEL_ | while read f; do sed -i -e 's|AC_PANEL_|AccountsUI.C.Panel.|g' $f; done
ack -l AC_PWD_ | while read f; do sed -i -e 's|AC_PWD_|AccountsUI.C.Password.|g' $f; done
ack -l AC_RENDER_ | while read f; do sed -i -e 's|AC_RENDER_|AccountsUI.C.Render.|g' $f; done
ack -l AC_VERBOSE_ | while read f; do sed -i -e 's|AC_VERBOSE_|AccountsUI.C.Verbose.|g' $f; done
ack -l AC_WRONGEMAIL_ | while read f; do sed -i -e 's|AC_WRONGEMAIL_|AccountsUI.C.WrongEmail.|g' $f; done

ack -l AC_ACT_ | while read f; do sed -i -e 's|AC_ACT_|AccountsUI.C.Button.|g' $f; done && ack -l AC_COLORED_ | while read f; do sed -i -e 's|AC_COLORED_|AccountsUI.C.Colored.|g' $f; done && ack -l AC_LOGGED | while read f; do sed -i -e 's|AC_LOGGED|AccountsUI.C.Connection.LOGGED|g' $f; done && ack -l AC_UNLOGGED | while read f; do sed -i -e 's|AC_UNLOGGED|AccountsUI.C.Connection.UNLOGGED|g' $f; done && ack -l AC_FIELD_ | while read f; do sed -i -e 's|AC_FIELD_|AccountsUI.C.Input.|g' $f; done && ack -l AC_PANEL_ | while read f; do sed -i -e 's|AC_PANEL_|AccountsUI.C.Panel.|g' $f; done && ack -l AC_PWD_ | while read f; do sed -i -e 's|AC_PWD_|AccountsUI.C.Password.|g' $f; done && ack -l AC_RENDER_ | while read f; do sed -i -e 's|AC_RENDER_|AccountsUI.C.Render.|g' $f; done && ack -l AC_VERBOSE_ | while read f; do sed -i -e 's|AC_VERBOSE_|AccountsUI.C.Verbose.|g' $f; done && ack -l AC_WRONGEMAIL_ | while read f; do sed -i -e 's|AC_WRONGEMAIL_|AccountsUI.C.WrongEmail.|g' $f; done


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
