$(document).ready(function() {
    // Fetch the todos from the API
    $.ajax({
        url: 'http://localhost:8080/todos',
        method: 'GET',
        success: function(todos) {
            displayTodos(todos);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('There was a problem with the fetch operation:', textStatus, errorThrown);
        }
    });

    function parse(rawDate) {
        if (!rawDate || rawDate.trim() === '') {
            return '';
        }
        const date = new Date(rawDate);

        const options = {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        };

        return new Intl.DateTimeFormat('en-GB', options).format(date);
    }

    function displayTodos(todos) {
        const todoList = $('#todos-container');
        todoList.empty(); // Clear any existing content

        todos.forEach(todo => {
            const todoItem = $(`
            <div class="row px-3 align-items-center todo-item rounded">
                <div class="col-auto m-1 p-0 d-flex align-items-center">
                    <h2 class="m-0 p-0 todos-actions">
                        <i class="fa text-primary btn m-0 p-0 complete-btn ${todo.completed ? 'fa-check-square-o' : 'fa-square-o'}" data-toggle="tooltip" data-placement="bottom" title="Mark as complete" data-todo-id="${todo.id}"></i>
                    </h2>
                </div>

                <div class="col px-1 m-1 d-flex align-items-center">
                    <input type="text" class="form-control form-control-lg border-0 edit-todo-input bg-transparent rounded px-3" readonly value="${todo.title}" title="${todo.title}" />
                    <input type="text" class="form-control form-control-lg border-0 edit-todo-input rounded px-3 d-none" value="${todo.title}" />
                </div>

                <div class="col-auto m-1 p-0 px-3 d-none">
                </div>
                
                <div class="col-auto m-1 p-0 px-3 ${todo.dueDate ? '' : 'd-none'}">
                    <div class="row">
                        <div class="col-auto d-flex align-items-center rounded bg-white border border-warning">
                            <i class="fa fa-hourglass-2 my-2 px-2 text-warning btn" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Due on date"></i>
                            <h6 class="text my-2 pr-2">${parse(todo.dueDate)}</h6>
                        </div>
                    </div>
                </div>
                
                <div class="col-auto m-1 p-0 todo-actions">
                    <div class="row d-flex align-items-center justify-content-end">
                        <h5 class="m-0 p-0 px-2">
                            <i class="fa fa-pencil text-info btn m-0 p-0" data-toggle="tooltip" data-placement="bottom" title="Edit todo"></i>
                        </h5>
                        <h5 class="m-0 p-0 px-2">
                            <i class="fa fa-trash-o text-danger btn m-0 p-0" data-toggle="tooltip" data-placement="bottom" title="Delete todo" data-todo-id="${todo.id}"></i>
                        </h5>
                    </div>

                    <div class="row todo-created-info">
                        <div class="col-auto d-flex align-items-center pr-2">
                            <i class="fa fa-info-circle my-2 px-2 text-black-50 btn" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Created date"></i>
                            <label class="date-label my-2 text-black-50">28th Jun 2020</label>
                        </div>
                    </div>
                </div>
            </div>
                    `);
            todoList.append(todoItem);
        });
    }

    $('#todos-container').on('click', '.complete-btn', function() {
        const todoItem = $(this);
        const todoId = $(this).attr('data-todo-id');
        const isCompleted = todoItem.hasClass('fa-check-square-o');

        if (isCompleted) {
            todoItem.addClass('fa-square-o');
            todoItem.removeClass('fa-check-square-o');
        } else {
            todoItem.removeClass('fa-square-o');
            todoItem.addClass('fa-check-square-o');
        }

        $.ajax({
            url: `http://localhost:8080/todos/${todoId}/` + (isCompleted ? 'reopen' : 'complete'),
            method: 'PATCH',
            contentType: 'application/json',
            success: function(response) {
                console.log('Todo updated successfully:', response);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error updating todo:', textStatus, errorThrown);
            }
        });
    });

    $('.custom-select').change(function() {
        displayFilteredTodo();
    });

    function displayFilteredTodo() {
        const selectedOption = $('.custom-select').val();
        $.ajax({
            url: `http://localhost:8080/todos?status=${selectedOption}`,
            method: 'GET',
            contentType: 'application/json',
            success: function(todos) {
                displayTodos(todos);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error updating todo:', textStatus, errorThrown);
            }
        });
    }

    function formatDate(date) {
        return (
            date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            "/" +
            date.getFullYear()
        );
    }

    $(".due-date-button").on("click", function (event) {
        $(".due-date-button")
            .datepicker("show")
            .on("changeDate", function (dateChangeEvent) {
                $(".due-date-button").datepicker("hide");
                $(".due-date-label").text(formatDate(dateChangeEvent.date));
                $(".due-date-label").removeClass('d-none')
                $(".clear-due-date-button").removeClass('d-none')
            });
    });

    $(".clear-due-date-button").on("click", function (event) {
        clearDateFiled();
    });

    function clearDateFiled() {
        $(".due-date-label").text('');
        $(".due-date-label").addClass('d-none')
        $(".clear-due-date-button").addClass('d-none')
    }

    $('.add-todo-input').on('input', function () {
        if ($(this).val().trim() === '') {
            $('.btn-primary').prop('disabled', true);
            console.log('ok')
        } else {
            $('.btn-primary').prop('disabled', false);
        }
    });


    $(".btn-primary").on("click", function (event) {
        const dueDate = $(".due-date-label").text();
        const todoText = $(".add-todo-input").val();
        $.ajax({
            url: `http://localhost:8080/todos`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ title: todoText,  dueDate: dueDate}),
            success: function() {
                clearDateFiled();
                $('.add-todo-input').val('');
                displayFilteredTodo();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error updating todo:', textStatus, errorThrown);
            }
        });
    });

    $('#todos-container').on('click', '.text-danger', function () {
        const todoId = $(this).attr('data-todo-id');

        $.ajax({
            url: `http://localhost:8080/todos/${todoId}/`,
            method: 'DELETE',
            contentType: 'application/json',
            success: function() {
                displayFilteredTodo();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error deleting todo:', textStatus, errorThrown);
            }
        });
    });
});