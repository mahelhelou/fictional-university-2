<?php get_header();

   while ( have_posts() ) {
      the_post();
      // Static pageBanner() data
      pageBanner(); ?>

<div class="container container--narrow page-section">
  <?php
      $theParent = wp_get_post_parent_id( get_the_ID() );
      // echo get_the_ID(); // prints the current id of post/page
      // echo wp_get_post_parent_id( get_the_ID() ); // returns the parent id of current post/page

   if ( $theParent ) { ?>
  <!-- Print back to home ONLY if the this page has a parent -->
  <div class="metabox metabox--position-up metabox--with-home-link">
    <p><a class="metabox__blog-home-link" href="<?php echo get_permalink( $theParent ); ?>"><i class="fa fa-home"
          aria-hidden="true"></i> Back to <?php echo get_the_title( $theParent ); ?></a>
      <span class="metabox__main"><?php the_title(); ?></span></p>
  </div>

  <?php } ?>

  <?php
      // get_pages(): list all pages from memory to deal with
      $pagesWithChildren = get_pages( array(
         'child_of' => get_the_ID()
      ) );

         if ( $theParent || $pagesWithChildren ) { ?>
  <div class="page-links">
    <h2 class="page-links__title"><a
        href="<?php echo get_permalink( $theParent ); ?>"><?php echo get_the_title( $theParent ); ?></a></h2>
    <ul class="min-list">
      <?php
         // wp_list_pages: list all wp pages and echo a title "pages" for theme
         // 'title_li': removes the "pages" title
         // 'child_of' => get_the_ID()
         // Order of pages (from admin area)

         if ( $theParent ) {
            $findChildrenOf = $theParent;
         } else {
            $findChildrenOf = get_the_ID();
         }

         wp_list_pages( array(
            'title_li' => NULL,
            'child_of' => $findChildrenOf,
            'sort_column' => 'menu_order'
         ) );
      ?>
      <!-- <li class="current_page_item"><a href="#">Our History</a></li>
                  <li><a href="#">Our Goals</a></li> -->
    </ul>
  </div>
  <?php } ?>


  <div class="generic-content">
    <?php the_content(); ?>
  </div>
</div>

<?php }

get_footer(); ?>