package com.example.demo.repository;

import com.example.demo.model.BookReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookReviewRepository extends JpaRepository<BookReview, Long> {
    @Query("SELECT r FROM BookReview r WHERE LOWER(r.title) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(r.review) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<BookReview> search(@Param("q") String q);
}
