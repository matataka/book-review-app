package com.example.demo.controller;

import com.example.demo.model.BookReview;
import com.example.demo.repository.BookReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class BookReviewController {
    @Autowired
    private BookReviewRepository repository;

    @GetMapping
    public List<BookReview> getAll(@RequestParam(value = "q", required = false) String q) {
        if (q != null && !q.isBlank()) {
            return repository.search(q);
        }
        return repository.findAll();
    }

    @PostMapping
    public BookReview create(@RequestBody BookReview review) {
        return repository.save(review);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }

    @PutMapping("/{id}")
    public BookReview update(@PathVariable Long id, @RequestBody BookReview review) {
        return repository.findById(id).map(r -> {
            r.setTitle(review.getTitle());
            r.setReview(review.getReview());
            // updatedAtはエンティティの@PreUpdateで自動更新
            return repository.save(r);
        }).orElseThrow();
    }
}
