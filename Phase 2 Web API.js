// Validation 1: Populate Agent Details on Wow Moment creation
function populateAgentDetails(executionContext) {

    var formContext = executionContext.getFormContext();

    var userId = Xrm.Utility.getGlobalContext().userSettings.userId;
    userId = userId.replace("{", "").replace("}", "");

    Xrm.WebApi.retrieveRecord(
        "systemuser",
        userId,
        "?$select=fullname,internalemailaddress"
    ).then(
        function success(result) {

            formContext.getAttribute("pk_agentname")
                .setValue(result.fullname);

            formContext.getAttribute("pk_agentemail")
                .setValue(result.internalemailaddress);

        },
        function(error) {
            console.log(error.message);
        }
    );
}


// Validation 2: Increase Events counter on Wow Moment creation
function updateEventsCounter(executionContext) {

    var formContext = executionContext.getFormContext();

    // Current Shop Record Id
    var shopId = formContext.data.entity.getId();

    if (!shopId) {
        return;
    }

    shopId = shopId.replace("{", "").replace("}", "");

    // Count Wow Moment records for this shop
    var query =
        "?$select=pk_wowmomentid" +
        "&$filter=_pk_shopid_value eq " + shopId;

    Xrm.WebApi.retrieveMultipleRecords(
        "pk_wowmoment",
        query
    ).then(
        function success(result) {

            var totalEvents = result.entities.length;

            // Update Events Counter
            formContext.getAttribute("pk_eventscounter")
                .setValue(totalEvents);

            // Save Shop Record
            formContext.data.save();

        },
        function (error) {

            console.log(error.message);

        }
    );
}


// Validation 3: Get or Create Contact based on Email
function getOrCreateContact(executionContext) {

    var formContext = executionContext.getFormContext();

    var firstName = formContext.getAttribute("pk_firstname").getValue();
    var lastName = formContext.getAttribute("pk_lastname").getValue();
    var email = formContext.getAttribute("pk_emailaddress").getValue();
    var mobile = formContext.getAttribute("pk_mobilenumber").getValue();

    if (!email) {
        return;
    }

    var query =
        "?$select=contactid,fullname,emailaddress1" +
        "&$filter=emailaddress1 eq '" + email + "'";

    Xrm.WebApi.retrieveMultipleRecords(
        "contact",
        query
    ).then(
        function (result) {

            // Contact Exists
            if (result.entities.length > 0) {

                var contact = result.entities[0];

                var lookupValue = [{
                    id: contact.contactid,
                    name: contact.fullname,
                    entityType: "contact"
                }];

                formContext.getAttribute("pk_contact")
                    .setValue(lookupValue);
            }
            else {

                // Create Contact

                var contactData = {
                    firstname: firstName,
                    lastname: lastName,
                    emailaddress1: email,
                    mobilephone: mobile
                };

                Xrm.WebApi.createRecord(
                    "contact",
                    contactData
                ).then(
                    function (createResult) {

                        Xrm.WebApi.retrieveRecord(
                            "contact",
                            createResult.id,
                            "?$select=fullname"
                        ).then(
                            function(contactResult){

                                var lookupValue = [{
                                    id: createResult.id,
                                    name: contactResult.fullname,
                                    entityType: "contact"
                                }];

                                formContext.getAttribute("pk_contact")
                                    .setValue(lookupValue);

                                formContext.data.save();

                            }
                        );
                    }
                );
            }
        },
        function (error) {
            console.log(error.message);
        }
    );
}


// Validation 4: Update Contact details on Wow Moment update
function updateContact(executionContext) {

    var formContext = executionContext.getFormContext();

    var contactLookup = formContext.getAttribute("pk_contact").getValue();

    if (!contactLookup) {
        return;
    }

    var contactId = contactLookup[0].id.replace(/[{}]/g, "");

    var data = {
        firstname: formContext.getAttribute("pk_firstname").getValue(),
        lastname: formContext.getAttribute("pk_lastname").getValue(),
        emailaddress1: formContext.getAttribute("pk_emailaddress").getValue(),
        mobilephone: formContext.getAttribute("pk_mobilenumber").getValue()
    };

    Xrm.WebApi.updateRecord(
        "contact",
        contactId,
        data
    ).then(
        function success() {
            console.log("Contact Updated");
        },
        function(error) {
            console.log(error.message);
        }
    );
}


function preventDuplicateWowMoment(executionContext) {

    var formContext = executionContext.getFormContext();
    var eventArgs = executionContext.getEventArgs();

    var email = formContext.getAttribute("pk_emailaddress").getValue();

    var occasion = formContext.getAttribute("pk_ocassion").getValue();

    var wowDate = formContext.getAttribute("pk_wowmomentdate").getValue();

    if (!email || !occasion || !wowDate) {
        return;
    }

    var occasionValue = formContext.getAttribute("pk_occasion").getValue();

    var currentRecordId = formContext.data.entity.getId().replace(/[{}]/g, "");

    var formattedDate =
        wowDate.getFullYear() + "-" +
        ("0" + (wowDate.getMonth() + 1)).slice(-2) + "-" +
        ("0" + wowDate.getDate()).slice(-2);

    var query =
        "?$select=pk_wowmomentid" +
        "&$filter=pk_emailaddress eq '" + email + "'" +
        " and _pk_occasion_value eq " + occasionValue +
        " and Microsoft.Dynamics.CRM.On(PropertyName='pk_wowmomentdate',PropertyValue='" + formattedDate + "')";

    Xrm.WebApi.retrieveMultipleRecords(
        "pk_wowmoment",
        query
    ).then(
        function success(result) {

            var duplicateFound = result.entities.some(function(record) {
                return record.pk_wowmomentid !== currentRecordId;
            });

            if (duplicateFound) {

                formContext.ui.setFormNotification(
                    "A Wow Moment record already exists with the same Email, Occasion and Wow Moment Date.",
                    "ERROR",
                    "duplicate"
                );

                eventArgs.preventDefault();
            }
        },
        function(error) {
            console.log(error.message);
        }
    );
}

// Validation 5: Validate Future Events Limit for a Shop
function validateFutureEventsLimit(executionContext) {

    var formContext = executionContext.getFormContext();
    var eventArgs = executionContext.getEventArgs();

    var shop = formContext.getAttribute("pk_shops").getValue();

    if (shop == null) {
        return;
    }

    var shopId = shop[0].id.replace("{", "").replace("}", "");

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var todayFormatted = today.toISOString();

    var query =
        "?$select=pk_wowmomentid" +
        "&$filter=_pk_shop_value eq " + shopId +
        " and pk_wowmomentdate ge " + todayFormatted;

    Xrm.WebApi.retrieveMultipleRecords(
        "pk_wowmoment",
        query
    ).then(
        function success(result) {

            if (result.entities.length >= 20) {

                formContext.ui.setFormNotification(
                    "This shop already has the maximum limit of 20 future events scheduled.",
                    "ERROR",
                    "ShopLimit"
                );

                eventArgs.preventDefault();
            }
            else {
                formContext.ui.clearFormNotification("ShopLimit");
            }
        },
        function (error) {
            console.log(error.message);
        }
    );
}


// Validation 6: Validate Duplicate Email for Active or Approved Wow Moment records
function validateDuplicateEmail(executionContext) {

    var formContext = executionContext.getFormContext();
    var eventArgs = executionContext.getEventArgs();

    var email = formContext.getAttribute("pk_emailaddress").getValue();

    if (!email) {
        return;
    }

    var currentRecordId = formContext.data.entity.getId().replace("{", "").replace("}", "");

    var query =
        "?$select=pk_wowmomentid" +
        "&$filter=pk_emailaddress eq '" + email + "'" +
        " and statecode eq 0";        // Active record= 0, Inactive record= 1

    Xrm.WebApi.retrieveMultipleRecords(
        "pk_wowmoment",
        query
    ).then(
        function success(result) {

            var duplicateFound = false;

            result.entities.forEach(function (record) {

                if (record.pk_wowmomentid !== currentRecordId) {
                    duplicateFound = true;
                }
            });

            if (duplicateFound) {

                formContext.ui.setFormNotification(
                    "An Active or Approved Wow Moment record already exists with this Email Address.",
                    "ERROR",
                    "DuplicateEmail"
                );

                eventArgs.preventDefault();
            }
            else {

                formContext.ui.clearFormNotification(
                    "DuplicateEmail"
                );
            }
        },
        function (error) {
            console.log(error.message);
        }
    );
}