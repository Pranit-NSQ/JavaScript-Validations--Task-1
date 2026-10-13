function validateEmailDomain(executionContext) {
    var formContext = executionContext.getFormContext();

    alert("Function Triggered");

    console.log(executionContext);

    if (executionContext == null) {
        alert("Execution Context Not Passed");
        return;
    }

    alert("Execution Context Passed");

    var email = formContext.getAttribute("pk_EmailAddress").getValue();

    if (email != null) {

        email = email.toLowerCase().trim();

        if (email.endsWith("@nsquarexperts.com")) {

            formContext.ui.setFormNotification(
                "Email address from @nsquarexperts.com domain is not allowed.",
                "ERROR",
                "EmailDomainError"
            );

            formContext.getAttribute("pk_EmailAddress").setValue(null);

        }
        else {
            formContext.ui.clearFormNotification("EmailDomainError");
        }
    }
}