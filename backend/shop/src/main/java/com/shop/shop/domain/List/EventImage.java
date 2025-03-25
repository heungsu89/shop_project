package com.shop.shop.domain.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventImage {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_image_id")
    private Long id;

    private String fileName;

    @Setter
    private int ord;

    @Column(name = "event_id")
    private Long eventId;

}
