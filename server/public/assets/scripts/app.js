$(document).ready(function () {
  //This creates an event to push info from the form into an object
  $('#employeeForm').on('submit', postEmployees);
  //$('.employees').on('click', 'button', remove);
  });

//This builds objects
var totalMonthlySalary = 0;

function postEmployees(event){
  event.preventDefault();

  var formData = {};
  console.log('form data', formData);

  var formArray = $('#employeeForm').serializeArray();
  $.each(formArray, function(index, element){
    formData[element.name] = element.value;
  });

  $.ajax({
    type:'POST',
    url: '/employees',
    data: formData,
    success: getEmployees
  });
  $('#employeeForm').trigger('reset');

  function getEmployees() {
  $.ajax({
    type: 'GET',
    url: '/employees',
    success: employeeAppendDom
  });
}
function employeeAppendDom(employeeArray){
  console.log('inside appendDom after GET call', employeeArray);
  for(var i = 0; i < employeeArray.length; i++){
  $('.employees').append('<li>'+ employeeArray[i].first_name + ' ' + employeeArray[i].last_name+'</li>')
 }
  //appendSelectEmployee(employeeArray);
}
}

// function appendSelectEmployee(employeeArray){
//   for(var i = 0; i < employeeArray.length; i++){
//   $('.employees').append('<option>' + employeeArray[i].first_name + ' ' + employeeArray[i].last_name+'</option>');
  //}
//}

  //This will show the monthly salary on the DOM
  // function updateTotal() {
  //   $('h3 span').text(totalMonthlySalary);
  //
