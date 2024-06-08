package org.qs.todo;

import jakarta.inject.Inject;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.qs.todo.models.CreateTodo;
import org.qs.todo.models.Todo;

import java.util.List;

@Path("/todos")
@Produces(MediaType.APPLICATION_JSON)
public class TodoResource {

    @Inject
    TodoService todoService;

    @GET
    public List<Todo> listTodos(@QueryParam("status") String status) {
        return todoService.list(status);
    }

    @PATCH
    @Path("/{id}/complete")
    public Response complete(@PathParam("id") Long id) {
        boolean updated = Todo.complete(id);
        if (!updated) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }

    @PATCH
    @Path("/{id}/reopen")
    public Response reopen(@PathParam("id") Long id) {
        boolean updated = Todo.reopen(id);
        if (!updated) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }

    @POST
    public Response createTodo(CreateTodo todo) {
        todoService.create(todo);
        return Response.status(Response.Status.CREATED).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteTodo(@PathParam("id") Long id) {
        todoService.delete(id);
        return Response.noContent().build();
    }
}
