package com.shop.shop.service;

import com.shop.shop.domain.cart.Cart;
import com.shop.shop.domain.delivery.Delivery;
import com.shop.shop.domain.delivery.DeliveryStatus;
import com.shop.shop.domain.item.ItemOption;
import com.shop.shop.domain.member.*;
import com.shop.shop.domain.order.Order;
import com.shop.shop.domain.order.OrderItem;
import com.shop.shop.domain.order.OrderStatus;
import com.shop.shop.domain.order.PaymentMethod;
import com.shop.shop.dto.MileageDTO;
import com.shop.shop.dto.OrderDTO;
import com.shop.shop.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final MemberRepository memberRepository;
    private final DeliveryRepository deliveryRepository;
    private final CartRepository cartRepository;
    private final OrderItemRepository orderItemRepository;
    private final ItemOptionRepository itemOptionRepository;
    private final MileageService mileageService;

//    // 주문서 작성준비
//    @Override
//    public OrderDTO preparingOrder(OrderDTO orderDTO) {
//        Member member = memberRepository.findById(orderDTO.getMemberId()).orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));
//        List<Cart> cartList = cartRepository.findAllCartListByMemberId(orderDTO.getMemberId());
//        if (cartList == null || cartList.isEmpty()) {
//            throw new RuntimeException("장바구니에 상품이 없습니다.");
//        }
//        order
//        return null;
//    }

    // 주문서 작성(등록)
    @Override
    public OrderDTO createOrder(OrderDTO orderDTO) {
        Member member = memberRepository.findById(orderDTO.getMemberId()).orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));
        List<Cart> cartList = cartRepository.findAllCartListByMemberId(orderDTO.getMemberId());
        if (cartList == null || cartList.isEmpty()) {
            throw new RuntimeException("장바구니에 상품이 없습니다.");
        }

        Delivery delivery = new Delivery();
        if (orderDTO.getPaymentMethod() == PaymentMethod.CARD) {
            delivery.changeStatus(DeliveryStatus.PREPARING);
        } else if (orderDTO.getPaymentMethod() == PaymentMethod.NO_BANKBOOK) {
            delivery.changeStatus(DeliveryStatus.PENDING);
        } else {
            delivery.changeStatus(null);
        }

        Order order = Order.builder() // 주문 기본 상태 생성
                .member(member)
                .orderDate(LocalDateTime.now())
                .totalAmount(orderDTO.getTotalAmount())
                .mileageStatus(orderDTO.getMileageStatus())
                .addMileageAmount(0)
                .usingMileage(orderDTO.getUsingMileage())
                .orderStatus(
                        (orderDTO.getPaymentMethod() == PaymentMethod.CARD) ? OrderStatus.PAID : OrderStatus.PENDING
                )
                .delFlag(false)
                .payerName(member.getMemberName())
                .payerNumber(member.getPhoneNumber())
                .orderRequest(orderDTO.getOrderRequest())
                .paymentMethod(orderDTO.getPaymentMethod())
                .recipientName(orderDTO.getRecipientName())
                .recipientNumber(orderDTO.getRecipientNumber())
                .recipient_zip_code(orderDTO.getRecipient_zip_code())
                .recipient_default_address(orderDTO.getRecipient_default_address())
                .recipient_detailed_address(orderDTO.getRecipient_detailed_address())
                .delivery(delivery)
                .build();

        // 먼저 order를 저장한 후, order의 id를 참조하는 orderItem 저장
        Order savedOrder = orderRepository.save(order); // order의 id가 생성된 후에 orderItem 저장 가능

        int totalAmount = 0;
        int totalDiscountAmount = 0;
        List<OrderItem> orderItemList = new ArrayList<>();
        for (Cart cart : cartList) {
            OrderItem orderItem = new OrderItem();
            orderItem.changeOrderPrice(cart.getItemOption().getOptionPrice() * cart.getQty());
            orderItem.changeQty(cart.getQty());
            orderItem.changeDiscountRate(cart.getItem().getDiscountRate());
            orderItem.changeDiscountPrice((int)((float)(cart.getItemOption().getOptionPrice() * cart.getQty()) * (1 - ((float)cart.getItem().getDiscountRate() / 100))));
            orderItem.changeItem(cart.getItem());
            orderItem.changeItemOption(cart.getItemOption());
            orderItem.changeItemImage((cart.getItemImage() != null) ? cart.getItemImage() : null);
            orderItem.changeOrder(savedOrder);
            OrderItem savedOrderItem = orderItemRepository.save(orderItem);
            orderItem.getItemOption().removeStock(cart.getQty());
            orderItemList.add(savedOrderItem);
            totalAmount += cart.getItemOption().getOptionPrice() * cart.getQty();
            totalDiscountAmount += ((int)((float)(cart.getItemOption().getOptionPrice() * cart.getQty()) * (1 - ((float)cart.getItem().getDiscountRate() / 100))));
        }
        order.changeTotalAmount(totalDiscountAmount);
        log.info("totalDiscountAmount: " + totalDiscountAmount);

        int addMileageAmount;
        switch (member.getMemberShip()) {
            case BRONZE: addMileageAmount = (int) ((float)totalDiscountAmount * 0.01); break;
            case SILVER: addMileageAmount = (int) ((float)totalDiscountAmount * 0.02); break;
            case GOLD: addMileageAmount = (int) ((float)totalDiscountAmount * 0.03); break;
            case PLATINUM: addMileageAmount = (int) ((float)totalDiscountAmount * 0.05); break;
            default: addMileageAmount = 0; break;
        }
        // 마일리지 내역 생성
        createMileageByMemberShip(addMileageAmount, member, order, MileageStatus.NO_REDEEM);

        // 마일리지 상태가 REDEEM(사용)이라면
        if (orderDTO.getMileageStatus() == MileageStatus.REDEEM) {
            Member memberMileage = memberRepository.findById(orderDTO.getMemberId()).orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));
            if (orderDTO.getUsingMileage() <= memberMileage.getStockMileage()) {
                createMileageByMemberShip(orderDTO.getUsingMileage(), member, order, MileageStatus.REDEEM);
            } else {
                throw new RuntimeException("마일리지 보유량이 부족합니다.");
            }
        }
        savedOrder.changeAddMileageAmount(addMileageAmount);

        // Order와 OrderItem을 함께 저장
        Order saved1Order = orderRepository.save(savedOrder);

        return new OrderDTO(saved1Order, orderItemList);
    }

    // 회원 등급별 마일리지 생성
    public void createMileageByMemberShip(int amount, Member member, Order order, MileageStatus mileageStatus) {

        // 마일리지 수치 설정
        Mileage mileage = Mileage.builder()
                .amount(amount)
                .mileageStatus(mileageStatus)
                .mileageDate(LocalDateTime.now())
                .member(member)
                .order(order)
                .build();
        // 마일리지 내역 생성
        mileageService.createMileage(new MileageDTO(mileage));

        // 회원 마일리지량 증가
        if (mileageStatus == MileageStatus.REDEEM) {
            member.minusMileage(amount);
        } else if (mileageStatus == MileageStatus.NO_REDEEM) {
            member.addMileage(amount);
        } else {
            throw new RuntimeException("올바른 마일리지 상태가 아닙니다.");
        }
        memberRepository.save(member);
    }

    // 회원Id를 기준으로 주문 모두 조회
    @Override
    public List<OrderDTO> findAllByMemberId(Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));

        List<Order> orderList = orderRepository.findAllByMemberId(member.getId());
        if (orderList == null || orderList.isEmpty()) {
            throw new RuntimeException("해당 회원의 주문이 존재하지 않습니다.");
        }

        return orderList.stream().map(order -> {
                    List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
                    return new OrderDTO(order, items);
                }).collect(Collectors.toList());
    }

    // 회원Id를 기준으로 주문 모두 조회(페이징)
    @Override
    public Page<OrderDTO> findAllByMemberId(Pageable pageable, Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));

        Page<Order> orderList = orderRepository.findAllByMemberId(pageable, member.getId());
        if (orderList == null || orderList.isEmpty()) {
            throw new RuntimeException("해당 회원의 주문이 존재하지 않습니다.");
        }

        return orderList.map(order -> {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            return new OrderDTO(order, items);
        });
    }

    // 배송Id를 기준으로 주문 내역 조회
    @Override
    public OrderDTO findByDeliveryId(Long deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId).orElseThrow(() -> new RuntimeException("해당 배송정보를 찾을 수 없습니다."));
        Order getOrder = orderRepository.findByDeliveryId(delivery.getId());
        if (getOrder == null) {
            throw new RuntimeException("해당 배송과 관련된 주문을 찾을 수 없습니다.");
        }
        return new OrderDTO(getOrder);
    }

    // 특정 기간동안 데이터 조회
    @Override
    public List<OrderDTO> findByDuringPeriod(LocalDateTime orderDate1, LocalDateTime orderDate2) {
        List<Order> duringPeriodList = orderRepository.findByDuringPeriod(orderDate1, orderDate2);
        if (duringPeriodList == null || duringPeriodList.isEmpty()) {
            throw new RuntimeException("해당 기간동안 조회되는 데이터가 없습니다.");
        }
        return duringPeriodList.stream().map(order -> {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            return new OrderDTO(order, items);
        }).collect(Collectors.toList());
    }

    // 특정 기간동안 데이터 조회(페이징)
    @Override
    public Page<OrderDTO> findByDuringPeriod(Pageable pageable, LocalDateTime orderDate1, LocalDateTime orderDate2) {
        Page<Order> duringPeriodList = orderRepository.findByDuringPeriod(pageable, orderDate1, orderDate2);
        if (duringPeriodList == null || duringPeriodList.isEmpty()) {
            throw new RuntimeException("해당 기간동안 조회되는 데이터가 없습니다.");
        }
        return duringPeriodList.map(order -> {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            return new OrderDTO(order, items);
        });
    }

    // 특정 기간동안 특정회원의 데이터 조회
    @Override
    public List<OrderDTO> findByDuringPeriodFromMemberId(Long memberId, LocalDateTime orderDate1, LocalDateTime orderDate2) {
        List<Order> duringPeriodFromMemberEmail = orderRepository.findByDuringPeriodFromMemberId(memberId, orderDate1, orderDate2);
        if (duringPeriodFromMemberEmail == null || duringPeriodFromMemberEmail.isEmpty()) {
            throw new RuntimeException("해당 회뭔의 해당 기간동안 조회되는 데이터가 없습니다.");
        }
        return duringPeriodFromMemberEmail.stream().map(order -> {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            return new OrderDTO(order, items);
        }).collect(Collectors.toList());
    }

    // 특정 기간동안 특정회원의 데이터 조회(페이징)
    @Override
    public Page<OrderDTO> findByDuringPeriodFromMemberId(Pageable pageable, Long memberId, LocalDateTime orderDate1, LocalDateTime orderDate2) {
        Page<Order> duringPeriodFromMemberEmail = orderRepository.findByDuringPeriodFromMemberId(pageable, memberId, orderDate1, orderDate2);
        if (duringPeriodFromMemberEmail == null || duringPeriodFromMemberEmail.isEmpty()) {
            throw new RuntimeException("해당 회뭔의 해당 기간동안 조회되는 데이터가 없습니다.");
        }
        return duringPeriodFromMemberEmail.map(order -> {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            return new OrderDTO(order, items);
        });
    }

    // 배송지 수정
    @Override
    public OrderDTO editOrder(OrderDTO orderDTO) {
        Order order = orderRepository.findById(orderDTO.getId()).orElseThrow(() -> new RuntimeException("해당 주문을 찾을 수 없습니다."));
        order.changeRecipient_zip_code(orderDTO.getRecipient_zip_code());
        order.changeRecipient_default_address(orderDTO.getRecipient_default_address());
        order.changeRecipient_detailed_address(orderDTO.getRecipient_detailed_address());
        Order changedOrder = orderRepository.save(order);
        return new OrderDTO(changedOrder);
    }

    // 주문 상태 수정
    @Override
    public OrderDTO editOrderStatus(OrderDTO orderDTO) {
        Order order = orderRepository.findById(orderDTO.getId()).orElseThrow(() -> new RuntimeException("해당 주문을 찾을 수 없습니다."));
        if (orderDTO.getOrderStatus() == OrderStatus.PENDING || orderDTO.getOrderStatus() == OrderStatus.PAID || orderDTO.getOrderStatus() == OrderStatus.PREPARING) {
            order.changeOrderStatus(orderDTO.getOrderStatus());
            Order editedOrder = orderRepository.save(order);
            return new OrderDTO(editedOrder);
        } else {
            throw new RuntimeException("배송지를 수정할 수 있는 상태가 아닙니다.");
        }
    }

    // 주문 삭제
    @Override
    public void deleteOrder(Long orderId) {
        Order deleteOrder = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("해당 주문을 찾을 수 없습니다."));
        deleteOrder.changeDelFlag(true);
        orderRepository.save(deleteOrder);
    }
}
