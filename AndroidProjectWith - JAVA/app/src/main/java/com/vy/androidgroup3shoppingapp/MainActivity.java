package com.vy.androidgroup3shoppingapp;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;


public class MainActivity extends AppCompatActivity {

    private RecyclerView productRecyclerView;
    private ProductAdapter productAdapter;
    private MySqlHelper dbHelper;
    private Spinner categorySpinner;
    //search
    private EditText searchBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_mainscreen);

        // navigate to card
        ImageView cartIcon = findViewById(R.id.nav_cart);
        cartIcon.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Navigate to CartActivity when the cart icon is clicked
                Intent intent = new Intent(MainActivity.this, MyCart.class);
                startActivity(intent);
            }
        });

        // navigate to profile
        ImageView profileIcon = findViewById(R.id.nav_profile);
        profileIcon.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Navigate to CartActivity when the cart icon is clicked
                Intent intent = new Intent(MainActivity.this, OrderActivity.class);
                startActivity(intent);
            }
        });

        // navigate to home
        ImageView homeIcon = findViewById(R.id.nav_home);
        homeIcon.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Navigate to CartActivity when the cart icon is clicked
                Intent intent = new Intent(MainActivity.this, MainActivity.class);
                startActivity(intent);
            }
        });

        // Initialize database helper
        dbHelper = new MySqlHelper(this);

        // Insert sample products (if necessary)
        dbHelper.insertSampleProducts();

        // Initialize RecyclerView
        productRecyclerView = findViewById(R.id.productRecyclerView);
        productRecyclerView.setLayoutManager(new LinearLayoutManager(this));

        // Fetch products from the database
        List<Product> productList = dbHelper.getAllProducts();
        productAdapter = new ProductAdapter(this, productList);
        productRecyclerView.setAdapter(productAdapter);

        // Set adapter
        //productAdapter = new ProductAdapter(this, productList);
        //productRecyclerView.setAdapter(productAdapter);

        // Initialize Spinner for category selection
        categorySpinner = findViewById(R.id.spinnerProductType);  // Assume a Spinner is defined in XML


        categorySpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parentView, View selectedItemView, int position, long id) {
                String selectedCategory = parentView.getItemAtPosition(position).toString();
                filterProductsByCategory(selectedCategory);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parentView) {
                // Display all products if no category is selected
                List<Product> allProducts = dbHelper.getAllProducts();
                productAdapter.updateProductList(allProducts);
            }
        });

        //SEARCH
        // Initialize SearchBar
        searchBar = findViewById(R.id.searchBar);
        searchBar.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                filterProductsBySearchQuery(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });

    }

    // Method to update the product list and notify the adapter




    // Method to filter products by selected category
    private void filterProductsByCategory(String category) {
        List<Product> filteredProducts;

        if (category.equals("All")) {
            filteredProducts = dbHelper.getAllProducts();  // Show all products if "All" is selected
        } else {
            filteredProducts = dbHelper.getProductsByCategory(category);  // Fetch products of selected category
        }
        productAdapter.updateProductList(filteredProducts);
        productAdapter.notifyDataSetChanged();  // Notify the adapter to refresh the view
    }

    //search
    private void filterProductsBySearchQuery(String query) {
        List<Product> filteredProducts = dbHelper.getProductsBySearchQuery(query);
        productAdapter.updateProductList(filteredProducts);
        productAdapter.notifyDataSetChanged();  // Notify the adapter to refresh the view
    }

    // Method to handle onClick for productImage
    public void onProductItemClick(View view) {
        // Example handling of a product click, possibly navigating to ProductDetailsActivity
        Intent intent = new Intent(this, ProductDetailsActivity.class);
        // Add product data to intent if needed
        startActivity(intent);
    }



}