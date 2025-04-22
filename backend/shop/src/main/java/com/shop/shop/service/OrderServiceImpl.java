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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final MemberRepository memberRepository;
    private final DeliveryRepository deliveryRepository;
    private final CartRepository cartRepository;
    private final OrderItemRepository orderItemRepository;
    private final ItemOptionRepository itemOptionRepository;
    private final MileageService mileageService;

    // 주문서 작성(등록)
    @Override
    public OrderDTO createOrder(OrderDTO orderDTO) {
        Member member = memberRepository.findById(orderDTO.getMemberId())
                .orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));
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
        List<OrderItem> orderItemList = new ArrayList<>();
        for (Cart cart : cartList) {
            OrderItem orderItem = new OrderItem();
            orderItem.changeOrderPrice(cart.getItemOption().getOptionPrice() * cart.getQty());
            orderItem.changeQty(cart.getQty());
            orderItem.changeItem(cart.getItem());
            orderItem.changeItemOption(cart.getItemOption());
            orderItem.changeItemImage(cart.getItemImage());
            orderItem.changeOrder(savedOrder);
            OrderItem savedOrderItem = orderItemRepository.save(orderItem);
            orderItem.getItemOption().removeStock(cart.getQty());
            orderItemList.add(savedOrderItem);
            totalAmount += cart.getItemOption().getOptionPrice() * cart.getQty();
        }

        order.changeTotalAmount(totalAmount);

        // Order와 OrderItem을 함께 저장
        Order saved1Order = orderRepository.save(savedOrder);

        System.out.println(member.getMemberShip());
        int mileageAmount;
        switch (member.getMemberShip()) {
            case BRONZE : mileageAmount = (int)(totalAmount * 0.01);
            case SILVER : mileageAmount = (int)(totalAmount * 0.02);
            case GOLD : mileageAmount = (int)(totalAmount * 0.03);
            case PLATINUM : mileageAmount = (int)(totalAmount * 0.05);
            default : mileageAmount = 0;
        }

        // 마일리지 상태에 따라 추가 / 사용
        createMileageByMemberShip(mileageAmount, orderDTO.getMileageStatus(), member, order);

        return new OrderDTO(saved1Order, orderItemList);
    }

    // 회원 등급별 마일리지 생성
    public void createMileageByMemberShip(int amount, MileageStatus mileageStatus, Member member, Order order) {

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

        // 마일리지 상태가 사용(EARN)이면 마일리지 추가 / 사용(REDEEM)면 마일리지 감소
        if (mileageStatus == MileageStatus.EARN) {
            member.addMileage(amount);
            memberRepository.save(member);
        } else if (mileageStatus == MileageStatus.REDEEM) {
            member.minusMileage(amount);
            memberRepository.save(member);
        } else {
            throw new RuntimeException("올바른 마일리지 상태가 아닙니다.");
        }
    }

    // 회원 이메일로 주문 모두 조회
    @Override
    public List<OrderDTO> findAllByMemberId(Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));

        List<Order> orderList = orderRepository.findAllByMemberId(member.getId());
        if (orderList == null || orderList.isEmpty()) {
            throw new RuntimeException("해당 회원의 주문이 존재하지 않습니다.");
        }

        return orderList.stream().map(OrderDTO::new).collect(Collectors.toList());
    }

    // 회원 이메일로 주문 모두 조회(페이징)
    @Override
    public Page<OrderDTO> findAllByMemberId(Pageable pageable, Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));

        Page<Order> orderList = orderRepository.findAllByMemberId(pageable, member.getId());
        if (orderList == null || orderList.isEmpty()) {
            throw new RuntimeException("해당 회원의 주문이 존재하지 않습니다.");
        }

        return orderList.map(OrderDTO::new);
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
        return duringPeriodList.stream().map(OrderDTO::new).collect(Collectors.toList());
    }

    // 특정 기간동안 데이터 조회(페이징)
    @Override
    public Page<OrderDTO> findByDuringPeriod(Pageable pageable, LocalDateTime orderDate1, LocalDateTime orderDate2) {
        Page<Order> duringPeriodList = orderRepository.findByDuringPeriod(pageable, orderDate1, orderDate2);
        if (duringPeriodList == null || duringPeriodList.isEmpty()) {
            throw new RuntimeException("해당 기간동안 조회되는 데이터가 없습니다.");
        }
        return duringPeriodList.map(OrderDTO::new);
    }

    // 특정 기간동안 특정회원의 데이터 조회
    @Override
    public List<OrderDTO> findByDuringPeriodFromMemberId(Long memberId, LocalDateTime orderDate1, LocalDateTime orderDate2) {
        List<Order> duringPeriodFromMemberEmail = orderRepository.findByDuringPeriodFromMemberId(memberId, orderDate1, orderDate2);
        if (duringPeriodFromMemberEmail == null || duringPeriodFromMemberEmail.isEmpty()) {
            throw new RuntimeException("해당 회뭔의 해당 기간동안 조회되는 데이터가 없습니다.");
        }
        return duringPeriodFromMemberEmail.stream().map(OrderDTO::new).collect(Collectors.toList());
    }

    // 특정 기간동안 특정회원의 데이터 조회(페이징)
    @Override
    public Page<OrderDTO> findByDuringPeriodFromMemberId(Pageable pageable, Long memberId, LocalDateTime orderDate1, LocalDateTime orderDate2) {
        Page<Order> duringPeriodFromMemberEmail = orderRepository.findByDuringPeriodFromMemberId(pageable, memberId, orderDate1, orderDate2);
        if (duringPeriodFromMemberEmail == null || duringPeriodFromMemberEmail.isEmpty()) {
            throw new RuntimeException("해당 회뭔의 해당 기간동안 조회되는 데이터가 없습니다.");
        }
        return duringPeriodFromMemberEmail.map(OrderDTO::new);
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
