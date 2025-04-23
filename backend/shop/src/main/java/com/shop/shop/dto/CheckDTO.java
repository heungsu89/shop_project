package com.shop.shop.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CheckDTO {

    private Long ReviewId;
    private Long CartId;
    private Long WishId;
    private Long itemId;
    private Long memberId;

}
