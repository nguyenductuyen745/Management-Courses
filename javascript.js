var courseApi = 'https://5f9c17a7856f4c00168c6cee.mockapi.io/courses/';

function start(handleAdd) {

    renderCourses()        // Nếu ko làm như này thì các list-group-item chưa đc thêm vào mà ở hàm handleDeleteCourse đã chọc vào DOM để lấy các btn ở trong DOM => lúc handleDeleteCourse chọc vào thì chưa có các btn
        .then(function() {      // Cho nên phải làm cho cái hàm renderCourses chạy xong(và các phần tử đc thêm vào hết) thì hàm handleDeleteCourse mới đc chạy
            handleDeleteCourse();      // còn 1 cách khác là dùng async và await cho function start
            handleRepairCourse();
        });
    if(!handleAdd)
        handleAddCourse();
}

start();
var courseRepairId;

async function renderCourses() {
    var coursesData = await (await fetch(courseApi)).json();
    var listGroup = document.querySelector('.list-group');

    var arrCourses = coursesData.map(function(currentValue, currentIndex) {
        return `<div class="list-group-item d-flex" data-target="#collapse-${currentValue['id']}" data-toggle="collapse"><span>${currentValue['name']}</span> <button data-parentId='${currentValue['id']}' class="btn btn-sm btn-outline-info ml-auto course-item-repair">Sửa</button> <button data-parentId='${currentValue['id']}' class="btn btn-sm btn-danger ml-3 course-item-delete">Xóa</button></div><div class="collapse px-5" id="collapse-${currentValue['id']}">${currentValue['description']}</div>`
    })

    listGroup.innerHTML = arrCourses.join('');

}

function handleAddCourse() {
    var inputNameCourse = document.querySelector('input[name="name"]');
    var inputDescriptCourse = document.querySelector('input[name="description"]');
    var btnAddition = document.querySelector('#add');

    btnAddition.addEventListener('click', function(event) {

        if(inputNameCourse.value && inputDescriptCourse.value) {
            var newCourseData = {
                name: inputNameCourse.value,
                description: inputDescriptCourse.value
            };

            if(!btnAddition.getAttribute('data-repair')) {
    
                fetch(courseApi, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newCourseData)
                })
                    .then(function() {
                        alert('Thêm Khóa Học Thành Công!');
                        start(true);
                        inputNameCourse.value = inputDescriptCourse.value = '';
                    });
            }
                // Phần Update
            else {
                fetch(courseApi + courseRepairId, {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(newCourseData)
                })
                    .then(function() {
                        alert('Khóa học đã được sửa!');
                        start(true);
                        inputNameCourse.value = inputDescriptCourse.value = '';
                        btnAddition.innerText = "Thêm";
                        btnAddition.removeAttribute('data-repair');
                    })
                    .catch(function() {
                        alert('Khóa học chưa được Sửa. Vui lòng kiểm tra lại!');
                    })
            }
        }
    })
}

function handleRepairCourse() {
    var btnAddition = document.querySelector('#add');
    var inputNameCourse = document.querySelector('input[name="name"]');
    var inputDescriptCourse = document.querySelector('input[name="description"]');
    var btnRepairElements = document.querySelectorAll('.course-item-repair');
    
    for(var item of btnRepairElements) {
        item.addEventListener('click', function(event) {
            courseRepairId = event.target.getAttribute('data-parentid');
            inputNameCourse.value = event.target.parentElement.querySelector('span').innerText;
            inputDescriptCourse.value = event.target.parentElement.nextElementSibling.innerText;

            btnAddition.setAttribute('data-repair', 'true');
            btnAddition.innerText = "Update";
        });
    }
}

function handleDeleteCourse() {
    var btnDeleteElements = document.querySelectorAll('.course-item-delete');

    for(var item of btnDeleteElements) {
        item.addEventListener('click', function(event) {
            var currentId = event.target.dataset['parentid'];
            fetch(courseApi + currentId, {
                method: 'DELETE'
            });

            event.target.parentElement.nextElementSibling.remove();
            event.target.parentElement.remove();
        });
    }
}
