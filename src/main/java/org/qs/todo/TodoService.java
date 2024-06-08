package org.qs.todo;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import org.qs.todo.models.CreateTodo;
import org.qs.todo.models.Todo;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@ApplicationScoped
public class TodoService {

    private static DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("d/M/yyyy");


    public List<Todo> list(String rawStatus) {
        Status status = Status.fromRaw(rawStatus);
        return switch (status) {
            case ACTIVE -> Todo.listActives();
            case COMPLETED -> Todo.listCompleted();
            case HAS_DUE_DATE -> Todo.hasDueDate();
            default -> Todo.listAll();
        };
    }

    @Transactional
    public void create(CreateTodo todo) {
        Todo toSave = new Todo();
        toSave.createdAt = LocalDateTime.now();
        toSave.dueDate = toDate(todo.getDueDate());
        toSave.title = todo.getTitle();
        toSave.persist();
    }

    @Transactional
    public boolean delete(Long todoId) {
        Todo todoToDelete = Todo.findById(todoId);
        if (todoToDelete != null) {
            todoToDelete.delete();
            return true;
        }
        return false;
    }


    public enum Status {
        ALL, COMPLETED, ACTIVE, HAS_DUE_DATE;

        public static Status fromRaw(String status) {
            if (status == null) {
                return ALL;
            }
            try {
                return valueOf(status);
            } catch (IllegalArgumentException e) {
                return ALL;
            }
        }
    }

    private LocalDateTime toDate(String dueDate) {
        if (dueDate == null || dueDate.isEmpty()) {
            return null;
        }
        LocalDate localDate = LocalDate.parse(dueDate, FORMATTER);
        return localDate.atStartOfDay();
    }

}
