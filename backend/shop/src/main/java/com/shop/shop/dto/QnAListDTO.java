package com.shop.shop.dto;

import com.shop.shop.domain.list.QnAList;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QnAListDTO {

    private Long qnaListId;
    private String title;
    private String writer;
    private LocalDateTime date;
//    private boolean answer;
    private String content;
    private Long parentId;
    private Long memberId;
    private Long itemId;

    public QnAListDTO(QnAList qnAList) {
        this.qnaListId = qnAList.getId();
        this.title = qnAList.getTitle();
        this.writer = qnAList.getWriter();
        this.date = qnAList.getDate();
//        this.answer = qnAList.isAnswer();
        this.content = qnAList.getContent();
        this.parentId = qnAList.getParent().getId();
        this.memberId = qnAList.getMember().getId();
        this.itemId = qnAList.getItem().getId();
    }

}
