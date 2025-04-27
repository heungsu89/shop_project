package com.shop.shop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ScoreListDTO {

    private Long scoreId;
    private int score;
    private Long memberId;
    private Long itemId;

}
