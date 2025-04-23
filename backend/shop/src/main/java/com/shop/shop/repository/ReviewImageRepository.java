package com.shop.shop.repository;

import com.shop.shop.domain.list.ReviewImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewImageRepository extends JpaRepository<ReviewImage, Long> {

    @Query("SELECT ri FROM ReviewImage ri WHERE ri.reviewId = :reviewId")
    public List<ReviewImage> findAllByReviewId(@Param("reviewId") Long reviewId);

}
