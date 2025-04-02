package com.vy.androidgroup3shoppingapp;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class PaymentSuccessActivity extends AppCompatActivity {

    private TextView invoiceNumber, paymentDate, paymentMethod, totalAmount, orderIdView;
    private Button btnShareInvoice, btnBackToHome;
    private int orderId;
    private String paymentMethodValue, totalAmountValue;

    //need to work on this page.
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_successpayment);

        // Initialize UI components
        invoiceNumber = findViewById(R.id.invoiceNumber);
        paymentDate = findViewById(R.id.paymentDate);
        paymentMethod = findViewById(R.id.paymentMethod);
        totalAmount = findViewById(R.id.totalAmount);
        orderIdView = findViewById(R.id.orderId);
        btnShareInvoice = findViewById(R.id.btnShareInvoice);
        btnBackToHome = findViewById(R.id.btnBackToHome);

        // Get payment details from intent
        Intent intent = getIntent();
        if (intent != null) {
            orderId = intent.getIntExtra("orderId", -1);
            paymentMethodValue = intent.getStringExtra("paymentMethod");
            totalAmountValue = intent.getStringExtra("totalAmount");

            if (orderId == -1) {
                Toast.makeText(this, "Order ID not found.", Toast.LENGTH_SHORT).show();
                finish();
            }
        }

        // Generate invoice number and current date
        String invoiceNum = "INV-" + System.currentTimeMillis();
        String currentDate = new SimpleDateFormat("dd-MM-yyyy", Locale.getDefault()).format(new Date());

        // Set data to views
        invoiceNumber.setText(invoiceNum);
        paymentDate.setText(currentDate);
        paymentMethod.setText(paymentMethodValue);
        totalAmount.setText(totalAmountValue);
        orderIdView.setText("Order ID: " + orderId);

        // Share invoice button click
        btnShareInvoice.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                shareInvoice(invoiceNum, currentDate, paymentMethodValue, totalAmountValue);
            }
        });

        // Back to Home button click
        btnBackToHome.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent homeIntent = new Intent(PaymentSuccessActivity.this, MainActivity.class);
                homeIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                startActivity(homeIntent);
                finish();
            }
        });
    }

    // Method to share invoice details
    private void shareInvoice(String invoiceNum, String date, String method, String amount) {
        String invoiceDetails = "Invoice Number: " + invoiceNum + "\n"
                + "Date: " + date + "\n"
                + "Payment Method: " + method + "\n"
                + "Total Amount: " + amount + "\n"
                + "Order ID: " + orderId + "\n\nThank you for shopping with us!";

        Intent shareIntent = new Intent(Intent.ACTION_SEND);
        shareIntent.setType("text/plain");
        shareIntent.putExtra(Intent.EXTRA_SUBJECT, "Invoice from Shopping App");
        shareIntent.putExtra(Intent.EXTRA_TEXT, invoiceDetails);
        startActivity(Intent.createChooser(shareIntent, "Share Invoice via"));
    }
}
