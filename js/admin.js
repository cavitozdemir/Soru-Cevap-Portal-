var uyeSayisi = 10;
var Student = function (n, fname, sname, e1, e2, less) {
    this.number = n;
    this.first_name = fname;
    this.second_name = sname;
    this.exam1 = e1;
    this.exam2 = e2;
    this.score = (parseInt(e1) + parseInt(e2)) / 2;
    this.lesson = less;
};

var editStudentSelector = "#edit-student";
var removeStudentSelector = "#remove-student";

jQuery.fn.extend({
    progressBar: function (id, progress) {
        $(this).html("<div class='progress' id='" + id + "'><div class='progress-bar' style='width: " + progress + "%'></div></div>")
    },

    addStudent: function (student) {
        $(this).find("tbody").append(
            "<tr class='" + student.lesson + "-color'>" +
            "<td><input type='checkbox'></td>" +
            "<td class='info-id' id='" + student.number + "'>" + student.number + "</td>" +
            "<td>" + student.first_name + "</td>" +
            "<td>" + student.second_name + "</td>" +
            "<td>" + student.exam1 + "</td>" +
            "<td>" + student.exam2 + "</td>" +
            "<td>" + student.score + "</td>" +
            "</tr>"
        );
    },

    clearStudents: function () {
        $(this).find("tbody").html("");
    },

    addStudents: function (students) {
        var self = $(this);
        for (var v of students) {
            self.addStudent(v);
        }

        $("#students-info tbody tr td").click(function (e) {
            var self = $(this);
            onStudentClicked(self.parents("tr").find("input[type='checkbox']"));
        });
    },

    removeCheckedStudents: function () {
        var els = $(this).find("tbody input[type='checkbox']:checked");
        if (els.length == 0) return;

        var tr = els.parents("tr");
        var id = tr.find(".info-id").attr("id");

        tr.each(function (index, value) {
            var id = $(value).find(".info-id").attr("id");
            students = students.filter(function (student) {
                return student.number != id;
            });
        });

        tr.remove();

        $("table.table thead input[type='checkbox']").prop("checked", false);

        $(this).updateControlsState();

        updateStatistics();
        updateProgressBars();
    },

    updateControlsState: function () {
        var editButton = $(editStudentSelector);
        var removeButton = $(removeStudentSelector);

        var table = $(this);
        var inputs = table.find("tbody input[type='checkbox']");
        if (inputs.length == 0) return;

        var notCheckedCount = inputs.not(":checked").length;

        if ((inputs.length - notCheckedCount) == 0) {
            removeButton.attr("disabled", true);
        } else {
            removeButton.attr("disabled", false);
        }

        if ((inputs.length - notCheckedCount) > 1 || (inputs.length - notCheckedCount) == 0) {
            editButton.attr("disabled", true);
        } else {
            editButton.attr("disabled", false);
        }
    }
});

var students = [
    new Student("-", "-", "-",0, 0, ),
   
];

var groupsStatistics = new Map();
var averageScoreStatistics = new Map();

function updateStatistics() {
    var tmpGroups = new Map();
    var tmpAverage = new Map();

    for (var v of students) {
        if (!tmpGroups.has(v.lesson)) {
            tmpGroups.set(v.lesson, 1);
        } else {
            tmpGroups.set(v.lesson, tmpGroups.get(v.lesson) + 1);
        }

        if (!tmpAverage.has(v.lesson)) {
            tmpAverage.set(v.lesson, v.score);
        } else {
            var current = tmpAverage.get(v.lesson);
            tmpAverage.set(v.lesson, (v.score + current) / tmpGroups.get(v.lesson));
        }
    }

    for (var [key, value] of groupsStatistics) {
        if (!tmpGroups.has(key)) {
            tmpGroups.set(key, 0);
        }
    }

    for (var [key, value] of averageScoreStatistics) {
        if (!tmpAverage.has(key)) {
            tmpAverage.set(key, 0);
        }
    }

    console.log(tmpGroups);
    console.log(tmpAverage);

    groupsStatistics = tmpGroups;
    averageScoreStatistics = tmpAverage;
}

function initializeProgressBars() {
    $(".pr-bar").progressBar("", 0);
    updateProgressBars();
}

function updateProgressBars() {
    for (var [key, val] of groupsStatistics) {
        var gs = $("#" + key + "-statistic .pr-bar .progress-bar");
        gs.addClass(key + "-color");
        gs.width((val / uyeSayisi) * 100 + "%");
        gs.html(val);
    }

    for (var [key, val] of averageScoreStatistics) {
        var as = $("#" + key + "-average .pr-bar .progress-bar");
        as.addClass(key + "-color");
        as.width(val + "%");
        as.html(val)
    }
}

function updateStudents() {
    $("#students-info").clearStudents();
    $("#students-info").addStudents(students);
    $("#students-info").updateControlsState();
}

function showEditWindow(student) {
    var editWindow = $("#edit-window");

    editWindow.show();
    editWindow.find(".edit-block").slideDown(300);
    editWindow.find(".selected-lesson").removeClass("selected-lesson");

    $("#edit-window #edit-number").val(student.number);
    $("#edit-window #edit-name").val(student.first_name);
    $("#edit-window #edit-surname").val(student.second_name);
    $("#edit-window #edit-exam1").val(student.exam1);
    $("#edit-window #edit-exam2").val(student.exam2);
    $("#edit-window #edit-lesson-chooser #edit-" + student.lesson).addClass("selected-lesson");

    $("body").addClass("modal-open");
    $("#main-menu").animate({ "top": "-=50px" }, 200);
}

function hideEditWindow() {
    var editWindow = $("#edit-window");

    editWindow.find(".edit-block").slideUp(300, function () {
        editWindow.hide();
        $("body").removeClass("modal-open");
    });

    $("#main-menu").animate({ "top": "+=50px" }, 200);
}

function collectEditData() {
    var student = new Student();
    student.number = $("#edit-window #edit-number").val();
    student.first_name = $("#edit-window #edit-name").val();
    student.second_name = $("#edit-window #edit-surname").val();
    student.exam1 = parseInt($("#edit-window #edit-exam1").val());
    student.exam2 = parseInt($("#edit-window #edit-exam2").val());
    student.score = (student.exam1 + student.exam2) / 2;
    student.lesson = $("#edit-window #edit-lesson-chooser .selected-lesson").attr("id").replace("edit-", "");

    return student;
}

function showAddWindow() {
    var addWindow = $("#add-window");

    addWindow.show();
    addWindow.find(".edit-block").slideDown(300);
    addWindow.find(".selected-lesson").removeClass("selected-lesson");
    addWindow.find(".selected-lesson").removeClass("selected-lesson");

    $("#add-window #add-lesson-chooser #add-math").addClass("selected-lesson");

    addWindow.find("input").val("");
    addWindow.find(".btn-success").prop("disabled", true);

    $("body").addClass("modal-open");
    $("#main-menu").animate({ "top": "-=50px" }, 200);
}

function hideAddWindow() {
    var addWindow = $("#add-window");

    addWindow.find(".edit-block").slideUp(300, function () {
        addWindow.hide();
        $("body").removeClass("modal-open");
    });

    $("#main-menu").animate({ "top": "+=50px" }, 200);
}

function collectAddData() {
    var student = new Student();
    student.number = $("#add-window #add-number").val();
    student.first_name = $("#add-window #add-name").val();
    student.second_name = $("#add-window #add-surname").val();
    student.exam1 = parseInt($("#add-window #add-exam1").val());
    student.exam2 = parseInt($("#add-window #add-exam2").val());
    student.score = (student.exam1 + student.exam2) / 2;
    student.lesson = $("#add-window #add-lesson-chooser .selected-lesson").attr("id").replace("add-", "");

    return student;
}

function onStudentClicked(self) {
    var table = self.parents("table.table");
    var inputs = table.find("tbody input[type='checkbox']");
    var notCheckedCount = inputs.not(":checked").length;
    var allChecked = (notCheckedCount == 0);

    self.prop("checked", !self.prop("checked"))

    table.updateControlsState();

    if (allChecked) $("table.table thead input[type='checkbox']").prop("checked", true);
}

// DECLARATIONS END

updateStatistics();

// Main
$(function () {
    initializeProgressBars();

    var selectedStudentInfo;

    $("#students-info").addStudents(students);

    $("#students-info tbody tr").contextmenu(function (e) {
        e.preventDefault();
        var cmenu = $("#edit-context-menu");
        cmenu.css({ top: e.pageY, left: e.pageX + 15 });
        cmenu.hide();
        cmenu.slideDown();

        selectedStudentInfo = $(this);
    });

    $("body").click(function () {
        $("#edit-context-menu").hide();
    });

    $("#sort a").click(function (e) {
        e.stopPropagation();
        e.preventDefault();

        var self = $(this);
        var radio = self.find("input[type='radio']");

        if (radio.attr("name") == "sort-by") {
            $("#sort input[name='sort-by']:checked").prop("checked", false)
        } else if (radio.attr("name") == "sort-order") {
            $("#sort input[name='sort-order']:checked").prop("checked", false);
        }

        radio.prop("checked", true);

        var sortBy = $("#sort").find("input[name='sort-by']:checked").val();
        var asc = $("#sort").find("input[name='sort-order']:checked").val() == "asc";

        students.sort(function (a, b) {
            return asc ? (a[sortBy] > b[sortBy] ? 1 : -1) : (a[sortBy] < b[sortBy] ? 1 : -1)
        });

        updateStudents();
    });

    $("table.table thead input").click(function (e) {
        var self = $(this);
        var table = self.parents("table.table");

        table.find("tbody input[type='checkbox']").prop("checked", self.prop("checked"));

        table.updateControlsState();
    });

    $("table.table tbody input[type='checkbox']").click(function (e) {
        var self = $(this);
        onStudentClicked(self);
    });

    $("#remove-student").click(function (e) {
        var table = $($(this).attr("aria-controls"));
        table.removeCheckedStudents();
    });

    $("#remove-student-context").click(function (e) {
        if (selectedStudentInfo == null) return;

        var table = $($(this).attr("aria-controls"));
        var id = selectedStudentInfo.find(".info-id").attr("id");

        students = students.filter(function (student) {
            return student.number != id;
        });

        selectedStudentInfo.remove();
        selectedStudentInfo = null;

        updateStatistics();
        updateProgressBars();
    });

    $("#edit-lesson-chooser button").click(function () {
        $("#edit-lesson-chooser .selected-lesson").removeClass("selected-lesson");
        $(this).addClass("selected-lesson");
    });

    $("#add-lesson-chooser button").click(function () {
        $("#add-lesson-chooser .selected-lesson").removeClass("selected-lesson");
        $(this).addClass("selected-lesson");
    });

    $("#edit-window .btn-danger").click(function () {
        hideEditWindow();
    });

    $("#edit-window .btn-success").click(function () {
        var editData = collectEditData();

        for (var i = 0; i < students.length; i++) {
            if (students[i].number == editData.number) {
                students[i] = editData;
                break;
            }
        }

        updateStudents();
        updateStatistics();
        updateProgressBars();

        hideEditWindow();
    });

    $("#edit-student").click(function (e) {
        var e = $("#students-info tbody tr td input[type='checkbox']:checked");
        var number = e.parents("tr").find(".info-id").attr("id");

        var student = students.find(function (e) { return e.number == number });

        showEditWindow(student);
    });

    $("#add-student").click(function (e) {
        showAddWindow();
    });

    $("#add-window input").keyup(function () {
        var inputs = $("#add-window input");
        var buttonOk = $("#add-window .btn-success");
        buttonOk.prop("disabled", false);

        for (var input of inputs) {
            var v = $(input).val();
            if (!v || $.trim(v).length == 0) {
                buttonOk.prop("disabled", true);
                return;
            }
        }
    });

    $("#add-window .btn-success").click(function () {
        students.push(collectAddData());

        updateStudents();
        updateStatistics();
        updateProgressBars();

        hideAddWindow();
    });

    $("#add-window .btn-danger").click(function (e) {
        hideAddWindow();
    });
});