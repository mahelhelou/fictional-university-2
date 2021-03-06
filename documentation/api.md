# WORDPRESS API

## 4 reasons why we are creating our custom our own new REST API URL

1. More advanced custom search logic
2. Respond with less JSON data, we get only what wee specified (UX, loads faster for visitors)
3. Send only 1 getJSON request for all post types instead of 6 getJSON (in this theme, there are 6 post types)
4. Perfect exercise for sharpnening PHP skills

- To grab the content from DB, javascipt doesn't do anything
- Fetching 10 recent posts: `http://localhost:3000/wp-json/wp/v2/posts`
- Fetching 10 recent pages: `http://localhost:3000/wp-json/wp/v2/pages`j
- Grab one post per page: `http://localhost:3000/wp-json/wp/v2/posts?per_page=1`
- Grab post with specific id: `http://localhost:3000/wp-json/wp/v2/posts/34`
- Specific post that contains (Award): `http://localhost:3000/wp-json/wp/v2/posts?search=award`

## Start using postmain software

- Download Postman program
- Choose `GET` to grab data
- Press send button

## getResults() last code

```js
getResults() {
  // let colors = ['Red', 'Green', 'Blue']
  // this.resultsDiv.html('Imagine that some content goes here...') // (TEST)
  // this.isSpinnerVisible = false

  // To make the root_url dynamic, write a function in functions.php
  // Old: $.getJSON('http://localhost:3000/wp-json/wp/v2/posts?search=
  $.getJSON(fictionalUniversityData.root_url + '/wp-json/wp/v2/posts?search=' + this.searchFiled.val(), posts => {
    // alert(posts[0].title.rendered)
    // this.resultsDiv.html('<h2>General Information</h2><ul><li>Something</li></ul>') // (TEST)
    // (TEST for one post) <li><a href="${posts[0].link}">${posts[0].title.rendered}</a></li>
    // (TEST the map()) ${colors.map(item => `<li>${item}</li>`).join('')}
    // This is synchronous way. Won't excute the second request unless sending the first request
    $.getJSON(fictionalUniversityData.root_url + '/wp-json/wp/v2/pages?search=' + this.searchFiled.val(), pages => {
      let combinedResults = posts.concat(pages)
      this.resultsDiv.html(`
        <h2 class="search-overlay__section-title">General Information</h2>
          ${combinedResults.length ? '<ul class="link-list min-list">' : '<p>No general information matches your search.'}
            ${combinedResults.map(post => `<li><a href="${post.link}">${post.title.rendered}</a></li>`)}
          ${combinedResults.length ? '</ul>' : ''}
        `)
        this.isSpinnerVisible = false
      }) // (url, func), you can use .bind(this) @ the end of func
      // map is used to create a new version of original array. Runs once for each item
    })
}
```

## Ready and complete API Request using WP core REST API

- We deleted this code because we built our own api

```js
getResults() {
  // Using asynchronous requests
  $.when(
    $.getJSON(fictionalUniversityData.root_url + '/wp-json/wp/v2/posts?search=' + this.searchFiled.val()),
    $.getJSON(fictionalUniversityData.root_url + '/wp-json/wp/v2/pages?search=' + this.searchFiled.val())
  ).then((posts, pages) => {
    let combinedResults = posts[0].concat(pages[0])
      this.resultsDiv.html(`
        <h2 class="search-overlay__section-title">General Information</h2>
        ${combinedResults.length ? '<ul class="link-list min-list">' : '<p>No general information matches your search.'}
          ${combinedResults.map(post => `<li><a href="${post.link}">${post.title.rendered}</a> ${post.type == 'post' ? `by ${post.authorName}` : ''}</li>`).join('')}
        ${combinedResults.length ? '</ul>' : ''}
      `)
      this.isSpinnerVisible = false
  }, () => {
      this.resultsDiv.html('<p>Unexpected error! Please try again.</p>')
  })
}
```
