var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    console.log(list, arr);
    // then loop over sub-array
    console.log(arr)
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {

  localStorage.setItem("tasks", JSON.stringify(tasks));
};
// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});
  // task text was clicked
  $(".list-group").on("click", "p", function() {
    console.log(this);
    // get current text of p element
    var text = $(this)
      .text()
      .trim();
  
    // replace p element with a new textarea
    var textInput = $("<textarea>").addClass("form-control").val(text);
    $(this).replaceWith(textInput);
  
    // auto focus new element
    textInput.trigger("focus");
  });
  // an event to will exit focus the text area once the user interacts with another object
$('.list-group').on('blur',"textarea", function (){
  //collecting data to update the text area with the new input 
  // we need to collect data such as 
  //1- the current value of the textarea element 
  var text =$(this)
  .val()
  .trim();
  //2- get the parent id, in this case, the ul's id attribute
  var status = $(this)
  .closest('.list-group')//it will traverse up through it ancestors in the DOM to get class ="list-group" from the HTML  
  .attr('id')
  .replace('list-','');// this is not a jQuery method. it is reqular JS operators to find and replace text in a string. it will remove list from the text 
  //3-get the rlrment position in the list, in this case task position
  var index =$(this)
  .closest('.list-group-item')
  .index();
  // due to we don't know the values of the variables, we need to use the variable name as a placeholder to update the task object. 
  // it is important to update task object to update the localStorage by calling saveTasks
  tasks[status][index].text =text;
  //now we need to save the new tasks
  saveTasks()
  //we need to convert the textarea back to <p> to do that we need 
// 1- recreate p element 
  var taskP =$ ('<p>')
.addClass('m-1')
.text(text);
//2- replace textarea with p element 
$(this).replaceWith(taskP);

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
  
});
});



// load tasks for the first time
loadTasks();


