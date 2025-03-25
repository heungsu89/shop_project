package com.shop.shop.domain.item;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Item {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long id;

    private String name;
    private int price;
    private int stockQty;

    // DB text 자료형으로 저장
    @Lob
    private String description;

    private float totalScore;

    private boolean delFlag;

    // 아이템 옵션
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "item_id")
    @Builder.Default
    private List<ItemOption> options = new ArrayList<>();

    // 아이템 이미지
    // 저장, 병합(수장), 삭제
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "item_id")
    @Builder.Default
    private List<ItemImage> images = new ArrayList<>();

    // 아이템 인포
    @ElementCollection
    @CollectionTable(name = "item_info", joinColumns = @JoinColumn(name = "item_id"))
    @Builder.Default
    private List<ItemInfo> info = new ArrayList<>();

    // 재고 증가
    public void addStock(int qty){
        this.stockQty += qty;
    }

    // 재고 삭제
    public void removeStock(int qty) throws Exception {
        int remainingStock = this.stockQty - qty;
        if(remainingStock < 0){
            throw new Exception("need more stock");
        }
        this.stockQty = remainingStock;
    }

    // 이미지 추가
    public void addImage(ItemImage image) {
        image.setOrd(this.images.size());
        this.images.add(image);
    }

    // 인포 추가
    public  void addInfo(ItemInfo info){
        this.info.add(info);
    }

    // 옵션 추가
    public  void addOption(ItemOption option){
        this.options.add(option);
    }

    // 이미지 파일명 추가
    public void addImageString(String fileName){
        ItemImage itemImage = ItemImage.builder()
                .fileName(fileName)
                .build();
        addImage(itemImage);
    }

    // 이미지 삭제
    public void clearList() {
        this.images.clear();
    }

    // 변경 메서드
    public void changeName(String name) {
        this.name = name;
    }

    public void changePrice(int price) {
        this.price = price;
    }

    public void changeStockQty(int stockQty) {
        this.stockQty = stockQty;
    }

    public void changeDelFlag(boolean delFlag) {
        this.delFlag = delFlag;
    }

}
