package com.shop.shop.service;

import com.shop.shop.domain.category.Category;
import com.shop.shop.domain.category.CategoryItem;
import com.shop.shop.domain.item.Item;
import com.shop.shop.domain.item.ItemImage;
import com.shop.shop.dto.CategoryDTO;
import com.shop.shop.dto.CategoryItemDTO;
import com.shop.shop.dto.ItemDTO;
import com.shop.shop.repository.CategoryItemRepository;
import com.shop.shop.repository.CategoryRepository;
import com.shop.shop.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryItemServiceImpl implements CategoryItemService {

    private final CategoryRepository categoryRepository;
    private final CategoryItemRepository categoryItemRepository;
    private final ItemRepository itemRepository;

    @Override
    public CategoryItemDTO registerCategoryItem(Item item, Long categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("해당 카테고리를 찾을 수 없습니다."));
        Item item1 = itemRepository.findById(item.getId()).orElseThrow(() -> new RuntimeException("해당 아이템을 찾을 수 없습니다."));
        CategoryItem categoryItem = new CategoryItem();
        categoryItem.changeCategoryItem(category, item1);
        CategoryItem savedCategoryItem = categoryItemRepository.save(categoryItem);
        return new CategoryItemDTO(savedCategoryItem);
    }

}
