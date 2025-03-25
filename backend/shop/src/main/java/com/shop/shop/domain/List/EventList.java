package com.shop.shop.domain.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventList {
    
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_list_id")
    private Long id;

    private String title;
    private String writer;

    @Lob
    private String content;

    private LocalDateTime date;
    private int viewCount;

    // image 외래키
    // OneToMany - 게시글 하나에 여러 이미지 가능
    // orphanRemoval = true - 게시글 삭제시 해당 게시글에 속해있는 이미지도 자동으로 삭제
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "event_id")
    @Builder.Default
    private List<EventImage> images = new ArrayList<>();

    // 이미지 추가
    public void addImage(EventImage image) {
        image.setOrd(this.images.size());
        this.images.add(image);
    }

    // 이미지 파일명 추가
    public void addImageString(String fileName){
        EventImage eventImage = EventImage.builder()
                .fileName(fileName)
                .build();
        addImage(eventImage);
    }

    // 이미지 삭제
    public void clearList() {
        this.images.clear();
    }

}
