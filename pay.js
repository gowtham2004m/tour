
document.addEventListener("DOMContentLoaded", function() {
    const paymentForm = document.getElementById("payment-form");
    const payButton = document.getElementById("pay-button");

    payButton.addEventListener("click", function() {
        // Validate the form
        if (validateForm()) {
            // Simulate payment processing (replace with your actual payment processing logic)
            setTimeout(function() {
                // Show a success popup message
                alert("Payment successful!");
                // You can also redirect to a success page or perform other actions here
                // Example: window.location.href = "success.html";
            }, 1000); // Simulate a 1-second payment processing delay
        }
    });

    function validateForm() {
        const cardNumber = document.getElementById("card-number").value;
        const cardExpiry = document.getElementById("card-expiry").value;
        const cardCVC = document.getElementById("card-cvc").value;
        const amount = document.getElementById("amount").value;

        if (cardNumber === "" || cardExpiry === "" || cardCVC === "" || amount === "") {
            alert("Please fill in all fields.");
            return false;
        }

        // You can add more validation here as needed

        return true;
    }
});
