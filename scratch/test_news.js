const key = "d81f2e42c6d4452b82652c11e8d1292d";
const q = [
    "construction management",
    "quantity surveying",
    "civil engineering",
    "building construction",
    "infrastructure Africa",
].join(" OR ");
const url = new URL("https://newsapi.org/v2/everything");
url.searchParams.set("q", q);
url.searchParams.set("language", "en");
url.searchParams.set("sortBy", "publishedAt");
url.searchParams.set("pageSize", "20");
url.searchParams.set("apiKey", key);

fetch(url.toString())
    .then(res => res.json())
    .then(data => {
        console.log("Total Results:", data.totalResults);
        console.log("Articles Returned:", data.articles?.length);
        if (data.articles) {
            data.articles.slice(0, 5).forEach((a, i) => {
                console.log(`\nArticle ${i+1}:`);
                console.log("Title:", a.title);
                console.log("Image:", a.urlToImage);
                console.log("Source:", a.source?.name);
            });
        }
    })
    .catch(console.error);
