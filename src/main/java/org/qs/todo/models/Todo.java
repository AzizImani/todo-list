package org.qs.todo.models;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Todo extends PanacheEntity {
    public String title;
    public String url;
    public boolean completed;
    @Column(name = "priority")
    public int priority;
    public LocalDateTime dueDate;
    public LocalDateTime createdAt;

    @Transactional
    public static boolean complete(Long id) {
        return updateCompleted(id, true);
    }

    @Transactional
    public static boolean reopen(Long id) {
        return updateCompleted(id, false);
    }

    public static List<Todo> listActives() {
        return list("completed", false);
    }

    public static List<Todo> listCompleted() {
        return list("completed", true);
    }

    public static List<Todo> hasDueDate() {
        return list("dueDate IS NOT NULL");
    }

    public static List<Todo> listAll() {
        return list("order by completed asc, dueDate asc");
    }

    private static boolean updateCompleted(Long id, boolean completed) {
        Todo todo = findById(id);
        if (todo == null) {
            return false;
        }
        todo.completed = completed;
        todo.persist();
        return true;
    }
}
