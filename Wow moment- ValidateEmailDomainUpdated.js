// Validation 1 - Email Domain
function validateEmailDomain(executionContext) {
    var formContext = executionContext.getFormContext();

    alert("Function Triggered");

    console.log(executionContext);

    if (executionContext == null) {
        alert("Execution Context Not Passed");
        return;
    }

    alert("Execution Context Passed");

    var email = formContext.getAttribute("pk_emailaddress").getValue();

    if (email != null) {

        email = email.toLowerCase().trim();

        if (email.endsWith("@nsquarexperts.com")) {

            formContext.ui.setFormNotification(
                "Email address from @nsquarexperts.com domain is not allowed.",
                "ERROR",
                "EmailDomainError"
            );

            formContext.getAttribute("pk_emailaddress").setValue(null);

        }
        else {
            formContext.ui.clearFormNotification("EmailDomainError");
        }
    }
}


// Validation 2 - Shopfilter
function registerShopFilter(executionContext)
{
    var formContext = executionContext.getFormContext();
 
    var shopControl = formContext.getControl("pk_shops");
 
    shopControl.addPreSearch(function ()
    {
        applyShopFilter(formContext);
    });
}
 
function applyShopFilter(formContext)
{
    var occasion =
        formContext.getAttribute("pk_ocassion")
                   .getValue();
 
    if (!occasion)
    {
        return;
    }
 
    var filterXml =
        "<filter type='and'>" +
            "<condition attribute='pk_eventsorganizedhere'" +
            " operator='eq'" +
            " value='" + occasion + "' />" +
        "</filter>";
 
    formContext
        .getControl("pk_shops")
        .addCustomFilter(filterXml);
}

// Validation 3 - Occasion is Cleared
function manageShopLookup(executionContext) {
    var formContext = executionContext.getFormContext();

    var occasion = formContext.getAttribute("pk_ocassion").getValue();
    var shopAttribute = formContext.getAttribute("pk_shops");
    var shopControl = formContext.getControl("pk_shops");

    if (occasion == null) {
        // Clear Shops lookup
        shopAttribute.setValue(null);

        // Disable Shops lookup
        shopControl.setDisabled(true);
    }
    else {
        // Enable Shops lookup
        shopControl.setDisabled(false);
    }
}

function toggleSpouseName(executionContext) {
    var formContext = executionContext.getFormContext();

    // Occasion field
    var occasion = formContext.getAttribute("pk_ocassion").getValue();

    // Spouse Name control and attribute
    var spouseControl = formContext.getControl("pk_spousename");
    var spouseAttribute = formContext.getAttribute("pk_spousename");

    if (occasion === "Wedding Shoot") {

        // Show field
        spouseControl.setVisible(true);

        // Make mandatory
        spouseAttribute.setRequiredLevel("required");

    } else {

        // Clear value
        spouseAttribute.setValue(null);

        // Hide field
        spouseControl.setVisible(false);

        // Remove mandatory
        spouseAttribute.setRequiredLevel("none");
    }
}

// Validation 4 - Spouse Name Visibility
function toggleSpouseName(executionContext) {
    var formContext = executionContext.getFormContext();

    var occasion = formContext.getAttribute("pk_ocassion").getText();

    if (occasion === "Wedding Shoot") {
        formContext.getControl("pk_spousename").setVisible(true);
        formContext.getAttribute("pk_spousename").setRequiredLevel("required");
    }
    else {
        formContext.getControl("pk_spousename").setVisible(false);
        formContext.getAttribute("pk_spousename").setRequiredLevel("none");
        formContext.getAttribute("pk_spousename").setValue(null);
    }
}


// Validation 5 - Lock Fields Based on Status
function lockFieldsBasedOnStatus(executionContext) {
    var formContext = executionContext.getFormContext();

    // Get Status value
    var status = formContext.getAttribute("pk_managementapproval").getText();

    // Fields to lock
    var fieldsToLock = [
        "pk_title",
        "pk_firstname",
        "pk_lastname",
        "pk_emailaddress",
        "pk_mobilenumber",
        "pk_wowmomentdate",
        "pk_ocassion",
        "pk_shops"
    ];

    // Check Status
    if (
        status === "Initiated" ||
        status === "Approved" ||
        status === "Rejected"
    ) {

        fieldsToLock.forEach(function (field) {
            var control = formContext.getControl(field);

            if (control) {
                control.setDisabled(true);
            }
        });
    }
    else {

        fieldsToLock.forEach(function (field) {
            var control = formContext.getControl(field);

            if (control) {
                control.setDisabled(false);
            }
        });
    }
}

// Validation 6 - Wow Moment Date
function validateWowMomentDate(executionContext) {

    var formContext = executionContext.getFormContext();
    var eventArgs = executionContext.getEventArgs();

    var wowDate = formContext.getAttribute("pk_wowmomentdate").getValue();

    if (wowDate == null) {
        return;
    }

    var today = new Date();

    // Remove time portion
    today.setHours(0, 0, 0, 0);

    var minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 2);

    var maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 180);

    wowDate.setHours(0, 0, 0, 0);

    if (wowDate < minDate || wowDate > maxDate) {

        formContext.ui.setFormNotification(
            "WoW Moment Date must be between 2 and 180 days from today.",
            "ERROR",
            "DateValidation"
        );

        eventArgs.preventDefault();
    }
    else {

        formContext.ui.clearFormNotification("DateValidation");
    }
}


// Validation 7 - Name Fields
function validateNameFields(executionContext) {

    var formContext = executionContext.getFormContext();

    var firstName = formContext.getAttribute("pk_firstname");
    var lastName = formContext.getAttribute("pk_lastname");

    var namePattern = /^[A-Za-z-]+$/;

    // First Name Validation
    if (firstName.getValue() != null) {

        var firstNameValue = firstName.getValue().trim();

        if (firstNameValue.length < 2 || !namePattern.test(firstNameValue)) {

            firstName.setValue(null);

            formContext.ui.setFormNotification(
                "First Name must contain at least 2 alphabetic characters. Only letters and hyphens are allowed.",
                "ERROR",
                "FirstNameValidation"
            );
        }
        else {
            formContext.ui.clearFormNotification("FirstNameValidation");
        }
    }

    // Validation 7 - First name & Last Name Validation
    if (lastName.getValue() != null) {

        var lastNameValue = lastName.getValue().trim();

        if (lastNameValue.length < 2 || !namePattern.test(lastNameValue)) {

            lastName.setValue(null);

            formContext.ui.setFormNotification(
                "Last Name must contain at least 2 alphabetic characters. Only letters and hyphens are allowed.",
                "ERROR",
                "LastNameValidation"
            );
        }
        else {
            formContext.ui.clearFormNotification("LastNameValidation");
        }
    }
}

// Validation 8 - Mobile Number
function validateMobileNumber(executionContext) {

    var formContext = executionContext.getFormContext();

    var mobileAttr = formContext.getAttribute("pk_mobilenumber");

    if (mobileAttr == null || mobileAttr.getValue() == null) {
        return;
    }

    var mobile = mobileAttr.getValue().trim();

    // Must start with +91 and have exactly 10 digits after it
    var mobilePattern = /^\+91\d{10}$/;

    if (!mobilePattern.test(mobile)) {

        formContext.getControl("pk_mobilenumber").setNotification(
            "Mobile Number must start with +91 and contain exactly 10 digits."
        );
    }
    else {

        formContext.getControl("pk_mobilenumber").clearNotification();
    }
}


// Validation 9 - Rejection Remarks(Part - 1)
function manageRejectionRemarks(executionContext) {

    var formContext = executionContext.getFormContext();

    var approval = formContext.getAttribute("pk_managementapproval").getText();

    if (approval === "Rejected") {

        formContext.getAttribute("pk_rejectionremarks")
            .setRequiredLevel("required");

        formContext.getControl("pk_rejectionremarks")
            .setVisible(true);
    }
    else {

        formContext.getAttribute("pk_rejectionremarks")
            .setRequiredLevel("none");
    }
}


// Validation 9 - Rejection Remarks(Part - 2)
function validateRejectionRemarks(executionContext) {

    var formContext = executionContext.getFormContext();
    var eventArgs = executionContext.getEventArgs();

    var approval = formContext.getAttribute("pk_managementapproval").getText();

    var remarks = formContext
        .getAttribute("pk_rejectionremarks")
        .getValue();

    if (
        approval === "Rejected" &&
        (!remarks || remarks.trim() === "")
    ) {

        formContext.ui.setFormNotification(
            "Rejection Remarks are mandatory when Management Approval is Rejected.",
            "ERROR",
            "RemarksValidation"
        );

        eventArgs.preventDefault();
    }
    else {

        formContext.ui.clearFormNotification("RemarksValidation");
    }
}


// Validation 10 - Feedback Comments(Event Feedback table)
function setCommentsMandatory(executionContext) {
    var formContext = executionContext.getFormContext();

    var rating = formContext.getAttribute("pk_customerrating").getValue();

    // Replace 1 and 2 with your actual option set values
    if (rating === 1 || rating === 2) {
        formContext.getAttribute("pk_feedbackcomments").setRequiredLevel("required");
    }
    else {
        formContext.getAttribute("pk_feedbackcomments").setRequiredLevel("none");
    }
}


function validateFeedbackComments(executionContext) {
    var formContext = executionContext.getFormContext();
    var eventArgs = executionContext.getEventArgs();

    var rating = formContext.getAttribute("pk_customerrating").getValue();
    var comments = formContext.getAttribute("pk_feedbackcomments").getValue();

    // Replace 100000000 and 100000001 with your actual option values
    // Save these values in variables for better readability
    var oneStarRating = 125550000; // Replace with actual value for 1 Star
    var twoStarRating = 125550001; // Replace with actual value for 2 Star
    if ((rating === oneStarRating || rating === twoStarRating) &&
        (!comments || comments.trim() === "")) {

        formContext.getAttribute("pk_feedbackcomments").setRequiredLevel("required");

        formContext.ui.setFormNotification(
            "Feedback Comments are mandatory when Customer Rating is 1 Star or 2 Star.",
            "ERROR",
            "RatingValidation"
        );

        eventArgs.preventDefault();
    }
    else {
        formContext.getAttribute("pk_feedbackcomments").setRequiredLevel("none");
        formContext.ui.clearFormNotification("RatingValidation");
    }
}

// Validation 11 - Follow Up Remarks(Event Feedback table)
function validateFollowUpRemarks(executionContext) {
    var formContext = executionContext.getFormContext();
    var eventArgs = executionContext.getEventArgs();

    var followUpRequired = formContext.getAttribute("pk_followuprequired").getValue();
    var remarks = formContext.getAttribute("pk_followupremarks").getValue();

    // Follow Up Required = Yes
    if (followUpRequired === true) {

        // Show field
        formContext.getControl("pk_followupremarks").setVisible(true);

        // Make field mandatory
        formContext.getAttribute("pk_followupremarks").setRequiredLevel("required");

        // Prevent save if remarks are empty
        if (remarks === null || remarks.trim() === "") {

            formContext.ui.setFormNotification(
                "Please enter Follow Up Remarks before saving.",
                "ERROR",
                "followup_validation"
            );

            eventArgs.preventDefault();
        }
        else {
            formContext.ui.clearFormNotification("followup_validation");
        }
    }
    else {

        // Hide field
        formContext.getControl("pk_followupremarks").setVisible(false);

        // Remove mandatory
        formContext.getAttribute("pk_followupremarks").setRequiredLevel("none");

        // Clear existing notification
        formContext.ui.clearFormNotification("followup_validation");
    }
}


function toggleFollowUpRemarks(executionContext) {

    var formContext = executionContext.getFormContext();

    var followUpRequired = formContext.getAttribute("pk_followuprequired").getValue();

    if (followUpRequired === true) {

        formContext.getControl("pk_followupremarks").setVisible(true);
        formContext.getAttribute("pk_followupremarks").setRequiredLevel("required");

    } else {

        formContext.getControl("pk_followupremarks").setVisible(false);
        formContext.getAttribute("pk_followupremarks").setRequiredLevel("none");
        formContext.getAttribute("pk_followupremarks").setValue(null);

    }
}