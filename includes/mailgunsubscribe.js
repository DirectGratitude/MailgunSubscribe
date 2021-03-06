var ajaxurl = '/wp-admin/admin-ajax.php';

jQuery().ready(function() {
    jQuery('#mailgun_subscribe_btn').click(function(e) {
        e.preventDefault();
        jQuery('#mailgun_subscribe_box').hide();
        jQuery('#mailgun_subscribe_thankyoumnsg').show();
        
        var submittedemail = jQuery('#mailgun_subscribe_email').val();
        var jsonData = {
            action: 'mailgun_subscribesubmit', 
            useremail: submittedemail
        };

        jQuery.ajax({
            'type': 'POST',
            'async': true, 					
            'cache': false,
            'url': ajaxurl,
            'data': jsonData,
            'success': handleSubcribeSubmitSuccess,
            'error': handleSubscribeSubmitError
        });

        return false;
    });
});

function handleGetMailinglistsSuccess(res) {
    jQuery('#mailgun_listloading_msg').hide();
    var obj = JSON.parse(res.result);
    mailgun_populateMailingLists(obj.items)
}
                                                                            
function handleGetMailinglistsError(res) {
    alert("handleGetMailinglistsError");
}

function handleCreateListSuccess(res) {
    var newaddress = jQuery('#mailgun_newmailinglist').val();
    
    var createlisthtml = "<div style='font-weight: bold; margin-bottom: 10px;'>Mailing list added successfully.  Click the address to use it.</div>" +
        "<a href='javascript:void(0)' onclick='mailgun_selectMailingList(this)' >" + newaddress +"</a>";
    
    jQuery('#mailgun_createlist_wrapper').html(createlisthtml);
    jQuery('#mailgun_createlist_wrapper').show();
    jQuery('#mailgun_addinglist_msg').hide();
}

function handleCreateListError() {
    
}
        
function handleSubcribeSubmitSuccess(res) {
    
    var obj = JSON.parse(res);
    if(obj.result == "success") {
        jQuery('#mailgun_subscribe_email').val('');
        jQuery('#mailgun_subscribe_thankyoumnsg').html("Thank You for subscribing to the Mailgun blog.  Please check your email account for the verification email.");
    }
    else if (obj.result == "409") {
        jQuery('#mailgun_subscribe_thankyoumnsg').html("This email address is already subscribed to the Mailgun Blog.   <a href='javascript:void(0);' onclick='showSubscribeForm()'>Try another email address</a>.");
    }
} 

function handleSubscribeSubmitError(res) {
    alert("handleSubscribeSubmitError");
}

function mailgun_populateMailingLists(mailinglists) {
    var mailinglistshtml = '<div style="margin: 10px; font-weight: bold;">Click to select</div>' + 
        '<ul style="margin-left: 10px;">';
    jQuery.each(mailinglists, function (index, list) {
        mailinglistshtml += '<li><a href="javascript:void(0)" onclick="mailgun_selectMailingList(this)">' + list.address + '</a></li>';
    });
    mailinglistshtml += '</ul>';
    jQuery('#mailgun_mailinglist_wrapper').show();
    jQuery('#mailgun_mailinglist_wrapper').html(mailinglistshtml);
}

function mailgun_selectMailingList(thelink) {
    var address = jQuery(thelink).text();
    jQuery('#mailgun_settings_mailinglist').val(address);
    jQuery('#mailgun_mailinglist_dialog').dialog('close');
    jQuery('#mailgun_addlist_dialog').dialog('close');
}

function mailgun_closeDialog(dialogId) {
    jQuery('#' + dialogId).dialog('close');
}

function showSubscribeForm() {
    jQuery('#mailgun_subscribe_box').show();
        jQuery('#mailgun_subscribe_thankyoumnsg').hide();
}