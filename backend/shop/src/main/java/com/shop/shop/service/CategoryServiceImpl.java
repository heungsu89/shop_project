package com.shop.shop.service;

import com.shop.shop.domain.category.Category;
import com.shop.shop.dto.CategoryDTO;
import com.shop.shop.repository.CategoryItemRepository;
import com.shop.shop.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService{

    private final CategoryRepository categoryRepository;
    private final CategoryItemRepository categoryItemRepository;

    // 카테고리 등록
    @Override
    public CategoryDTO registerCategory(CategoryDTO categoryDTO) {
        Category category = new Category();
        category.changeCategoryName(categoryDTO.getCategoryName());

        // parentId가 존재하면 부모 카테고리 설정
        if (categoryDTO.getParentId() != null) {
            Category parentCategory = categoryRepository.findById(categoryDTO.getParentId()).orElseThrow(() -> new IllegalArgumentException("해당 parentId를 가진 카테고리가 존재하지 않습니다."));
            category.changeParent(parentCategory);
            parentCategory.addChild(category); // 부모 카테고리에 자식 추가
        }

        if (categoryDTO.isViewStatus()) {
            category.changeViewStatus(true);
        }

        // 저장 후 생성된 카테고리 엔티티를 DTO 로 변환하여 반환
        Category savedCategory = categoryRepository.save(category);
        return new CategoryDTO(savedCategory);
    }

    // 카테고리 수정
    @Override
    public CategoryDTO editCategory(CategoryDTO categoryDTO) {
        Category category = categoryRepository.findById(categoryDTO.getCategoryId()).orElseThrow(() -> new IllegalArgumentException("해당 카테고리를 찾을 수 없습니다."));

        // 부모 카테고리 설정
        Category parentCategory = null; // 부모카테고리 ID 설정 - 기본값 null
        if (categoryDTO.getParentId() != null) { // 전달받은 부모 카테고리 Id가 있다면 해당 값으로 설정
            parentCategory = categoryRepository.findById(categoryDTO.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("부모 카테고리를 찾을 수 없습니다."));
        }

        category.changeParent(parentCategory);
        category.changeCategoryName(categoryDTO.getCategoryName());

        if (categoryDTO.isViewStatus()) {
            category.changeViewStatus(true);
        }

        return new CategoryDTO(categoryRepository.save(category));
    }

    // 카테고리 삭제(하위 카테고리와 연결을 끊은 후)
    @Override
    public void deleteCategory(Long id) {
        List<Category> childCategories = categoryRepository.findAllChildCategories(id);
        if (childCategories != null) {
            for (Category child : childCategories) {
                child.changeParent(null);
            }
        }
        Category category = categoryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("해당 ID를 가진 카테고리가 존재하지 않습니다."));
        categoryRepository.delete(category);
    }
}
