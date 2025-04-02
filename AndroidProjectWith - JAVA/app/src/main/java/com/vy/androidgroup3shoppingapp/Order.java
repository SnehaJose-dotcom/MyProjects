package com.vy.androidgroup3shoppingapp;

import java.util.List;

public class Order {
    private String name;
    private String price;
    private String status;
    private List<Integer> imageResId; // For drawable resources images


    public Order(String name, String price, String status, List<Integer> imageResId) {
        this.name = name;
        this.price = price;
        this.status = status;
        this.imageResId = imageResId;
    }

    public String getName() { return name; }
    public String getPrice() {return price; }
    public String getStatus() { return status; }
    public List<Integer> getImageResId() { return imageResId; }
}
