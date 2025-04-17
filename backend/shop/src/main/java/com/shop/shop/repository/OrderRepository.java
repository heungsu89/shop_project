package com.shop.shop.repository;

import com.shop.shop.domain.order.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // 회원Id를 기준으로 주문 내역 모두 조회
    @Query("SELECT o FROM Order o WHERE o.member.id = :memberId AND o.delFlag = false")
    public List<Order> findAllByMemberId(@Param("memberId") Long memberId);

    // 회원Id를 기준으로 주문 내역 모두 조회(페이징)
    @Query("SELECT o FROM Order o WHERE o.member.id = :memberId AND o.delFlag = false")
    public Page<Order> findAllByMemberId(Pageable pageable, @Param("memberId") Long memberId);

    // 배달Id를 기준으로 주문 내역 조회
    @Query("SELECT o FROM Order o WHERE o.delivery.id = :deliveryId AND o.delFlag = false")
    public Order findByDeliveryId(@Param("deliveryId") Long deliveryId);

    // 특정 기간동안의 주문내역 조회
    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :orderDate1 AND :orderDate2")
    public List<Order> findByDuringPeriod(@Param("orderDate1") LocalDateTime orderDate1, @Param("orderDate2") LocalDateTime orderDate2);

    // 특정 기간동안의 주문내역 조회(페이징)
    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :orderDate1 AND :orderDate2")
    public Page<Order> findByDuringPeriod(Pageable pageable, @Param("orderDate1") LocalDateTime orderDate1, @Param("orderDate2") LocalDateTime orderDate2);

    // 특정 회원의 특정 기간동안의 주문 내역 조회
    @Query("SELECT o FROM Order o WHERE o.member.id = :memberId AND o.orderDate BETWEEN :orderDate1 AND :orderDate2")
    public List<Order> findByDuringPeriodFromMemberId(@Param("memberId") Long memberId, @Param("orderDate1") LocalDateTime orderDate1, @Param("orderDate2") LocalDateTime orderDate2);

    // 특정 회원의 특정 기간동안의 주문 내역 조회(페이징)
    @Query("SELECT o FROM Order o WHERE o.member.id = :memberId AND o.orderDate BETWEEN :orderDate1 AND :orderDate2")
    public Page<Order> findByDuringPeriodFromMemberId(Pageable pageable, @Param("memberId") Long memberId, @Param("orderDate1") LocalDateTime orderDate1, @Param("orderDate2") LocalDateTime orderDate2);

}
