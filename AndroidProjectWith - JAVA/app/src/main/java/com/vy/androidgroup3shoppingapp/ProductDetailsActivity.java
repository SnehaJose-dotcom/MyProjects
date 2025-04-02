package com.vy.androidgroup3shoppingapp;

import android.content.Intent;
import android.content.SharedPreferences;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;

public class ProductDetailsActivity extends AppCompatActivity {
    private ImageView backIcon;
    private int userId; // Logged-in user ID
    private MySqlHelper dbHelper;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_productdetail);

        dbHelper = new MySqlHelper(this);

        // Initialize the back icon
        backIcon = findViewById(R.id.imageBackIcon);

        // Set up the click listener for the back icon
        backIcon.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Go back to the previous activity (MainActivity or whatever the parent activity is)
                onBackPressed();  // This is the standard method to go back to the previous activity
            }
        });

        // Fetch userId from SharedPreferences
        SharedPreferences sharedPreferences = getSharedPreferences("UserPreferences", MODE_PRIVATE);
        userId = sharedPreferences.getInt("userId", -1);


        // Get references to the UI elements
        ImageView productImage = findViewById(R.id.imageProductItem);
        TextView productName = findViewById(R.id.twProductName);
        TextView productDescription = findViewById(R.id.tvProductDescription);
        TextView productPrice = findViewById(R.id.tvProductPrice);
        TextView productSize = findViewById(R.id.tvProductSize);
        TextView productBrand = findViewById(R.id.tvProductBrand);
        Button addToCartButton = findViewById(R.id.buttonAddToCart);
        EditText etQuantity = findViewById(R.id.etQuantity);

        // Get data from the Intent
        Intent intent = getIntent();
        String name = intent.getStringExtra("name");
        String description = intent.getStringExtra("description");
        String price = intent.getStringExtra("price");
        int imageResId = intent.getIntExtra("imageResId", R.drawable.image1);
        String size = intent.getStringExtra("size"); // Get size
        String brand = intent.getStringExtra("brand"); // Get brand

        Log.d("ProductDetailsActivity", "Size: " + size + ", Brand: " + brand);
        Log.d("ProductDetailsActivity", "Received data: Name=" + name + ", Description=" + description);
        // Populate the UI with the product details
        productName.setText(name);
        productDescription.setText(description);
        productPrice.setText(price);
        Glide.with(this).load(imageResId).into(productImage);
        productSize.setText(size);
        productBrand.setText(brand);


        // Add to Cart button ,
        addToCartButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (userId != -1) {
                    String quantityStr = etQuantity.getText().toString();
                    int quantity = 1;  // Default quantity is 1
                    if (!quantityStr.isEmpty()) {
                        quantity = Integer.parseInt(quantityStr);
                    }

                    //check if the product is already in the MyCart page
                    if (dbHelper.isProductInCart(productName.getText().toString(), userId)) {
                        Toast.makeText(ProductDetailsActivity.this, "Product already exist in your cart", Toast.LENGTH_SHORT).show();

                        Intent cartIntent = new Intent(ProductDetailsActivity.this, MyCart.class);
                        startActivity(cartIntent);
                    } else {

                        // Insert product details into the Cart table (Created new table named "Cart" in MySqlHelper)
                        boolean isInserted = dbHelper.addToCart(userId, name, description, price, size, brand, imageResId);
                        if (isInserted) {
                            // Save product quantity in SharedPreferences
                            SharedPreferences sharedPreferences = getSharedPreferences("UserPreferences", MODE_PRIVATE);
                            SharedPreferences.Editor editor = sharedPreferences.edit();
                            editor.putInt("quantity_product_id_" + name, quantity);
                            editor.apply();

                            Toast.makeText(ProductDetailsActivity.this, "Added to cart!", Toast.LENGTH_SHORT).show();

                            // Navigate to MyCart Activity
                            Intent cartIntent = new Intent(ProductDetailsActivity.this, MyCart.class);
                            cartIntent.putExtra("productName", productName.getText().toString());
                            startActivity(cartIntent);
                        } else {
                            Toast.makeText(ProductDetailsActivity.this, "Failed to add to cart. Please try again.", Toast.LENGTH_SHORT).show();
                        }
                    }
                } else {
                    Toast.makeText(ProductDetailsActivity.this, "Please log in to add items to cart.", Toast.LENGTH_SHORT).show();
                }
            }
        });

    }
}