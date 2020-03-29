<?php get_header(); ?>

<div class="page-banner">
  <div class="page-banner__bg-image" style="background-image: url(<?php echo get_theme_file_uri( '/images/ocean.jpg' ) ?>); "></div>
  <div class="page-banner__content container container--narrow">
    <h1 class="page-banner__title">Past Events</h1>
    <div class="page-banner__intro">
      <p>A recap of our past events.</p>
    </div>
  </div>
</div>

<div class="container container--narrow page-section">
<?php
   $today = date( 'Ymd' );
   $pastEvents = new WP_Query( array(
     'post_type' => 'event',
      // 'posts_per_page' => 1, // for pagination purposes
     'paged' => get_query_var( 'paged', 1 ),
     'meta_key' => 'event_date',
     // [title, post_date, rand for ajax idea] // -1 for all posts
     'orderby' => 'meta_value_num',
     'order' => 'ASC', // DESC, ASC
     'meta_query' => array(
       // Only show events that are greater than today date
       array(
         'key' => 'event_date',
         'compare' => '<',
         'value' => $today,
         'type' => 'numeric'
       )
     )
   ) );

  while( $pastEvents->have_posts() ) {
   $pastEvents->the_post(); ?>
   <div class="event-summary">
      <a class="event-summary__date t-center" href="<?php the_permalink(); ?>">
        <span class="event-summary__month"><?php
          // the_field( 'event_date' ); // prints full date
          $eventDate = new DateTime( get_field( 'event_date' ) );
          echo $eventDate->format( 'M' );
        ?></span>
        <span class="event-summary__day"><?php echo $eventDate->format( 'd' ); ?></span>
      </a>
      <div class="event-summary__content">
        <h5 class="event-summary__title headline headline--tiny"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h5>
        <p><?php echo wp_trim_words( get_the_content(), 18 ); ?> <a href="<?php the_permalink(); ?>" class="nu gray">Read more</a></p>
      </div>
   </div>
  <?php }

  // This works only for default query, and we need to customize it for $pageEvents pagination
  echo paginate_links( array(
     'total' => $pastEvents->max_num_pages
  ) );
?>
</div>

<?php get_footer(); ?>