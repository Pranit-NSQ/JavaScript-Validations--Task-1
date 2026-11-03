// Ribbon button task - 2
function enableInitiateButton(primaryControl)
{
    var occasion =
    primaryControl.getAttribute("pk_ocassion").getValue();

    var shop =
    primaryControl.getAttribute("pk_shops").getValue();

    return (occasion != null && shop != null);
}

function initiateRecord(primaryControl)
{
    var formContext = primaryControl;

    // Update Status
    formContext.getAttribute("pk_managementapproval")
               .setValue(125550000);

    // Current User
    var userName =
        Xrm.Utility.getGlobalContext().userSettings.userName;

    // Build JSON
    var detailsData = [
        {
            "Initiated_By": userName,
            "Initiated_Date": new Date().toISOString()
        },
        {
            "Approved_By": null,
            "Approved_Date": null
        },
        {
            "Rejected_By": null,
            "Rejected_Date": null
        }
    ];

    // Update Details field
    formContext.getAttribute("pk_details")
               .setValue(JSON.stringify(detailsData));

    formContext.data.save();
}


function initializeDetails(executionContext) {

    var formContext = executionContext.getFormContext();

    var details = formContext.getAttribute("pk_details").getValue();

    if (!details) {

        var defaultJson =
        '[{"Initiated_By":null,"Initiated_Date":null},{"Approved_By":null,"Approved_Date":null},{"Rejected_By":null,"Rejected_Date":null}]';

        formContext.getAttribute("pk_details").setValue(defaultJson);
    }
}

// Ribbon button task - 3
function approveRecord(primaryControl) {

    var formContext = primaryControl;

    var confirmStrings = {
        text: "Are you sure you want to approve this record?",
        title: "Approval Confirmation",
        confirmButtonLabel: "Approve",
        cancelButtonLabel: "Cancel"
    };

    var confirmOptions = {
        height: 200,
        width: 450
    };

    Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions)
        .then(function (success) {

            if (success.confirmed) {

                // Update Status
                formContext.getAttribute("pk_managementapproval")
                    .setValue(125550001); // Approved

                // Current User Name
                var currentUserName =
                    Xrm.Utility.getGlobalContext().userSettings.userName;

                // Read Details JSON
                var details =
                    formContext.getAttribute("pk_details").getValue();

                if (details) {

                    var jsonData = JSON.parse(details);

                    // Find Approved section and update it
                    jsonData.forEach(function (item) {

                        if (item.hasOwnProperty("Approved_By")) {

                            item.Approved_By = currentUserName;
                            item.Approved_Date = new Date().toISOString();
                        }

                    });

                    // Write JSON back
                    formContext.getAttribute("pk_details")
                        .setValue(JSON.stringify(jsonData));
                }

                // Save Record
                formContext.data.save().then(
                    function () {
                        formContext.data.refresh(true);
                    }
                );
            }

        });
}


function showApproveButton(primaryControl) {

    // Check Status
    var status = primaryControl
        .getAttribute("pk_managementapproval")
        .getValue();

    // Status must be Initiated
    if (status !== 125550000) {
        return false;
    }

    // Check User Role
    var roles = Xrm.Utility.getGlobalContext().userSettings.roles;

    var isEventApprover = false;

    roles.forEach(function (role) {
        if (role.name === "Event Approver") {
            isEventApprover = true;
        }
    });

    return isEventApprover;
}