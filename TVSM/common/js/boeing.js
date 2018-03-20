jQuery(document).ready(function($) {
    /////////////////////////////////////////////////////////
    //  XS VIEW SEARCH BAR
    /////////////////////////////////////////////////////////
    // the title text and the input fill the same space. 
    // JQuery is used to hide the input / show input based 
    // on customer toggle of the search icon. 
    $("#xs-title-text").show();
    $("#xs-search-term-input, #xs-search-go-button").hide();
    $("#xs-search-button").on("click", function() {
        $("#xs-search-term-input, #xs-search-go-button, #xs-title-text").toggle();
        // by adding / removing this class, the color of the search icon
        //  can be changed dynamically using background color changes in the css
        $("#xs-search-icon-transparent").toggleClass('search-icon-on');
    });
	
    //// CHECK FOR CAROUSEL CLASS ///////////////////////////////////////////////////////
    // check if carousel class exists 
    if ($(".carousel").length > 0) {
        //alert('carousel: yes!')
		// check if device uses 'touch'. 
		// ref:  http://ctrlq.org/code/19616-detect-touch-screen-javascript */
        function is_touch_device() {
            return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
        }
		// if device uses 'touch' enable swipes 
        if (is_touch_device()) {
            //alert('is_touch_device: yes!')
            $(".carousel").swiperight(function() {
                $(this).carousel('prev');
            });
            $(".carousel").swipeleft(function() {
                $(this).carousel('next');
            });
        }
		
    } else {
        //alert('carousel: no!')
    }
	// MODAL WINDOWS /////////////////////////////////////////////////////////
    $('#window1_button').click(function() {
        $('#myWindow1').modal({
            show: true						
        })
    });
	// ---- //
    $('#window2_button').click(function() {
        $('#myWindow2').modal({
            show: true						
        })
    });
});
// FORM PLACEEHOLDER STYLING /////////////////////////////////////////////////////////
/* POLYFILLS FOR FORM PLACEHOLDER ATTRIBUTE IN IE. */
/* SEE custom.css FOR BROWSER SPECIFIC STYLING */
function add() {
    if ($(this).val() === '') {
        $(this).val($(this).attr('placeholder')).addClass('placeholder');
    }
}
function remove() {
        if ($(this).val() === $(this).attr('placeholder')) {
            $(this).val('').removeClass('placeholder');
        }
    }
    // Create a dummy element for feature detection
if (!('placeholder' in $('<input>')[0])) {
    // Select the elements that have a placeholder attribute
    $('input[placeholder], textarea[placeholder]').blur(add).focus(remove).each(add);
    // Remove the placeholder text before the form is submitted
    $('form').submit(function() {
        $(this).find('input[placeholder], textarea[placeholder]').each(remove);
    });
}
// EMAIL SENT FROM PAGE /////////////////////////////////////////////////////////	
function emailLink(emailName) {
        //this sends an email to emailName (the part before '@boeing.com') and notes the title of the page it was sent from:
        var mySiteTitle = escape(String(document.title));
        var myURL = String(window.location);
        window.location.href = "mailto:" + emailName + "@boeing.com?subject=" + mySiteTitle + "&body=%0d%0dSent from " + mySiteTitle + " at: %0d" + myURL;
    }
    // INSITE LINK USING BEMSID QUERY /////////////////////////////////////////////////////////	
function inSiteContact(mybemsid) {
        window.open("https://insite.web.boeing.com/culture/displayBluesInfo.do?bemsid=" + mybemsid);
    }
    // CURRENT YEAR /////////////////////////////////////////////////////////
function insertCurrYear() {
    // this keeps the copyright in the footer current: 
    var cy = (new Date().getFullYear());
    var yyyy = document.getElementById("yyyy")
    yyyy.innerHTML = cy
}
insertCurrYear();