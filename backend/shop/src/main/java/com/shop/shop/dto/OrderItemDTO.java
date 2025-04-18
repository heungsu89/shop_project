package com.shop.shop.dto;

import com.shop.shop.domain.order.Order;
import com.shop.shop.domain.order.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {

    private int orderPrice;
    private int qty;
    private Long itemId;
    private Long itemOptionId;
    private Long orderId;

    public OrderItemDTO(OrderItem orderItem) {
        if (orderItem != null) {
            this.orderPrice = orderItem.getOrderPrice();
            this.qty = orderItem.getQty();
            this.itemId = (orderItem.getItem() != null) ? orderItem.getItem().getId() : null;
            this.itemOptionId = (orderItem.getItemOption() != null) ? orderItem.getItemOption().getId() : null;
            this.orderId = (orderItem.getOrder() != null) ? orderItem.getOrder().getId() : null;
        }
    }
    
}
