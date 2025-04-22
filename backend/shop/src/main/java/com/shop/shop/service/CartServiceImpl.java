package com.shop.shop.service;

import com.shop.shop.domain.cart.Cart;
import com.shop.shop.domain.cart.WishList;
import com.shop.shop.domain.item.Item;
import com.shop.shop.domain.item.ItemImage;
import com.shop.shop.domain.item.ItemOption;
import com.shop.shop.domain.member.Member;
import com.shop.shop.dto.CartDTO;
import com.shop.shop.dto.ItemDTO;
import com.shop.shop.dto.WishListDTO;
import com.shop.shop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final MemberRepository memberRepository;
    private final ItemRepository itemRepository;
    private final ItemOptionRepository itemOptionRepository;
    private final ItemImageRepository itemImageRepository;

    // 장바구니 등록하기
    @Override
    public CartDTO registerCart(CartDTO cartDTO) {
        Member member = memberRepository.findById(cartDTO.getMemberId()).orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));
        Item item = itemRepository.findById(cartDTO.getItemId()).orElseThrow(() -> new RuntimeException("해당 상품을 찾을 수 없습니다."));
        ItemOption option = itemOptionRepository.findById(cartDTO.getOptionId()).orElseThrow(() -> new IllegalArgumentException("해당 옵션이 존재하지 않습니다."));
        List<ItemImage> images = itemImageRepository.findByItemId(cartDTO.getItemId());

        if (cartDTO.getQty() > option.getStockQty()) {
            throw new RuntimeException("재고량이 부족합니다!");
        }

        ItemImage itemImage = null;
        if (images != null && !images.isEmpty()) {
            itemImage = images.get(0);
        }

        Cart duplicatePrevention = cartRepository.findByMemberIdAndItemId(member.getId(), item.getId());

        // 존재한다면 삭제 후 null값 반환
        if (duplicatePrevention != null) {
            cartRepository.deleteById(duplicatePrevention.getId());
            return null;
        }

        Cart cart = new Cart();
        cart.registerCart(member, item, option, itemImage);
        cart.changeQty(cartDTO.getQty());

        cartRepository.save(cart);
        return new CartDTO(cart);
    }

    // 회원Id를 기준으로 장바구니 불러오기
    @Override
    public List<CartDTO> getCartList(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        List<CartDTO> cartList = cartRepository.findAllByMemberId(member.getId());

        return cartList;
    }

    // 회원Id와 상품Id를 기준으로 장바구니 데이터 삭제
    @Override
    public void deleteCartItem(CartDTO cartDTO) {
        Member member = memberRepository.findById(cartDTO.getMemberId()).orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));
        Cart cartItem = cartRepository.findByMemberIdAndItemId(member.getId(), cartDTO.getItemId());

        if (cartItem == null) {
            throw new RuntimeException("삭제하려는 상품이 장바구니에 존재하지 않습니다.");
        }

        cartRepository.deleteById(cartItem.getId());
    }

    // 장바구니 목록 상품 다중 삭제(선택한 상품 삭제)
    @Override
    public void multipleDeleteItemFromWishList(CartDTO cartDTO) {
        for (Long deleteId : cartDTO.getDeleteId()) {
            Cart deleteWishListItem = cartRepository.findById(deleteId).orElseThrow(() -> new RuntimeException("삭제하려는 상품을 찾을 수 없습니다."));
            cartRepository.deleteById(deleteWishListItem.getId());
        }
    }
}
