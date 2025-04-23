package com.shop.shop.repository;

import com.shop.shop.domain.list.QnAList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QnAListRepository extends JpaRepository<QnAList, Long> {
}
