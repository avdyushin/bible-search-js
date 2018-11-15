$(document).ready(function() {
    $.getJSON("http://localhost:8080/daily", showResults);
});

$("#search").submit(function(event) {
    let q = event.currentTarget[0].value;
    console.log('OK ' + q);
    event.preventDefault();
});

function showResults(data) {
    data["results"].forEach(function(entry) {
        let title = entry["reference"]["title"];
        let verses = entry["texts"]
        verses.forEach(function(t) {
            t.forEach(function(v) {
                let regex = new RegExp('(\\s+|^)(_)(.+?)(\\2)', 'g');
                let text = v["text"].replace(regex, '$1<i>$3</i>').replace('--', '&ndash;');
                let ref = title + " " + v["chapter"] + ":" + v["verse"];
                let row = "<div class='col-xs-2 col-md-6'>" +
                    "<blockquote class='blockquote'>" +
                    "<p class='mb-0'>" + text + "</p>" +
                    "<footer class='blockquote-footer font-italic'>" + ref + "</footer>" +
                    "</blockquote>"+
                    "</div>";
                $("#content").append(row);
            });
        });
    });
}

