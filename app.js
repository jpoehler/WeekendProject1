$(document).ready(function () {
  //This creates an event to push info from the form into an object
  $('#employeeForm').on('submit', submit);
  $('.employees').on('click', 'button', remove);
  });

//This builds objects
var totalMonthlySalary = 0;

function submit(event){
  event.preventDefault();
    //This strips the form and creates an object with the info in it
  var formEmployeeArray = $('#employeeForm').serializeArray();
  var employees = {};

  $.each(formEmployeeArray, function (i, field) {
      employees[field.name] = field.value;
    });

  //this clears out the form
  $('#employeeForm').find('input[type=text]').val(' ');

  appendDom(employees);
  totalMonthlySalary += parseInt(employees.annualsalary / 12);
  updateTotal();

  console.log(employees);
  console.log(formEmployeeArray);
}

//This appends objects to the DOM
function appendDom(employees) {
    $('.employees').append('<div></div>');

    var $el = $('.employees').children().last();

    $el.append('<p>Name: ' + employees.firstname + ' ' + employees.lastname + '</p>');
    $el.append('<p>Employee ID: #' + employees.idnumber + '</p>');
    $el.append('<p>Title: ' + employees.jobtitle + '</p>');
    $el.append('<p>Annual Salary: $' + employees.annualsalary + '</p>');
    $el.append('<p>Monthly Salary: $' + Math.round(employees.annualsalary / 12) + '</p>');
    //This adds the delete button to the employee's div
    $el.append('<button>Delete</button>');
    var $deleteButton = $el.find('button');
    var monthlySalary = parseInt(employees.annualsalary/12);
    $deleteButton.data('monthlySalary', monthlySalary);
  }

  //This removes employees from the DOM and removes their monthly salary from the running total
  function remove() {
    var $button = $(this);
    var monthlySalary = $button.data('monthlySalary');
    totalMonthlySalary -= monthlySalary;
    updateTotal();
    $button.parent().remove();
  }

  //This will show the monthly salary on the DOM
  function updateTotal() {
    $('h3 span').text(totalMonthlySalary);
  }
