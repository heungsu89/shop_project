package com.shop.shop.service;

import com.shop.shop.dto.QnAListDTO;
import com.shop.shop.repository.QnAListRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class QnAListServiceImpl implements QnAListService {

    private final QnAListRepository qnAListRepository;

    // 질의응답 리스트 등록
    @Override
    public QnAListDTO createQnAList(QnAListDTO qnAListDTO) {
        return null;
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

    // 특정 질의응답 리스트 삭제
    @Override
    public void deleteQnAList(QnAListDTO qnaListDTO) {

    }
}
