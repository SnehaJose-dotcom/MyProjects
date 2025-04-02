package com.vy.androidgroup3shoppingapp;

import android.content.ContentValues;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;
import android.util.Log;
import java.util.regex.Pattern;

import androidx.appcompat.app.AppCompatActivity;

public class Payment extends AppCompatActivity {

    private EditText cardNumber, expiryDate, cvv, nameOnCard;
    private CheckBox saveCardCheckbox;
    private TextView totalAmount;
    private Button btnPayNow;
    private ImageButton apay, ppay, visa, debit;
    private String paymentMethod = "None";
    private MySqlHelper dbHelper;
    private int userId;
    private int orderId = -1;

    private TextView shippingFeeText, taxesText, totalText;


    //Needs to work on Payment Page
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_payment);

        dbHelper = new MySqlHelper(this);

        // Initialize UI components
        cardNumber = findViewById(R.id.cardNumber);
        expiryDate = findViewById(R.id.expiryDate);
        cvv = findViewById(R.id.cvv);
        nameOnCard = findViewById(R.id.nameOnCard);
        saveCardCheckbox = findViewById(R.id.saveCardCheckbox);
        totalAmount = findViewById(R.id.subtotalText);
        shippingFeeText = findViewById(R.id.shippingFeeText);
        taxesText = findViewById(R.id.taxesText);
        totalText = findViewById(R.id.totalIncludingTaxesText);
        btnPayNow = findViewById(R.id.btnPayNow);
        apay = findViewById(R.id.Apay);
        ppay = findViewById(R.id.ppay);
        visa = findViewById(R.id.visa);
        debit = findViewById(R.id.debit);

        Intent intent = getIntent();
        if (intent != null) {
            userId = intent.getIntExtra("userId", -1);
            double totalAmountValue = intent.getDoubleExtra("totalAmount", 0.0);
            Log.d("Payment", "Received totalAmount: " + totalAmountValue + ", userId: " + userId);

            if (userId == -1) {
                Toast.makeText(this, "User ID not found. Please log in again.", Toast.LENGTH_SHORT).show();
                return;
            }

            if (totalAmountValue > 0) {
                String totalAmountText = String.format("$%.2f", totalAmountValue);
                totalAmount.setText(totalAmountText);
            } else {
                Log.d("Payment", "Total amount is 0, loading from cart...");
                loadTotalAmount();
            }
        } else {
            Log.d("Payment", "Intent is null, loading total amount from cart.");
            loadTotalAmount();
        }

        // need to work on this mwthod. Selection of method of payment
       // setupPaymentMethodSelection();

        btnPayNow.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                processPayment();
            }
        });
    }


    // Updated loadTotalAmount() function
    private void loadTotalAmount() {
        Cursor cursor = dbHelper.getCartDetailsForUser(userId);

        if (cursor != null && cursor.getCount() > 0) {
            double subtotal = 0.0;

            while (cursor.moveToNext()) {
                int quantity = cursor.getInt(1);
                double price = cursor.getDouble(2);
                subtotal += quantity * price;
                Log.d("Payment", "Cart Item: Quantity = " + quantity + ", Price = " + price);
            }

            cursor.close();

            double shippingFee = 8.0;
            double taxes = (subtotal < 200) ? 9.0 : 13.0;
            double totalIncludingTaxes = subtotal + shippingFee + taxes;

            // Update TextViews with calculated values
            totalAmount.setText(String.format("Subtotal: $%.2f", subtotal));
            shippingFeeText.setText(String.format("Shipping Fee: $%.2f", shippingFee));
            taxesText.setText(String.format("Taxes: $%.2f", taxes));
            totalText.setText(String.format("Total: $%.2f", totalIncludingTaxes));

        } else {
            Log.d("Payment", "Cart is empty or cursor is null.");
            Toast.makeText(this, "No items in cart", Toast.LENGTH_SHORT).show();
        }
    }


    private void processPayment() {
        String cardNum = cardNumber.getText().toString().trim();
        String expDate = expiryDate.getText().toString().trim();
        String cvvCode = cvv.getText().toString().trim();
        String cardName = nameOnCard.getText().toString().trim();
        boolean saveCard = saveCardCheckbox.isChecked();

        if (cardNum.isEmpty() || expDate.isEmpty() || cvvCode.isEmpty() || cardName.isEmpty()) {
            Toast.makeText(this, "Please fill in all the fields", Toast.LENGTH_SHORT).show();
            return;
        }
        if (!Pattern.matches("\\d{16}", cardNum)) {
            Toast.makeText(this, "Invalid card number", Toast.LENGTH_SHORT).show();
            return;
        }
        if (!Pattern.matches("\\d{2}/\\d{2}", expDate)) {
            Toast.makeText(this, "Invalid expiry date format (MM/YY)", Toast.LENGTH_SHORT).show();
            return;
        }
        if (!Pattern.matches("\\d{3}", cvvCode)) {
            Toast.makeText(this, "Invalid CVV", Toast.LENGTH_SHORT).show();
            return;
        }
        if (paymentMethod.equals("None")) {
            Toast.makeText(this, "Please select a payment method", Toast.LENGTH_SHORT).show();
            return;
        }

        // Updated: Parsing total amount
        String amountText = totalAmount.getText().toString().split("\n")[0].replace("$", "").trim();
        double parsedTotalAmount = Double.parseDouble(amountText);

        ContentValues paymentValues = new ContentValues();
        paymentValues.put("userid", userId);
        paymentValues.put("orderid", orderId);
        paymentValues.put("address", "abc Street Name");
        paymentValues.put("totalamount", parsedTotalAmount);
        paymentValues.put("paymentmethod", paymentMethod);
        paymentValues.put("paymentstatus", "Successful");
        dbHelper.getWritableDatabase().insert("payment", null, paymentValues);

        Toast.makeText(this, "Payment Successful", Toast.LENGTH_LONG).show();

        dbHelper.getWritableDatabase().execSQL("UPDATE ordertable SET orderstatus = 'Completed' WHERE orderid = " + orderId);

        Intent successIntent = new Intent(Payment.this, PaymentSuccessActivity.class);
        successIntent.putExtra("orderId", orderId);
        startActivity(successIntent);
        finish();
    }

    private void saveCardDetails(String cardNum, String expDate, String cvvCode, String cardName) {
        Toast.makeText(this, "Card details saved", Toast.LENGTH_SHORT).show();
    }

    private void clearFields() {
        cardNumber.setText("");
        expiryDate.setText("");
        cvv.setText("");
        nameOnCard.setText("");
        saveCardCheckbox.setChecked(false);
        paymentMethod = "None";
        totalAmount.setText("$0.00");
    }
}
