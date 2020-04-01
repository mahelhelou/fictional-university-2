<?php get_header();
  // We give $args because it's a STATIC data not DYNAMIC
  pageBanner( array(
    'title' => 'All Events',
    'subtitle' => 'See what is going in our world.'
  ) );
?>

<!-- <div class="page-banner">
  <div class="page-banner__bg-image" style="background-image: url(<?php echo get_theme_file_uri( '/images/ocean.jpg' ) ?>); "></div>
  <div class="page-banner__content container container--narrow">
    <h1 class="page-banner__title">All Events</h1>
    <div class="page-banner__intro">
      <p>See what is going in our world.</p>
    </div>
  </div>
</div> -->

<div class="container container--narrow page-section">
<?php
  // You don't have to destroy the default query here, you can edit the order of events dates using `fiction_university_adjust_query' function

  while( have_posts() ) {
    the_post();
    get_template_part( 'template-parts/content-event' );
  }

  // Pagination to other posts
  echo paginate_links();
?>

  <hr class="section-break">

  <p>Looking for a recap of past events? <a href="<?php echo site_url( 'past-events' ); ?>">Check our past events archive.</a></p>
</div>

<?php get_footer(); ?>