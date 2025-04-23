package com.shop.shop.service;

import com.shop.shop.dto.QnAListDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface QnAListService {

    public QnAListDTO createQnAList(QnAListDTO qnAListDTO);
    public Page<QnAListDTO> getAllQnAList(Pageable pageable);
    public QnAListDTO getQnAListByQnAListId(Long qnaListId);
    public QnAListDTO editQnAList(QnAListDTO qnAListDTO);
    public void deleteQnAList(QnAListDTO qnaListDTO);

}
