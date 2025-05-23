package com.shop.shop.service;

import com.shop.shop.dto.CartDTO;

import java.util.List;

public interface CartService {

    // 회원Id를 기준으로 장바구니에 상품 등록
    public CartDTO registerCart(CartDTO cartDTO, Long optionId);

    // 회원Id를 기준으로 장바구니 목록 조회
    public List<CartDTO> getCartList(Long memberId);

    // 장바구니 목록에서 상품 삭제
    public void deleteCartItem(CartDTO cartDTO);

    // 장바구니 목록 다중 삭제
    public void multipleDeleteItemFromWishList(CartDTO cartDTO);

}
