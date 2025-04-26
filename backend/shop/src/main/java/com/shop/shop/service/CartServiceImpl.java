package com.shop.shop.service;

import com.shop.shop.domain.cart.Cart;
import com.shop.shop.domain.cart.WishList;
import com.shop.shop.domain.item.Item;
import com.shop.shop.domain.item.ItemImage;
import com.shop.shop.domain.item.ItemOption;
import com.shop.shop.domain.member.Member;
import com.shop.shop.dto.CartDTO;
import com.shop.shop.dto.CheckDTO;
import com.shop.shop.dto.ItemDTO;
import com.shop.shop.dto.WishListDTO;
import com.shop.shop.exception.NotEnoughStockException;
import com.shop.shop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
        Member member = memberRepository.findById(cartDTO.getMemberId())
                .orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));
        Item item = itemRepository.findById(cartDTO.getItemId())
                .orElseThrow(() -> new RuntimeException("해당 상품을 찾을 수 없습니다."));
        ItemOption option = itemOptionRepository.findById(cartDTO.getOptionId())
                .orElseThrow(() -> new IllegalArgumentException("해당 옵션이 존재하지 않습니다."));
        List<ItemImage> images = itemImageRepository.findByItemId(cartDTO.getItemId());

        if (cartDTO.getQty() > option.getStockQty()) {
            throw new RuntimeException("재고량이 부족합니다!");
        }

        ItemImage itemImage = null;
        if (images != null && !images.isEmpty()) {
            itemImage = images.get(0);
        }

        Cart duplicatePrevention = cartRepository.findByMemberIdAndOptionId(member.getId(), item.getId());

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

        List<Cart> cartList = cartRepository.findAllByMemberId(member.getId());

        return cartList.stream().map(CartDTO::new).toList();
    }

    // 회원Id와 상품Id를 기준으로 장바구니 데이터 삭제
    @Override
    public void deleteCartItem(CartDTO cartDTO) {
        Member member = memberRepository.findById(cartDTO.getMemberId())
                .orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));
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
            Cart deleteWishListItem = cartRepository.findById(deleteId)
                    .orElseThrow(() -> new RuntimeException("삭제하려는 상품을 찾을 수 없습니다."));
            cartRepository.deleteById(deleteWishListItem.getId());
        }
    }

    // 상품 옵션 재고량 체크
    @Override
    public CheckDTO checkOptionQty(Long optionId, int qty) {
        ItemOption itemOption = itemOptionRepository.findById(optionId).orElseThrow();
        boolean check = false;
        if (itemOption.getStockQty() < qty) {
            check = false;
            // throw new RuntimeException("재고량이 부족합니다. 현재 재고량: " +
            // itemOption.getStockQty());
        } else {
            check = true;
        }
        return new CheckDTO(check);
    }

    @Override
    @Transactional
    public void updateCartQty(Long cartId, int newQty) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("해당 장바구니 상품을 찾을 수 없습니다."));

        ItemOption itemOption = itemOptionRepository.findById(cart.getItemOption().getId())
                .orElseThrow(() -> new RuntimeException("해당 옵션이 존재하지 않습니다."));

        if (newQty > itemOption.getStockQty()) {
            throw new RuntimeException("재고 수량 초과: 현재 재고는 " + itemOption.getStockQty() + "개입니다.");
        }

        cart.changeQty(newQty);
        cartRepository.save(cart);
    }

    @Override
    @Transactional
    public CheckDTO updateOptionQty(Long optionId, int changeQty) {
        ItemOption itemOption = itemOptionRepository.findById(optionId)
                .orElseThrow(() -> new RuntimeException("해당 옵션이 존재하지 않습니다: optionId=" + optionId));

        int currentStock = itemOption.getStockQty(); // 현재 재고량
        int expectedStock = currentStock + changeQty; // 변경 후 예상 재고량

        // 재고량이 0 미만이면 실패
        if (expectedStock < 0) {
            return new CheckDTO(false);
        }

        // 재고량 업데이트
        itemOption.changeStockQty(expectedStock);
        itemOptionRepository.save(itemOption);

        return new CheckDTO(true);
    }

}
