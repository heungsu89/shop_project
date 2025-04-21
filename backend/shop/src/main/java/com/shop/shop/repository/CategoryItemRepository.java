package com.shop.shop.repository;

import com.shop.shop.domain.category.Category;
import com.shop.shop.domain.category.CategoryItem;
import com.shop.shop.domain.item.Item;
import com.shop.shop.dto.CategoryDTO;
import com.shop.shop.dto.CategoryItemDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryItemRepository extends JpaRepository<CategoryItem, Long> {

//    @EntityGraph(attributePaths = {"item"})
//    @Query("SELECT ci FROM CategoryItem ci WHERE ci.category.id = :categoryId") // 삭제 된거 제외
//    CategoryDTO getItemsFromCategory(@Param("categoryId") Long categoryId);

    // categoryId 에 속한 모든 데이터 가져오기
    @EntityGraph(attributePaths = {"item"})
    @Query("SELECT ci FROM CategoryItem ci ORDER BY ci.id DESC")
    Page<CategoryItem> findAllWithItem(Pageable pageable);

    // categoryId 에 속한 모든 데이터 가져오기
    @EntityGraph(attributePaths = {"item"})
    @Query("SELECT ci FROM CategoryItem ci WHERE ci.category.id = :categoryId OR ci.category.parent.id = :categoryId ORDER BY ci.id DESC")
    Page<CategoryItem> findAllPageByCategoryId(Pageable pageable, @Param("categoryId") Long categoryId);

    @Query("SELECT ci FROM CategoryItem ci WHERE ci.category.id = :categoryId ORDER BY ci.id DESC")
    List<CategoryItem> findAllByCategoryId(@Param("categoryId") Long categoryId);

}
