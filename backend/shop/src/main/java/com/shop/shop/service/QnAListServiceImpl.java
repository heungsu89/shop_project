package com.shop.shop.service;

import com.shop.shop.domain.item.Item;
import com.shop.shop.domain.list.QnAList;
import com.shop.shop.domain.list.QnAListStatus;
import com.shop.shop.domain.member.Member;
import com.shop.shop.dto.QnAListDTO;
import com.shop.shop.repository.ItemRepository;
import com.shop.shop.repository.MemberRepository;
import com.shop.shop.repository.QnAListRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Log4j2
public class QnAListServiceImpl implements QnAListService {

    private final QnAListRepository qnAListRepository;
    private final MemberRepository memberRepository;
    private final ItemRepository itemRepository;

    // 질의응답 리스트 등록
    @Override
    public QnAListDTO createQnAList(QnAListDTO qnAListDTO) {
        Member member = memberRepository.findById(qnAListDTO.getMemberId()).orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));
        Item item = itemRepository.findById(qnAListDTO.getItemId()).orElseThrow(() -> new RuntimeException("해당 상품을 찾을 수 없습니다."));

        QnAList qnAList = QnAList.builder()
                .title(qnAListDTO.getTitle())
                .writer(qnAListDTO.getWriter())
                .date(LocalDateTime.now())
                .content(qnAListDTO.getContent())
                .item(item)
                .member(member)
                .qnAListStatus(qnAListDTO.getQnAListStatus())
                .build();

        if (qnAListDTO.getParentId() != null) {
            QnAList parentQnAList = qnAListRepository.findById(qnAListDTO.getParentId()).orElseThrow(() -> new RuntimeException("해당 질의응답을 찾을 수 없습니다."));
            qnAList.changeParent(parentQnAList);
        }

        QnAList savedQnAList = qnAListRepository.save(qnAList);

        return new QnAListDTO(savedQnAList);
    }

    // 질의응답 리스트 모두 조회(페이징)
    @Override
    public Page<QnAListDTO> getAllQnAList(Pageable pageable) {
        return null;
    }

    // 질의응답Id를 기준으로 조회
    @Override
    public QnAListDTO getQnAListByQnAListId(Long qnaListId) {
        return null;
    }

    // 질의응답 수정
    @Override
    public QnAListDTO editQnAList(QnAListDTO qnAListDTO) {
        return null;
    }

    // 특정 질의응답 리스트 삭제(논리적 삭제)
    @Override
    public void deleteQnAList(QnAListDTO qnaListDTO) {
        QnAList qnAList = qnAListRepository.findById(qnaListDTO.getQnaListId()).orElseThrow(() -> new RuntimeException("해당 질의응답 리스트를 찾을 수 없습니다."));

        qnAList.changeDelFlag(true);
        qnAListRepository.save(qnAList);
    }
}
