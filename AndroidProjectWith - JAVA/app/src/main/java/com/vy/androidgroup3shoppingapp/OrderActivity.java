package com.vy.androidgroup3shoppingapp;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

//import com.juztoyin.shopping_app.Order;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class OrderActivity extends AppCompatActivity {

    private RecyclerView orderRecyclerView;
    private OrderAdapter adapter;
    private List<Order> orderList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.item_order);

        // Initialize views
        orderRecyclerView = findViewById(R.id.recyclerView);
        orderRecyclerView.setLayoutManager(new LinearLayoutManager(this));

        //Static order data
        orderList = new ArrayList<>();
        orderList.add(new Order("Order 1","$40.00", "shipped", Arrays.asList(R.drawable.image1, R.drawable.image7)));
        orderList.add(new Order("Order 2", "$40.00","delivered", Arrays.asList(R.drawable.image4, R.drawable.image6)));
        orderList.add(new Order("Order 3", "$40.00","returns", Arrays.asList(R.drawable.image2, R.drawable.image5)));
        orderList.add(new Order("Order 4", "$40.00","shipped", Arrays.asList(R.drawable.image9,R.drawable.image3)));
        orderList.add(new Order("Order 5", "$40.00","shipped", Arrays.asList(R.drawable.image3, R.drawable.image1)));
        orderList.add(new Order("Order 6", "$40.00","delivered", Arrays.asList(R.drawable.image5, R.drawable.image2)));
        orderList.add(new Order("Order 7", "$40.00","returns", Arrays.asList(R.drawable.image6,R.drawable.image3)));
        orderList.add(new Order("Order 8", "$40.00","shipped", Arrays.asList(R.drawable.image7, R.drawable.image8)));

        //set up adapter
        adapter = new OrderAdapter(orderList);
        orderRecyclerView.setAdapter(adapter);

        //set up navigation buttons
        setupNavigationButtons();
    }

    // Set up button listeners
    private void setupNavigationButtons() {
        ImageButton homeButton = findViewById(R.id.btn_home);
        ImageButton cartButton = findViewById(R.id.btn_cart);
        ImageButton profileButton = findViewById(R.id.btn_profile);
        ImageButton logoButton = findViewById(R.id.btn_logo);
        Button allButton = findViewById(R.id.btn_all);
        Button deliveredButton = findViewById(R.id.btn_delivered);
        Button shippedButton = findViewById(R.id.btn_shipped);
        Button returnButton = findViewById(R.id.btn_return);

        // Navigate to Home
        homeButton.setOnClickListener(view -> {
            Toast.makeText(this, "Home clicked", Toast.LENGTH_SHORT).show();
            // Start HomeActivity
                Intent intent = new Intent(OrderActivity.this, ProfileActivity.class);
                startActivity(intent);
        });

        // Navigate to Cart
        cartButton.setOnClickListener(view -> {
            Toast.makeText(this, "Cart clicked", Toast.LENGTH_SHORT).show();
            // Start CartActivity
            Intent intent = new Intent(OrderActivity.this, EditActivity.class); //replace with cart class when available
            startActivity(intent);
        });

        // Navigate to Profile
        profileButton.setOnClickListener(view -> {
            Toast.makeText(this, "Profile clicked", Toast.LENGTH_SHORT).show();
            // Start ProfileActivity
            Intent intent = new Intent(OrderActivity.this, ProfileActivity.class);
            startActivity(intent);
        });

        logoButton.setOnClickListener(view -> {
            Toast.makeText(this, "Logo clicked", Toast.LENGTH_SHORT).show();
            // Start HomeActivity
            Intent intent = new Intent(OrderActivity.this, ProfileActivity.class);
            startActivity(intent);
        });

        //Getting all orders
        allButton.setOnClickListener(view -> {

            adapter.updateOrders(orderList);
        });

        // Filter Delivered Orders
        deliveredButton.setOnClickListener(view -> {
            List<Order> deliveredOrders = new ArrayList<>();
            for (Order order : orderList) {
                if (order.getStatus().equals("delivered")) {
                    deliveredOrders.add(order);
                }
            }
            adapter.updateOrders(deliveredOrders);
        });

        // Filter Shipped Orders
        shippedButton.setOnClickListener(view -> {
            List<Order> shippedOrders = new ArrayList<>();
            for (Order order : orderList) {
                if (order.getStatus().equals("shipped")) {
                    shippedOrders.add(order);
                }
            }
            adapter.updateOrders(shippedOrders);
        });

        // Filter Returned Orders
        returnButton.setOnClickListener(view -> {
            List<Order> returnOrders = new ArrayList<>();
            for (Order order : orderList) {
                if (order.getStatus().equals("returns")) {
                    returnOrders.add(order);
                }
            }
            adapter.updateOrders(returnOrders);
        });
    }
}
//return button not working properly.
//you need to input all button also
//work on the recyler layout.
//check your shipped and returns clikcks. You misspelled. DONE