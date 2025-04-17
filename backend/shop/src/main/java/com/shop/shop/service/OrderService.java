package com.shop.shop.service;

import com.shop.shop.domain.order.Order;
import com.shop.shop.dto.OrderDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderService {

    public List<OrderDTO> findAllByMemberId(Long memberId);
    public Page<OrderDTO> findAllByMemberId(Pageable pageable, Long memberId);
    public OrderDTO findByDeliveryId(Long deliveryId);
    public OrderDTO createOrder(OrderDTO orderDTO);
    public List<OrderDTO> findByDuringPeriod(LocalDateTime orderDate1, LocalDateTime orderDate2);
    public Page<OrderDTO> findByDuringPeriod(Pageable pageable, LocalDateTime orderDate1, LocalDateTime orderDate2);
    public List<OrderDTO> findByDuringPeriodFromMemberId(Long memberId, LocalDateTime orderDate1, LocalDateTime orderDate2);
    public Page<OrderDTO> findByDuringPeriodFromMemberId(Pageable pageable, Long memberId, LocalDateTime orderDate1, LocalDateTime orderDate2);
    public OrderDTO editOrder(OrderDTO orderDTO);
    public OrderDTO editOrderStatus(OrderDTO orderDTO);
    public void deleteOrder(Long orderId);

}
