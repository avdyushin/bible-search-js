let host = "http://localhost:8080"

$(document).ready(function() {
    $.getJSON(host + "/daily", showResults);
});

$("#search").submit(function(event) {
    let q = event.currentTarget[0].value;
    if (q.length > 0) {
        $.getJSON(host + "/search?q=" + q, showSearchResults);
    }
    event.preventDefault();
});

function gotoPage(query, page) {
    if (page > 0) {
        $.getJSON(host + "/search?q=" + query + "&p=" + page, showSearchResults);
    }
}

function showResults(data) {
    $("#content").empty();
    $("#bottom").empty();
    data["results"].forEach(function(entry) {
        let verses = entry["texts"];
        let title = entry["reference"]["title"];
        formatVerses(verses, title);
    });
}

function showSearchResults(data) {
    $("#content").empty();
    $("#bottom").empty();
    let meta = data["meta"];
    let results = data["results"];
    formatVerses(results, null, meta["text"]);
    if (meta["total"] > 1) {
        let pagination = "<nav aria-label='navigation'><ul class='pagination justify-content-center'>"
        for (var i = 1; i <= Math.min(10, meta["total"]); ++i) {
            pagination += "<li class='page-item'><a class='page-link' href='#'>" + i + "</a></li>"
        }
        pagination += "</ul></nav>";
        $("#bottom").append(pagination);
        $(".page-link").on("click", function() {
            let page = this.innerHTML;
            gotoPage(meta["text"], page);
        });
    }
}

function formatVerses(verses, title, query) {
    verses.forEach(function(t) {
        t.forEach(function(v) {
            let regex = new RegExp('(\\s+|^)(_)(.+?)(\\2)', 'g');
            let text = v["text"].replace(regex, '$1<i>$3</i>').replace('--', '&ndash;');
            if (!title) {
                book_title = v["book_alt"];
            } else {
                book_title = title;
            }
            if (query && query.length > 0) {
                let regex = new RegExp('(' + query + ')', 'gui');
                text = text.replace(regex, "<mark>$1</mark>");
            }
            let ref = book_title + " " + v["chapter"] + ":" + v["verse"];
            let row = "<div class='col-xs-2 col-md-6'>" +
                "<blockquote class='blockquote'>" +
                "<p class='mb-0'>" + text + "</p>" +
                "<footer class='blockquote-footer font-italic'>" + ref + "</footer>" +
                "</blockquote>"+
                "</div>";
            $("#content").append(row);
        });
    });
}
