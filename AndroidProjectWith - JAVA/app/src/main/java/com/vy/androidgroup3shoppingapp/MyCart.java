package com.vy.androidgroup3shoppingapp;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.util.TypedValue;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class MyCart extends AppCompatActivity {

    private MySqlHelper dbHelper;
    private TextView totalAmountTextView, userNameTextView;
    private LinearLayout cartLayout;
    private Button btnCheckout, btnAddItems;
    private ImageView backIcon;
    private int userId;
    private String userName;
    private double totalAmount = 0.0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_mycart);

        // Initialize UI elements
        dbHelper = new MySqlHelper(this);
        cartLayout = findViewById(R.id.cartLayout);
        totalAmountTextView = findViewById(R.id.totalAmount);
        userNameTextView = findViewById(R.id.userNameText);
        btnCheckout = findViewById(R.id.btnCheckout);
        backIcon = findViewById(R.id.backbtn);
        btnAddItems = findViewById(R.id.btnaddItems);

        // Fetch user details from SharedPreferences
        SharedPreferences sharedPreferences = getSharedPreferences("UserPreferences", MODE_PRIVATE);
        userId = sharedPreferences.getInt("userId", -1);
        userName = sharedPreferences.getString("username", "Guest");
        Log.d("MyCart", "Retrieved userId in mycart page: " + userId);

        // Display username
        userNameTextView.setText(String.format("Welcome, %s!", userName));

        // Load cart items
        loadCartItems(userId);

        // Back button functionality
        backIcon.setOnClickListener(v -> onBackPressed());

        // Navigate to product list page
        btnAddItems.setOnClickListener(v -> {
            startActivity(new Intent(MyCart.this, MainActivity.class));
        });

        // Checkout button functionality
        btnCheckout.setOnClickListener(v -> {
            Intent intent = new Intent(MyCart.this, Payment.class);
            intent.putExtra("totalAmount", totalAmount);
            intent.putExtra("userId", userId);
            startActivity(intent);
        });
    }

    // Load cart items from SQLite database based on userId
    private void loadCartItems(int userId) {
        cartLayout.removeAllViews();
        totalAmount = 0.0;
        Cursor cursor = dbHelper.getCartDetailsForUser(userId);  // Get cart details for user

        if (cursor == null || cursor.getCount() == 0) {
            Toast.makeText(this, "No items in cart", Toast.LENGTH_SHORT).show();
            totalAmountTextView.setText("Total: $0.00");
            return;
        }

        SharedPreferences sharedPreferences = getSharedPreferences("UserPreferences", MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();

        while (cursor.moveToNext()) {
            String productName = cursor.getString(1);
            String rawPrice = cursor.getString(3);
            double price = -1;

            // since price use text datatype in productdetails page, it has to be cleaned ($)
            try {
                if (rawPrice != null && !rawPrice.isEmpty()) {
                    rawPrice = rawPrice.replace("Price:", "").replace("$", "").replace(",", "").trim();
                    price = Double.parseDouble(rawPrice);
                } else {
                    Log.e("MyCart", "Price is null or empty!");
                    continue;
                }
            } catch (NumberFormatException e) {
                Log.e("MyCart", "Invalid price format: " + rawPrice, e);
                continue;
            }


            int imageResId = cursor.getInt(6);

            // Retrieve quantity from SharedPreferences (default is 1)
            int quantity = sharedPreferences.getInt("quantity_product_id_" + productName, 1);
            totalAmount += quantity * price;

            // Create and add item layout to cart
            cartLayout.addView(createCartItemLayout(productName, quantity, price, imageResId, sharedPreferences, editor));
        }

        cursor.close();
        totalAmountTextView.setText(String.format("Total: $%.2f", totalAmount));
    }

    // Creates a cart item layout
    private LinearLayout createCartItemLayout(String productName, int quantity, double price, int imageResId, SharedPreferences sharedPreferences, SharedPreferences.Editor editor) {
        LinearLayout itemLayout = new LinearLayout(this);
        itemLayout.setOrientation(LinearLayout.HORIZONTAL);
        itemLayout.setPadding(10, 10, 10, 10);

        // Product image
        ImageView productImage = new ImageView(this);
        if (imageResId != 0) productImage.setImageResource(imageResId);
        productImage.setLayoutParams(new LinearLayout.LayoutParams(200, 200));
        itemLayout.addView(productImage);

        // Product details
        LinearLayout textLayout = new LinearLayout(this);
        textLayout.setOrientation(LinearLayout.VERTICAL);
        textLayout.setWeightSum(1);

        //uses createTextView method
        textLayout.addView(createTextView(productName, 18, Color.BLACK, true));
        TextView quantityText = createTextView("Quantity: " + quantity, 16, Color.GRAY, false);
        textLayout.addView(quantityText);
        textLayout.addView(createTextView("$" + price, 16, Color.parseColor("#FF5722"), true));
        // Manage quantity buttons (Add/Remove)
        textLayout.addView(createQuantityButtons(productName, quantity, editor, quantityText));


        // Add text layout to item layout
        itemLayout.addView(textLayout);

        // Create a delete button to remove the item (X)
        Button deleteButton = new Button(this);
        deleteButton.setText("X");
        deleteButton.setTextColor(Color.RED);//styles delete button
        deleteButton.setBackgroundColor(Color.TRANSPARENT);
        deleteButton.setLayoutParams(new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        ));

        // Set onClickListener to delete item from cart and refresh, uses deleteProductFromCart method
        deleteButton.setOnClickListener(v -> {
            boolean isDeleted = dbHelper.deleteProductFromCart(productName, userId);
            if (isDeleted) {
                Toast.makeText(this, "Item removed from cart", Toast.LENGTH_SHORT).show();
                editor.remove("quantity_product_id_" + productName).apply();  // Remove quantity from SharedPreferences too
                loadCartItems(userId);  // Refresh cart items
            } else {
                Toast.makeText(this, "Failed to remove item", Toast.LENGTH_SHORT).show();
            }
        });

        // Add the delete button to item layout
        itemLayout.addView(deleteButton);

        return itemLayout;
    }

    // Creates a text view for product details
    private TextView createTextView(String text, int textSize, int color, boolean isBold) {
        TextView textView = new TextView(this);
        textView.setText(text);
        textView.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        textView.setTextColor(color);
        if (isBold) textView.setTypeface(null, android.graphics.Typeface.BOLD);
        return textView;
    }

    // Creates Add/Remove buttons for quantity
    private LinearLayout createQuantityButtons(String productName, int quantity, SharedPreferences.Editor editor, TextView quantityText) {
        LinearLayout buttonLayout = new LinearLayout(this);
        buttonLayout.setOrientation(LinearLayout.HORIZONTAL);

        Button addButton = new Button(this);
        addButton.setText("+");
        addButton.setOnClickListener(v -> {
            int newQuantity = quantity + 1;
            editor.putInt("quantity_product_id_" + productName, newQuantity).apply();
            quantityText.setText("Quantity: " + newQuantity);
            loadCartItems(userId);  // Refresh cart
        });

        Button removeButton = new Button(this);
        removeButton.setText("-");
        removeButton.setOnClickListener(v -> {
            //select maximum from these two variables
            int newQuantity = Math.max(1, quantity - 1);
            editor.putInt("quantity_product_id_" + productName, newQuantity).apply();
            quantityText.setText("Quantity: " + newQuantity);
            loadCartItems(userId);  // Refresh cart
        });

        buttonLayout.addView(removeButton);
        buttonLayout.addView(addButton);
        return buttonLayout;
    }
}
