All function for Validations from 1-11 are completed and details are provided below:

Phase 1: Validations

1.	The email address should not belong to the domain "@nsquarexperts.com". Display an error message and clear the email address field.
2.	When Occasion is selected, then dynamically filter the Shops lookup field to only show shops that are relevant to the selected Occasion.
3.	If Occasion is cleared, Shops should also be cleared and locked.
4.	Show a ‘Spouse Name’ field and make is mandatory and place it below Mobile Number if the Occasion is ‘Wedding Shoot’.
5.	Prevent users from editing fields such as Title, First Name, Last Name, Email Address, Mobile Number, Wow Moment Date, Occasion, Shops after a record in the Wow Moment table has been Initiated, Approved or Rejected.
6.	The Wow Moment Date should not be earlier than two days from the current date and should not be later than 180 days from the current date. If the selected date falls outside this range, the record should not be saved.
7.	First Name and Last Name must contain at least two characters. Numeric values and special characters should not be allowed. Only alphabetic characters and hyphens are permitted.
8.	The mobile number must start with +91 and contain exactly ten digits after the country code. Spaces, alphabets, and special characters should not be allowed.
9.	If Management Approval is changed to Rejected, Rejection Remarks should become mandatory. The record should not be saved until remarks are entered.
10.	If Customer Rating is 1 Star or 2 Star, Feedback Comments should become mandatory before the feedback record can be saved.
11.	If Follow Up Required is set to Yes, Follow Up Remarks should become visible and mandatory. The feedback record should not be saved until remarks are entered.
