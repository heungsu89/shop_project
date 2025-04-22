package com.shop.shop.controller;

import com.shop.shop.dto.CartDTO;
import com.shop.shop.dto.CategoryDTO;
import com.shop.shop.dto.WishListDTO;
import com.shop.shop.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    // 회원Id를 기준으로 장바구니에 상품 등록
    @PostMapping("/add")
    public ResponseEntity<CartDTO> registerCart(@RequestBody CartDTO cartDTO) {
        CartDTO registerCart = cartService.registerCart(cartDTO);
        return ResponseEntity.ok(registerCart);
    }

    // 회원Id를 기준으로 장바구니 조회
    @GetMapping("/{memberId}")
    public ResponseEntity<List<CartDTO>> getCartByMemberId(@PathVariable("memberId") Long memberId) {
        List<CartDTO> getCartByMemberId = cartService.getCartList(memberId);
        return ResponseEntity.ok(getCartByMemberId);
    }

    // 회원Id를 기준으로 장바구니 상품 삭제
    @DeleteMapping("/deleteItem")
    public ResponseEntity<Map<String, String>> deleteCartItem(@RequestBody CartDTO cartDTO) {
        try {
            cartService.deleteCartItem(cartDTO);
            Map<String, String> response = Map.of("result", "success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = Map.of("result", "fail", "error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 다중 삭제(선택한 상품 삭제)
    @DeleteMapping("/multipleDelete")
    public ResponseEntity<?> multipleDelete(@RequestBody CartDTO cartDTO) {
        try {
            cartService.multipleDeleteItemFromWishList(cartDTO);
            Map<String, String> response = Map.of("result", "success");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("result", "fail", "error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("result", "fail", "error", e.getMessage()));
        }
    }

}
