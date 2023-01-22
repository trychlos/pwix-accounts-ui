/*
 * pwi:accounts/src/client/js/features.js
 * 
 *  HTML attributs
 * 
 * - aclass: the class to add to the <a> element to qualify it
 * - faicon: the icon to be displayed besides of the item
 * - labelkey: the key of the label in pwiAccounts.strings[]['features']
 * - enablefn: a function which returns a boolean to enable an item
 *
 * Properties
 * 
 * - panel: the panel to be displayed at item activation
 *          the function pwiAccounts.panel.asked() may be called with this argument
 * 
 * - msgaction: the message to be triggered for simulating the item activation
 *          under the hood, the message handler just calls pwiAccounts.panel.asked() with the corresponding argument
 */

function enableAlways(){
    return true;
}
function enableMailVerified(){
    return !pwiAccounts.user.mailVerified()
}
