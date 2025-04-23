package com.shop.shop.controller;

import com.shop.shop.dto.CheckDTO;
import com.shop.shop.dto.ReviewListDTO;
import com.shop.shop.repository.ReviewListRepository;
import com.shop.shop.service.OrderService;
import com.shop.shop.service.ReviewListService;
import com.shop.shop.util.CustomFileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
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
@RequestMapping("/api/reviewList")
public class ReviewController {

    private final ReviewListRepository reviewListRepository;
    private final ReviewListService reviewListService;
    private final CustomFileUtil fileUtil;
    private final OrderService orderService;

    // 리뷰 리스트 등록
    @PostMapping("/add")
    public ResponseEntity<ReviewListDTO> createReviewList(
            @RequestParam("memberId") Long memberId,
            @RequestParam("itemId") Long itemId,
            @RequestParam("title") String title,
            @RequestParam("writer") String writer,
            @RequestParam("content") String content,
            @RequestParam("score") int score,
            @RequestParam(value = "files", required = false) List<MultipartFile> files
    ) {


        ReviewListDTO reviewListDTO = new ReviewListDTO();
        reviewListDTO.setMemberId(memberId);
        reviewListDTO.setItemId(itemId);
        reviewListDTO.setTitle(title);
        reviewListDTO.setWriter(writer);
        reviewListDTO.setContent(content);
        reviewListDTO.setScore(score);

        // 파일 처리
        if (files != null && !files.isEmpty()) {
            List<String> uploadFileNames = fileUtil.saveFiles(files);
            reviewListDTO.setUploadFileNames(uploadFileNames);
        }

        ReviewListDTO createdReviewListDTO = reviewListService.createReviewList(reviewListDTO, files);

        return ResponseEntity.ok(createdReviewListDTO);
    }

    // 회원Id와 상품Id를 기준으로 구매여부(주문내역) 확인
    @GetMapping("/checkPurchaseStatus")
    public ResponseEntity<?> checkPurchaseStatus(@RequestBody CheckDTO checkDTO) {
        boolean checkResult = reviewListService.checkPurchaseStatus(checkDTO.getMemberId(), checkDTO.getItemId());
        if (checkResult) {
            Map<String, String> response = Map.of("result", "true");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = Map.of("result", "false");
            return ResponseEntity.ok(response);
        }
    }

    // 특정 리뷰 리스트 조회
    @GetMapping("/list/{reviewListId}")
    public ResponseEntity<ReviewListDTO> getReviewListByReviewId(@PathVariable("reviewListId") Long reviewListId) {
        ReviewListDTO reviewListDTO = reviewListService.getReviewListWithReviewImages(reviewListId);
        if (reviewListDTO == null) {
            throw new RuntimeException("해당 리뷰 페이지를 찾을 수 없습니다.");
        }
        return ResponseEntity.ok(reviewListDTO);
    }

    // 모든 리뷰 리스트 조회(페이징) 삭제 포함
    @GetMapping("/listPageWithDelFlag")
    public ResponseEntity<Page<ReviewListDTO>> getReviewListPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ReviewListDTO> reviewListDTOPage = reviewListService.getReviewListPage(pageable);
        if (reviewListDTOPage == null || reviewListDTOPage.isEmpty()) {
            throw new RuntimeException("조회된 리뷰 페이지가 없습니다.");
        }
        return ResponseEntity.ok(reviewListDTOPage);
    }

    // 모든 리뷰 리스트 조회(페이징) 삭제 미포함
    @GetMapping("/listPage")
    public ResponseEntity<Page<ReviewListDTO>> getReviewListPageWithDelFlag(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ReviewListDTO> reviewListDTOPage = reviewListService.getReviewListPageWithDelFlag(pageable);
        if (reviewListDTOPage == null || reviewListDTOPage.isEmpty()) {
            throw new RuntimeException("조회된 리뷰 페이지가 없습니다.");
        }
        return ResponseEntity.ok(reviewListDTOPage);
    }

    // 특정 리뷰 리스트 수정
    @PutMapping("/edit")
    public ResponseEntity<ReviewListDTO> createReviewList(
            @RequestParam("memberId") Long memberId,
            @RequestParam("reviewListId") Long reviewListId,
            @RequestParam("title") String title,
            @RequestParam("writer") String writer,
            @RequestParam("content") String content,
            @RequestParam("score") int score,
            @RequestParam("delFlag") boolean delFlag,
            @RequestParam(value = "files", required = false) List<MultipartFile> files
    ) {
        ReviewListDTO reviewListDTO = new ReviewListDTO();
        reviewListDTO.setTitle(title);
        reviewListDTO.setWriter(writer);
        reviewListDTO.setContent(content);
        reviewListDTO.setScore(score);
        reviewListDTO.setDelFlag(delFlag);

        // 파일 처리
        if (files != null && !files.isEmpty()) {
            List<String> uploadFileNames = fileUtil.saveFiles(files);
            reviewListDTO.setUploadFileNames(uploadFileNames);
        }

        ReviewListDTO editedReviewListDTO = reviewListService.editReviewList(reviewListId, reviewListDTO, files);

        return ResponseEntity.ok(editedReviewListDTO);
    }

    // 특정 리뷰 리스트 삭제(논리적)
    @DeleteMapping("/{reviewListId}")
    public ResponseEntity<?> deleteReviewList(@PathVariable("reviewListId") Long reviewListId) {
        try {
            reviewListService.deleteReviewList(reviewListId);
            Map<String, String> response = Map.of("result", "success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = Map.of("result", "fail", "error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}
