package com.shop.shop.repository;

import com.shop.shop.domain.order.OrderItem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.id = :orderId ORDER BY oi.id DESC")
    List<OrderItem> findByOrderId(@Param("orderId") Long orderId);

    @EntityGraph(attributePaths = {"item", "itemOption"})
    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.id = :orderId ORDER BY oi.id DESC")
    List<OrderItem> findDetailedByOrderId(@Param("orderId") Long orderId);

}
