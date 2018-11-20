let host = "http://localhost:8080"

$(document).ready(function() {
    $.getJSON(host + "/daily", showResults);
});

$("#search").submit(function(event) {
    let q = event.currentTarget[0].value;
    if (q.length > 0) {
        gotoPage(q, 1)
    }
    event.preventDefault();
});

function gotoPage(query, page) {
    if (page > 0) {
        $.getJSON(host + "/search?q=" + query + "&p=" + page, showSearchResults);
    }
}

function gotoReference(query, title) {
    if (query.length > 0) {
        $.getJSON(host + "/refs?q=" + query, function(data) {
            showRefsResults(data, title);
        });
    }
}

function showResults(data) {
    $("#content").empty();
    $("#bottom").empty();
    $("#content").addClass("row");
    data["results"].forEach(function(entry) {
        let verses = entry["texts"];
        let title = entry["reference"]["title"];
        let alt = entry["reference"]["alt"];
        formatVerses(verses, title, alt, 'col-xs-2 col-md-6');
    });
}

function showSearchResults(data) {
    $("#content").empty();
    $("#bottom").empty();
    $("#content").addClass("row");
    let meta = data["meta"];
    let page = meta["page"];
    let results = data["results"];
    formatVerses(results, null, null, 'col-xs-2 col-md-6', meta["text"]);
    if (meta["total"] == 0) {
        $("#bottom").append("<p class='font-weight-light text-center'>Ничего не найдено</p>");
    } else if (meta["total"] > 1) {
        let pagination = "<nav aria-label='navigation'><ul class='pagination justify-content-center'>"
        for (var i = 1; i <= Math.min(10, meta["total"]); ++i) {
            if (i == page) {
                pagination += "<li class='page-item disabled'><span class='page-link'>" + i + "</span></li>"
            } else {
                pagination += "<li class='page-item'><a class='page-link' href='#'>" + i + "</a></li>"
            }
        }
        pagination += "</ul></nav>";
        $("#bottom").append(pagination);
        $(".page-link").on("click", function() {
            let page = this.innerHTML;
            gotoPage(meta["text"], page);
        });
    }
}

function showRefsResults(data, title) {
    $("#content").empty();
    $("#bottom").empty();
    $("#content").addClass("justify-content-center");
    data["results"].forEach(function(entry) {
        let verses = entry["texts"];
        let alt = entry["reference"]["alt"];
        $("#top").append("<div class='col-sm-12 text-center'><h1 class='title'>" + title + "</h1></div>");
        formatChapterVerses(verses);
    });
}

function formatChapterVerses(verses) {
    verses.forEach(function(t) {
        t.forEach(function(v) {
            let regex = new RegExp('(\\s+|^)(_)(.+?)(\\2)', 'g');
            let text = v["text"].replace(regex, '$1<i>$3</i>').replace('--', '&ndash;');
            let row = "<div class='col-sm-8'>" +
                "<blockquote class='blockquote'>" +
                "<p class='mb-0'><sup>" + v["verse"] + "</sup> " + text + "</p>" +
                "</blockquote>"+
                "</div>";
            $("#content").append(row);
        });
    });
}
function formatVerses(verses, title, alt, cls, query) {
    verses.forEach(function(t) {
        t.forEach(function(v) {
            let regex = new RegExp('(\\s+|^)(_)(.+?)(\\2)', 'g');
            let text = v["text"].replace(regex, '$1<i>$3</i>').replace('--', '&ndash;');
            if (!title) {
                book_title = v["book_name"];
            } else {
                book_title = title;
            }
            if (!alt) {
                book_alt = v["book_alt"];
            } else {
                book_alt = alt;
            }
            if (query && query.length > 0) {
                let regex = new RegExp('(' + query + ')', 'gui');
                text = text.replace(regex, "<mark>$1</mark>");
            }
            let ref_alt = book_alt + " " + v["chapter"];
            let ref_title = book_title + " " + v["chapter"];
            let ref_name = book_title + " " + v["chapter"] + ":" + v["verse"];
            let ref_link = "<a href='#' onclick='gotoReference(\"" + ref_alt + "\", \"" + ref_title + "\");'>" + ref_name + "</a>";
            let row = "<div class='" + cls + "'>" +
                "<blockquote class='blockquote'>" +
                "<p class='mb-0'>" + text + "</p>" +
                "<footer class='blockquote-footer font-italic'>" + ref_link + "</footer>" +
                "</blockquote>"+
                "</div>";
            $("#content").append(row);
        });
    });
}
