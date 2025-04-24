package com.shop.shop.service;

import com.shop.shop.domain.item.Item;
import com.shop.shop.domain.list.ReviewImage;
import com.shop.shop.domain.list.ReviewList;
import com.shop.shop.domain.member.Member;
import com.shop.shop.domain.member.MemberRole;
import com.shop.shop.dto.OrderDTO;
import com.shop.shop.dto.ReviewListDTO;
import com.shop.shop.repository.ItemRepository;
import com.shop.shop.repository.MemberRepository;
import com.shop.shop.repository.ReviewImageRepository;
import com.shop.shop.repository.ReviewListRepository;
import com.shop.shop.util.CustomFileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class ReviewListServiceImpl implements ReviewListService {

    private final MemberRepository memberRepository;
    private final ItemRepository itemRepository;
    private final ReviewListRepository reviewListRepository;
    private final ReviewImageRepository reviewImageRepository;
    private final CustomFileUtil fileUtil;
    private final OrderService orderService;

    // 리뷰 리스트 등록
    @Override
    public ReviewListDTO createReviewList(ReviewListDTO reviewListDTO, List<MultipartFile> files) {
        Member member = memberRepository.findById(reviewListDTO.getMemberId()).orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));
        Item item = itemRepository.findById(reviewListDTO.getItemId()).orElseThrow(() -> new RuntimeException("해당 상품을 찾을 수 없습니다."));
        // 상품 구매내역이 있는지 체크하는 메서드(구매자만 리뷰글 작성 가능)
        if (member.getMemberRoleList().get(0) == MemberRole.USER) {
            boolean checkPurchaseStatus = checkPurchaseStatus(member.getId(), item.getId());
            if (!checkPurchaseStatus) {
                throw new RuntimeException("해당 상품을 구매한 내역이 없습니다. 따라서 리뷰글을 작성할 수 없습니다.");
            }
        }
        ReviewList reviewList = ReviewList.builder()
                .member(member)
                .item(item)
                .title(reviewListDTO.getTitle())
                .writer(reviewListDTO.getWriter())
                .content(reviewListDTO.getContent())
                .date(LocalDateTime.now())
                .score(reviewListDTO.getScore())
                .delFlag(false)
                .build();

        ReviewList savedReviewList = reviewListRepository.save(reviewList);

        List<ReviewImage> images = null;

        // 이미지 저장
        if (files != null && !files.isEmpty()) {
            List<String> uploadFileNames = fileUtil.saveFiles(files);
            System.out.println("uploadFileNames: " + uploadFileNames);
            images = uploadFileNames.stream()
                    .map(fileName -> ReviewImage.builder()
                            .fileName(fileName)
                            .reviewId(savedReviewList.getId())
                            .build())
                    .toList();
            reviewImageRepository.saveAll(images);
            return new ReviewListDTO(images, savedReviewList);
        }

        return new ReviewListDTO(savedReviewList);
    }

    // 해당 상품을 구매한 적이 있는지 확인하는 메서드(회원Id, 상품Id를 기준으로)
    @Override
    public boolean checkPurchaseStatus(Long memberId, Long itemId) {
        List<OrderDTO> orderDTO = orderService.findAllByMemberId(memberId);
        boolean checkStatus = false;
        if (orderDTO == null || orderDTO.isEmpty()) {
//            checkStatus = false;
            throw new RuntimeException("해당 회원의 주문 내역이 조회되지 않습니다."); // 이 부분 회의 필요
        }
        int listIndex = 0;
        for (OrderDTO targetOrder : orderDTO) {
            if (targetOrder.getOrderItemList() == null || targetOrder.getOrderItemList().isEmpty()) {
                throw new RuntimeException("주문 상품을 조회할 수 없습니다.");
            } else {
                if (targetOrder.getOrderItemList().get(listIndex).getItemId() == itemId) {
                    checkStatus = true;
                }
            }
        }
        return checkStatus;
    }

    // 특정 리뷰 리스트 조회
    @Override
    public ReviewListDTO getReviewListWithReviewImages(Long reviewListId) {
        ReviewList reviewList = reviewListRepository.findByIdWithReviewImages(reviewListId);
        if (reviewList == null) {
            throw new RuntimeException("해당 리뷰 페이지를 찾을 수 없습니다.");
        }
        List<ReviewImage> reviewImageList = reviewImageRepository.findAllByReviewId(reviewListId);
        return new ReviewListDTO(reviewImageList, reviewList);
    }

    // 리뷰 리스트 + 이미지 모두 조회(페이징) 삭제 포함
    @Override
    public Page<ReviewListDTO> getReviewListPage(Pageable pageable) {
        Page<ReviewList> reviewListPage = reviewListRepository.findAllReviewListPage(pageable);
        if (reviewListPage == null || reviewListPage.isEmpty()) {
            throw new RuntimeException("조회된 리뷰 리스트가 없습니다.");
        }

        return reviewListPage.map(review -> {
            List<ReviewImage> reviewImageList = reviewImageRepository.findAllByReviewId(review.getId());
            return new ReviewListDTO(reviewImageList, review);
        });
    }

    // 리뷰 리스트 + 이미지 모두 조회(페이징) 삭제 미포함
    @Override
    public Page<ReviewListDTO> getReviewListPageWithDelFlag(Pageable pageable) {
        Page<ReviewList> reviewListPage = reviewListRepository.findAllReviewListPageWithDelFlag(pageable);
        if (reviewListPage == null || reviewListPage.isEmpty()) {
            throw new RuntimeException("조회된 리뷰 리스트가 없습니다.");
        }
        return reviewListPage.map(review -> {
            List<ReviewImage> reviewImageList = reviewImageRepository.findAllByReviewId(review.getId());
            return new ReviewListDTO(reviewImageList, review);
        });
    }

    @Override
    public Page<ReviewListDTO> getReviewListPageByItemId(Long itemId, Pageable pageable) {
        Page<ReviewList> reviewListPage = reviewListRepository.findAllByItemIdWithReviewImages(itemId, pageable);
        if (reviewListPage == null || reviewListPage.isEmpty()) {
            throw new RuntimeException("조회된 리뷰 리스트가 없습니다.");
        }
        return reviewListPage.map(review -> {
            List<ReviewImage> reviewImageList = reviewImageRepository.findAllByReviewId(review.getId());
            return new ReviewListDTO(reviewImageList, review);
        });
    }

    @Override
    public Page<ReviewListDTO> getReviewListPageByItemIdWithDelFlag(Long itemId, Pageable pageable) {
        Page<ReviewList> reviewListPage = reviewListRepository.findAllByItemIdWithReviewImagesANDDelFlag(itemId, pageable);
        if (reviewListPage == null || reviewListPage.isEmpty()) {
            throw new RuntimeException("조회된 리뷰 리스트가 없습니다.");
        }
        return reviewListPage.map(review -> {
            List<ReviewImage> reviewImageList = reviewImageRepository.findAllByReviewId(review.getId());
            return new ReviewListDTO(reviewImageList, review);
        });
    }

    // 리뷰 리스트 수정
    @Override
    public ReviewListDTO editReviewList(ReviewListDTO reviewListDTO, List<MultipartFile> files) {
        Member member = memberRepository.findById(reviewListDTO.getMemberId()).orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));
        ReviewList reviewList = reviewListRepository.findById(reviewListDTO.getReviewId()).orElseThrow(() -> new RuntimeException("해당 리뷰를 찾을 수 없습니다."));
        if (member.getMemberRoleList().get(0) == MemberRole.USER) {
            if (reviewList.getMember().getId() != member.getId()) {
                throw new RuntimeException("해당 리뷰글 작성자가 아닙니다. 따라서 리뷰글을 수정할 수 없습니다.");
            }
        }
        reviewList.changeTitle(reviewListDTO.getTitle());
        reviewList.changeWriter(reviewListDTO.getWriter());
        reviewList.changeContent(reviewListDTO.getContent());
        reviewList.changeDelFlag(reviewListDTO.isDelFlag());
        reviewList.clearList();

        ReviewList editReviewList = reviewListRepository.save(reviewList);

        List<ReviewImage> images = null;

        // 이미지 저장
        if (files != null && !files.isEmpty()) {
            List<String> uploadFileNames = fileUtil.saveFiles(files);
            System.out.println("uploadFileNames: " + uploadFileNames);
            images = uploadFileNames.stream()
                    .map(fileName -> ReviewImage.builder()
                            .fileName(fileName)
                            .reviewId(editReviewList.getId())
                            .build())
                    .toList();
            reviewImageRepository.saveAll(images);
            return new ReviewListDTO(images, reviewList);
        }

        ReviewList editedReviewList = reviewListRepository.save(editReviewList);
        return new ReviewListDTO(editedReviewList);
    }

    // 특정 리뷰 리스트 삭제(논리적)
    @Override
    public void deleteReviewList(ReviewListDTO reviewListDTO) {
        Member member = memberRepository.findById(reviewListDTO.getMemberId()).orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));
        ReviewList reviewList = reviewListRepository.findById(reviewListDTO.getReviewId()).orElseThrow(() -> new RuntimeException("해당 리뷰를 찾을 수 없습니다."));
        if (member.getMemberRoleList().get(0) == MemberRole.USER) {
            if (reviewList.getMember().getId() != member.getId()) {
                throw new RuntimeException("해당 리뷰글 작성자가 아닙니다. 따라서 리뷰글을 삭제할 수 없습니다.");
            }
        }
        reviewList.changeDelFlag(true);
        reviewListRepository.save(reviewList);
    }

}
