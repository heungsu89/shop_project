package com.shop.shop.service;

import com.shop.shop.domain.category.Category;
import com.shop.shop.domain.item.Item;
import com.shop.shop.dto.ItemDTO;
import com.shop.shop.dto.SearchDTO;
import com.shop.shop.repository.CategoryRepository;
import com.shop.shop.repository.ItemRepository;

import java.util.List;

public class SearchServiceImpl implements SearchService{

    private ItemRepository itemRepository;
    private CategoryRepository categoryRepository;

    // 입력받은 단어가 포함된 아이템 이름들을 기준으로 검색
    @Override
    public SearchDTO getSearchCategoryAndItem(String searchName) {
        List<Item> itemList = itemRepository.findAllByItemName(searchName); // 검색단어가 포함된 상품 이름을 모두 조회
        List<Category> categoryList = categoryRepository.findAllByCategoryName(searchName); // 검색단어가 포함된 카테고리 이름을 모두 조회

        // 검색된(조회된) 결과물이 하나도 없다면 예외처리 발생
        if ((itemList == null || itemList.isEmpty()) && (categoryList == null || categoryList.isEmpty())) {
            throw new RuntimeException("해당 이름이 포함된 상품을 찾을 수 없습니다.");
        }

        // 각각의 조회된 결과물에서 이름만 추출하여 저장
        List<String> itemNames = null;
        for (Item item : itemList) {
            itemNames.add(item.getName());
        }
        List<String> categoryNames = null;
        for (Category category : categoryList) {
            categoryNames.add(category.getCategoryName());
        }

        return new SearchDTO(itemNames, categoryNames);
    }

}
