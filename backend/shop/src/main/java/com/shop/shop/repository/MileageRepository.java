package com.shop.shop.repository;

import com.shop.shop.domain.member.Mileage;
import com.shop.shop.dto.MileageDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MileageRepository extends JpaRepository<Mileage, Long> {

    // 회원Id를 기준으로 마일리지 내역 모두 조회
    @Query("SELECT m FROM Mileage m WHERE m.member.id = :memberId")
    public List<MileageDTO> findAllByMemberId(@Param("memberId") Long memberId);

    // 주문Id를 기준으로 마일리지 내역 모두 조회
    @Query("SELECT m FROM Mileage m WHERE m.order.id = :orderId")
    public List<MileageDTO> findAllByOrderId(@Param("orderId") Long orderId);

    // 특정 기간동안의 마일리지내역 조회
    @Query("SELECT m FROM Mileage m WHERE m.mileageDate BETWEEN :mileageDate1 AND :mileageDate2")
    public List<MileageDTO> findByDuringPeriod(@Param("mileageDate1") LocalDateTime mileageDate1, @Param("mileageDate2") LocalDateTime mileageDate2);

    // 특정 회원의 특정 기간동안의 마일리지내역 조회
    @Query("SELECT m FROM Mileage m WHERE m.member.id = :memberId AND m.mileageDate BETWEEN :mileageDate1 AND :mileageDate2")
    public List<MileageDTO> findByDuringPeriodFromMemberId(@Param("memberId") Long memberId, @Param("mileageDate1") LocalDateTime mileageDate1, @Param("mileageDate2") LocalDateTime mileageDate2);

}
