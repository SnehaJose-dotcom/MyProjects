package com.vy.androidgroup3shoppingapp;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class OrderAdapter extends RecyclerView.Adapter<OrderAdapter.OrderViewHolder> {
    private List<Order> orderList;

    public OrderAdapter(  List<Order> orderList){

        this.orderList = orderList;
    }

    @NonNull
    @Override
    public OrderViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // Inflate the order item layout
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.orderrow_layout, parent, false);
        return new OrderViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull OrderViewHolder holder, int position) {
        // Bind the order data to the view holder
        Order order = orderList.get(position);
        holder.orderName.setText(order.getName());
        holder.orderPrice.setText("$" + order.getPrice());
        // Set images based on availability
        holder.orderImage1.setVisibility(View.GONE);
        holder.orderImage2.setVisibility(View.GONE);
        holder.orderImage3.setVisibility(View.GONE);

        List<Integer> images = order.getImageResId();
        if (images.size() > 0) {
            holder.orderImage1.setVisibility(View.VISIBLE);
            holder.orderImage1.setImageResource(images.get(0)); // First image
        }
        if (images.size() > 1) {
            holder.orderImage2.setVisibility(View.VISIBLE);
            holder.orderImage2.setImageResource(images.get(1)); // Second image
        }
        if (images.size() > 2) {
            holder.orderImage3.setVisibility(View.VISIBLE);
            holder.orderImage3.setImageResource(images.get(2)); // Third image
        }    }

    @Override
    public int getItemCount() {
        return orderList.size();
    }

    // Method to update the order list (used for filtering)
    public void updateOrders(List<Order> updatedList) {
        this.orderList = updatedList;
        notifyDataSetChanged(); // Notify the adapter that the data has changed
    }

    // ViewHolder class to hold references to the views in the layout
    static class OrderViewHolder extends RecyclerView.ViewHolder {
         TextView orderName, orderPrice;
        ImageView orderImage1, orderImage2, orderImage3;

        public OrderViewHolder(@NonNull View itemView) {
            super(itemView);
            orderName = itemView.findViewById(R.id.orderName);
            orderPrice = itemView.findViewById(R.id.orderPrice);
            orderImage1 = itemView.findViewById(R.id.orderImage1);
            orderImage2 = itemView.findViewById(R.id.orderImage2);
            orderImage3 = itemView.findViewById(R.id.orderImage3);
        }
    }
}
