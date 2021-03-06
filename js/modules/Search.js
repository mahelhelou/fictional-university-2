// There's a blueprint for Human object bellow this object

// Bundler option
import $ from 'jquery'

// We create 3 main areas/section to deal with object
class Search {
  // 1. Describe and create/initiate our object
  constructor() { // Any code place here will be excuted once you create an object using the class blueprint
    this.addSearchHTML() // called first to be accessed
    this.searchOverlay = $(".search-overlay")
    this.openButton = $(".js-search-trigger")
    this.closeButton = $(".search-overlay__close")
    this.searchFiled = $('#search-term') // (UX, CACHE)
    this.resultsDiv = $('#search-overlay__results')

    this.events() // call events once the page is loaded
    this.isSearchOpen = false
    this.isSpinnerVisible = false
    this.typingTimer
    this.previousValue
  }

  // 2. events
  events() {
    this.openButton.on('click', this.openOverlay.bind(this))
    this.closeButton.click(this.closeOverlay.bind(this)) // shortcut
    // $(document).keyup(this.keyPressDispatcher.bind(this)) // fires once
    $(document).keydown(this.keyPressDispatcher.bind(this)) // (UX) fires each press
    this.searchFiled.keyup(this.typingLogic.bind(this)) // (UX) keyup is better keydown, because keydown fires immediately after key press
  }

  // 3. methods(functions, actions...)
  openOverlay() {
    this.searchOverlay.addClass('search-overlay--active')
    // Remove scroll when the search overlay is open
    $('body').addClass('body-no-scroll') // (UX)
    this.searchFiled.val('') // (UX) delete last searched results
    // this.searchFiled.focus() // (UX) autoFocus of input
    setTimeout(() =>  this.searchFiled.focus(), 301) // Wait until the fadeIn search transiton completed
    // console.log('Our open methos is just ran') // (TEST)
    this.isSearchOpen = true
    return false // prevent default behaviour of <a> tag
  }

  closeOverlay() {
    this.searchOverlay.removeClass('search-overlay--active')
    $('body').removeClass('body-no-scroll') // (UX)
    // console.log('Our close methos is just ran') // (TEST)
    this.isSearchOpen = false
  }

  keyPressDispatcher(e) {
    // console.log('A key has been clicked any where')
    // console.log(e.keyCode) // (TEST) find any key code on keyboard

    if (e.keyCode == 83 && !this.isSearchOpen && !$('input, textarea').is(':focus')) {
      // 3rd condition is to prevent opening search while typing (s) in inputs or textareas
      this.openOverlay() // we call a method directly
    }

    if (e.keyCode == 27 && this.isSearchOpen) {
      this.closeOverlay()
    }
  }

  typingLogic() {
    // alert('Hi, something to search is just typed!') // (TEST)
    if (this.searchFiled.val() != this.previousValue) {
      clearTimeout(this.typingTimer) // (UX) don't begin time counter for every press
      if (this.searchFiled.val()) {
        if (!this.isSpinnerVisible) {
          this.resultsDiv.html('<div class="spinner-loader"></div>') // (UX) show spinner loader before showing the results
          this.isSpinnerVisible = true
          // this.typingTimer = setTimeout(function () {console.log('Test timeout')}, 2000) // (TEST)
        } // to prevent re-starting the loader

          this.typingTimer = setTimeout(this.getResults.bind(this), 750) // (TEST)
      } else {
        this.resultsDiv.html('')
        this.isSpinnerVisible = false
      } // (UX) show content only if there's @ least 1 letter in search

    } // to prevent spinner loader for ctrl, shift or other keys that don't change the value
    this.previousValue = this.searchFiled.val()
  }

  getResults() {
    // Using asynchronous requests
    // There's a complete Search Overlay moved to api.md file
    $.getJSON(fictionalUniversityData.root_url + '/wp-json/university/v1/search?term=' + this.searchFiled.val(), results => {
      this.resultsDiv.html(`
        <div class="row">
          <div class="one-third">
            <h2 class="search-overlay__section-title">General Information</h2>
            ${results.generalInfo.length ? '<ul class="link-list min-list">' : '<p>No general information matches that search.</p>'}
              ${results.generalInfo.map(post => `<li><a href="${post.url}">${post.title}</a> ${post.postType == 'post' ? `by ${post.authorName}` : ''}</li>`).join('')}
            ${results.generalInfo.length ? '</ul>' : ''}

            </div>
          <div class="one-third">
            <h2 class="search-overlay__section-title">Programs</h2>
            ${results.programs.length ? '<ul class="link-list min-list">' : `<p>No programs match that search. <a href="${fictionalUniversityData.root_url}/programs">View all programs</a></p>`}
              ${results.programs.map(post => `<li><a href="${post.url}">${post.title}</a></li>`).join('')}
            ${results.programs.length ? '</ul>' : ''}

            <h2 class="search-overlay__section-title">Professors</h2>
            ${results.professors.length ? '<ul class="professor-cards">' : `<p>No professors match that search.</p>`}
              ${results.professors.map(post => `
              <li class="professor-card__list-item">
                <a class="professor-card" href="${post.url}">
                  <img src="${post.image}" alt="" class="professor-card__image">
                  <span class="professor-card__name">${post.title}</span>
                </a>
              </li>
              `).join('')}
            ${results.professors.length ? '</ul>' : ''}
          </div>
          <div class="one-third">
            <h2 class="search-overlay__section-title">Campuses</h2>
            ${results.campuses.length ? '<ul class="link-list min-list">' : `<p>No campuses match your search. <a href="${fictionalUniversityData.root_url}/campuses">View all campuses</a></p>`}
              ${results.campuses.map(post => `<li><a href="${post.url}">${post.title}</a></li>`).join('')}
            ${results.campuses.length ? '</ul>' : ''}

            <h2 class="search-overlay__section-title">Events</h2>
            ${results.events.length ? '' : `<p>No events match your search. <a href="${fictionalUniversityData.root_url}/events">View all events</a></p>`}
              ${results.events.map(post => `
                <div class="event-summary">
                  <a class="event-summary__date t-center" href="${post.url}">
                    <span class="event-summary__month">${post.month}</span>
                    <span class="event-summary__day">${post.day}</span>
                  </a>
                  <div class="event-summary__content">
                    <h5 class="event-summary__title headline headline--tiny"><a
                        href="${post.url}">${post.title}</a></h5>
                    <p>${post.description} <a href="${post.url}" class="nu gray">Learn more</a></p>
                  </div>
                </div>
              `).join('')}
          </div>
        </div>
      `)
      this.isSpinnerVisible = false
    });
  }

  addSearchHTML() {
    $('body').append(`
    <div class="search-overlay">
      <div class="search-overlay__top">
        <div class="container">
          <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
          <input type="text" class="search-term" placeholder="What are you looking for?" id="search-term">
          <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
        </div>
      </div>

      <div class="container">
        <div id="search-overlay__results"></div>
      </div>
    </div>
    `)
  }
}

// Bundler option
export default Search

// Human object blueprint
class Person {
  constructor() {
    this.name = 'Jane'
    this.eyeColor = 'green'
    this.head = {}
    this.brain = {}
  }

  events() {
    // On this.head feels colde, wearsHat
    // On this.brain feels hot, goingSwimming
  }

  goingSwimming() {

  }

  wearsHat() {

  }
}