$(function () {
  const subjectsByProgram = {
    BSIS: ['Systems Analysis and Design', 'Web Development', 'Database Management', 'IT Project Management'],
    BSIT: ['Network Administration', 'Web Development', 'Database Management', 'Systems Integration'],
    BSCS: ['Data Structures and Algorithms', 'Web Development', 'Discrete Mathematics', 'Operating Systems']
  };

  const students = [];
  let current = null;

  function getAnnouncements(student) {
    return [
      'Enrollment ends this Friday.',
      'Orientation for ' + student.program + ' students is on Monday at 9:00 AM.',
      'Please check your subjects for this semester.'
    ];
  }

  function showMessage(text, type) {
    const alertBox = $('<div class="alert alert-dismissible fade show"></div>')
      .addClass('alert-' + type)
      .text(text);

    alertBox.append('<button type="button" class="btn-close" data-bs-dismiss="alert"></button>');
    $('#message').empty().append(alertBox);
  }

  function setState(input, isValid) {
    input.toggleClass('is-valid', isValid).toggleClass('is-invalid', !isValid);
  }

  function updateCards() {
    if (current === null) {
      $('#profileText').text('No profile yet. Register first.');
      $('#announceText').text('Register to see your announcements.');
      $('#subjectsText').text('Register to see your subjects.');
      return;
    }

    const student = students[current];
    $('#profileText').text('Welcome, ' + student.name + ' (' + student.program + ').');
    $('#announceText').text(getAnnouncements(student).length + ' announcements for ' + student.name + '.');
    $('#subjectsText').text(subjectsByProgram[student.program].length + ' subjects enrolled.');
  }

  function renderTable() {
    $('#studentList').empty();

    $.each(students, function (index, student) {
      const row = $('<tr></tr>');

      row.append($('<td></td>').text(student.name));
      row.append($('<td></td>').text(student.email));
      row.append($('<td></td>').text(student.program));
      row.append(
        '<td class="text-end text-nowrap">' +
        '<button class="btn btn-sm btn-outline-primary me-1 view-btn" data-index="' + index + '">View</button>' +
        '<button class="btn btn-sm btn-outline-danger remove-btn" data-index="' + index + '">Remove</button>' +
        '</td>'
      );

      if (index === current) {
        row.addClass('table-primary');
      }

      $('#studentList').append(row);
    });

    $('#tableBox').toggleClass('d-none', students.length === 0);
  }

  function refresh() {
    renderTable();
    updateCards();
  }

  function showInfo(type) {
    let title = '';
    let text = '';

    if (current === null) {
      title = 'Nothing yet';
      text = 'Please register first.';
    } else {
      const student = students[current];

      if (type === 'profile') {
        title = 'Profile';
        text = 'Name: ' + student.name + '\nEmail: ' + student.email + '\nProgram: ' + student.program;
      } else if (type === 'announcements') {
        title = 'Announcements';
        text = $.map(getAnnouncements(student), function (item) {
          return '• ' + item;
        }).join('\n');
      } else {
        title = 'Subjects';
        text = $.map(subjectsByProgram[student.program], function (item) {
          return '• ' + item;
        }).join('\n');
      }
    }

    $('#modalTitle').text(title);
    $('#modalText').text(text);

    if (typeof bootstrap === 'undefined') {
      alert(title + '\n\n' + text);
      return;
    }

    bootstrap.Modal.getOrCreateInstance($('#infoModal')[0]).show();
  }

  $('#registerForm').on('submit', function (e) {
    e.preventDefault();

    const nameInput = $('#name');
    const emailInput = $('#email');
    const name = $.trim(nameInput.val());
    const email = $.trim(emailInput.val());
    const nameOk = name.length >= 2;
    const emailOk = email !== '' && emailInput[0].checkValidity();

    setState(nameInput, nameOk);
    setState(emailInput, emailOk);

    if (!nameOk || !emailOk) {
      showMessage('Please fix the errors below.', 'danger');
      return;
    }

    const exists = students.some(function (student) {
      return student.email.toLowerCase() === email.toLowerCase();
    });

    if (exists) {
      showMessage('That email is already registered.', 'warning');
      return;
    }

    students.push({ name: name, email: email, program: $('#program').val() });
    current = students.length - 1;

    refresh();
    showMessage(name + ' was registered. Profile, announcements and subjects are ready.', 'success');
    this.reset();
    nameInput.removeClass('is-valid is-invalid');
    emailInput.removeClass('is-valid is-invalid');
  });

  $('#studentList').on('click', '.view-btn', function () {
    current = Number($(this).data('index'));
    refresh();
    showMessage('Now showing ' + students[current].name + '.', 'info');
  });

  $('#studentList').on('click', '.remove-btn', function () {
    students.splice(Number($(this).data('index')), 1);
    current = students.length > 0 ? students.length - 1 : null;
    refresh();
  });

  $('.card-btn').on('click', function (e) {
    e.preventDefault();
    showInfo($(this).data('type'));
  });

  $('.nav-link').on('click', function () {
    if (typeof bootstrap !== 'undefined') {
      bootstrap.Collapse.getOrCreateInstance($('#mainNav')[0], { toggle: false }).hide();
    }
  });
});
