package com.shop.shop.repository;

import com.shop.shop.domain.cart.Cart;
import com.shop.shop.domain.member.Member;
import com.shop.shop.dto.CartDTO;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    // 회원Id를 기준으로 장바구니 목록 조회
    @EntityGraph(attributePaths = {"item"})
    @Query("SELECT c FROM Cart c WHERE c.member.id = :memberId")
    List<CartDTO> findAllByMemberId(@Param("memberId") Long memberId);

    // 회원Id와 상품Id를 기준으로 장바구니 목록 조회(중복 등록 방지용)
    @EntityGraph(attributePaths = {"item"})
    @Query("SELECT c FROM Cart c WHERE c.member.id = :memberId AND c.item.id = :itemId")
    Cart findByMemberIdAndItemId(@Param("memberId") Long memberId, @Param("itemId") Long itemId);

    List<Cart> findAllById(Long cartId);

}
