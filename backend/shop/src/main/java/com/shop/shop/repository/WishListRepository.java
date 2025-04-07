package com.shop.shop.repository;

import com.shop.shop.domain.cart.WishList;
import com.shop.shop.domain.item.Item;
import com.shop.shop.dto.WishListDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishListRepository extends JpaRepository<WishList, Long> {

//    @EntityGraph(attributePaths = {"item"})
//    @Query("SELECT wl FROM WishList wl WHERE wl.member.id = :memberId")
//    List<WishList> findAllByMemberId(@Param("memberId") Long memberId);

    @Query("SELECT w FROM WishList w " +
            "JOIN FETCH w.item i " +
            "LEFT JOIN FETCH i.images " +
            "WHERE w.member.id = :memberId")
    List<WishList> findWithItemImagesByMemberId(@Param("memberId") Long memberId);

}
