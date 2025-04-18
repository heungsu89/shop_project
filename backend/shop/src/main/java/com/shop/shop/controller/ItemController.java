package com.shop.shop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shop.shop.domain.cart.WishList;
import com.shop.shop.domain.category.CategoryItem;
import com.shop.shop.domain.item.Item;
import com.shop.shop.dto.CategoryDTO;
import com.shop.shop.dto.CategoryItemDTO;
import com.shop.shop.dto.ItemDTO;
import com.shop.shop.dto.WishListDTO;
import com.shop.shop.repository.WishListRepository;
import com.shop.shop.service.*;
import com.shop.shop.util.CustomFileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/items")
public class ItemController {

    private final CustomFileUtil fileUtil;
    private final ItemService itemService;
    private final CategoryItemService categoryItemService;
    private final ItemServiceImpl itemServiceImpl;

    // 페이징 목록 조회
    @GetMapping("/list")
    public ResponseEntity<Page<ItemDTO>> getAllItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(itemService.getAllItems(pageable));
    }

    // 단일 데이터 조회
    @GetMapping("/{id}")
    public ResponseEntity<?> getItem(@PathVariable Long id) {
        try {
            ItemDTO itemDTO = itemService.getOne(id);
            return ResponseEntity.ok(itemDTO);
        } catch (IllegalArgumentException e) {
            // 404 error
            Long itemId = itemService.getOne(id).getId();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("result", "fail", "error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("result", "fail", "error", e.getMessage()));
        }
    }

    // 페이징 목록 조회(아이템 정보 + 썹네일 이미지 + 옵션 + 인포)
    @GetMapping("/listPage")
    public ResponseEntity<Page<ItemDTO>> getAllItemsWithImageAndOptionsAndInfo(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(itemService.getAllItemsWithImageAndOptionsAndInfo(pageable));
    }

    // 특정 아이템의 이미지 리스트 조회 API (별도 서비스 분리 X)
    @GetMapping("/view/{fileName}")
    public ResponseEntity<?> getItemImages(@PathVariable String fileName) {
        try {
            ResponseEntity<Resource> imageResponse = itemService.getImageUrlByFileName(fileName);
            if (imageResponse == null || !imageResponse.hasBody()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("result", "fail", "error", "해당 파일을 찾을 수 없습니다."));
            }
            return imageResponse;
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("result", "fail", "error", e.getMessage()));
        }

    }

    // 아이템 등록
    @PostMapping("/add")
    public ResponseEntity<ItemDTO> registerItem(
            @RequestParam("itemDTO") String itemJson,  // JSON 데이터를 문자열로 받음
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @RequestParam("categoryId") Long categoryId
    ) {
        try {
            // JSON 을 ItemDTO 로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            ItemDTO itemDTO = objectMapper.readValue(itemJson, ItemDTO.class);

            // 파일 처리
            if (files != null && !files.isEmpty()) {
                List<String> uploadFileNames = fileUtil.saveFiles(files);
                itemDTO.setUploadFileNames(uploadFileNames);
            }

            // 서비스 호출
            ItemDTO createdItem = itemService.createItem(itemDTO, files, categoryId); // 아이템 등록
            Item item = itemServiceImpl.getSavedItem();
            CategoryItemDTO categoryItemDTO = categoryItemService.registerCategoryItem(item, categoryId); // 카테고리에 해당 아이템 등록

            return ResponseEntity.status(HttpStatus.CREATED).body(createdItem);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 아이템 수정
    @PutMapping("/modify/{id}")
    public ResponseEntity<ItemDTO> updateItem(
            @PathVariable Long id,
            @RequestBody ItemDTO itemDTO
    ) {
        ItemDTO updatedItem = itemService.updateItem(id, itemDTO);
        return ResponseEntity.ok(updatedItem);
    }

    // 아이템 삭제 (논리적 삭제)
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteItem(@PathVariable Long id) {
        try {
            itemService.deleteItem(id);
            Map<String, String> response = Map.of("result", "success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = Map.of("result", "fail", "error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}
