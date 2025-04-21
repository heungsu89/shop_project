package com.shop.shop.domain.order;

import com.shop.shop.domain.delivery.Delivery;
import com.shop.shop.domain.item.ItemImage;
import com.shop.shop.domain.item.ItemOption;
import com.shop.shop.domain.member.Member;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Orders")
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private LocalDateTime orderDate;
    private int totalAmount;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    private boolean delFlag;

    @Column(nullable = false)
    private String payerName;
    @Column(nullable = false)
    private String payerNumber;

    @Lob
    private String orderRequest;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "delivery_id")
    private Delivery delivery;

    @Column(nullable = false)
    private String recipientName;
    @Column(nullable = false)
    private String recipientNumber;

    @Column(nullable = false)
    private String recipient_zip_code;
    @Column(nullable = false)
    private String recipient_default_address;
    @Column(nullable = false)
    private String recipient_detailed_address;

//    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
//    @JoinColumn(name = "order_item_id")
//    @Builder.Default
//    private List<OrderItem> orderItems = new ArrayList<>();

    public void changeRecipient_zip_code(String recipient_zip_code) {
        this.recipient_zip_code = recipient_zip_code;
    }

    public void changeRecipient_default_address(String recipient_default_address) {
        this.recipient_default_address = recipient_default_address;
    }

    public void changeRecipient_detailed_address(String recipient_detailed_address) {
        this.recipient_detailed_address = recipient_detailed_address;
    }

    public void changeTotalAmount(int totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void changeOrderStatus(OrderStatus orderStatus) {
        this.orderStatus = orderStatus;
    }

    public void changeDelFlag(boolean delFlag) {
        this.delFlag = delFlag;
    }

//    // 옵션 추가
//    public void addOrderItem(OrderItem orderItem) {
//        this.orderItems.add(orderItem);
//    }

}
