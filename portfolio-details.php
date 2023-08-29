<?php 
  if (isset($_GET['id'])) {
    $result_id = $_GET['id'];


  }

?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">

  <title>AhmadRufi | Portfolio</title>
  <meta content="" name="description">
  <meta content="" name="keywords">

  <!-- Favicons -->
  <link href="assets/img/favicon.png" rel="icon">
  <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon">

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Raleway:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">

  <!-- Vendor CSS Files -->
  <link href="assets/vendor/aos/aos.css" rel="stylesheet">
  <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
  <link href="assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
  <link href="assets/vendor/glightbox/css/glightbox.min.css" rel="stylesheet">
  <link href="assets/vendor/swiper/swiper-bundle.min.css" rel="stylesheet">

  <!-- Template Main CSS File -->
  <link href="assets/css/style.css" rel="stylesheet">

  <!-- =======================================================
  * Template Name: iPortfolio - v3.9.1
  * Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
  * Author: BootstrapMade.com
  * License: https://bootstrapmade.com/license/
  ======================================================== -->
</head>

<body>

  <!-- ======= Mobile nav toggle button ======= -->
  <i class="bi bi-list mobile-nav-toggle d-xl-none"></i>

  <!-- ======= Header ======= -->
  <header id="header">
    <div class="d-flex flex-column">

      <div class="profile">
        <img src="assets/img/my.jpg" alt="" class="img-fluid rounded-circle">
        <h1 class="text-light"><a href="index.html">AhmadRufai</a></h1>
        <div class="social-links mt-3 text-center">
          <a href="#" class="twitter"><i class="bx bxl-twitter"></i></a>
          <a href="#" class="facebook"><i class="bx bxl-facebook"></i></a>
          <a href="#" class="instagram"><i class="bx bxl-instagram"></i></a>
          <a href="#" class="google-plus"><i class="bx bxl-skype"></i></a>
          <a href="#" class="linkedin"><i class="bx bxl-linkedin"></i></a>
        </div>
      </div>

      <nav id="navbar" class="nav-menu navbar">
        <ul>
          <li><a href="#hero" class="nav-link scrollto active"><i class="bx bx-home"></i> <span>Home</span></a></li>
          <li><a href="#about" class="nav-link scrollto"><i class="bx bx-user"></i> <span>About</span></a></li>
          <li><a href="#resume" class="nav-link scrollto"><i class="bx bx-file-blank"></i> <span>Resume</span></a></li>
          <li><a href="#portfolio" class="nav-link scrollto"><i class="bx bx-book-content"></i> <span>Portfolio</span></a></li>
          <li><a href="#services" class="nav-link scrollto"><i class="bx bx-server"></i> <span>Services</span></a></li>
          <li><a href="#contact" class="nav-link scrollto"><i class="bx bx-envelope"></i> <span>Contact</span></a></li>
        </ul>
      </nav><!-- .nav-menu -->
    </div>
  </header><!-- End Header -->
<?php 
  $details = [
        
        ['id'=>'1', 
        'img1'=>'ATM1.PNG', 
        'img2'=>'ATM2.PNG', 
        'img3'=>'ATM.PNG', 
        'Category'=>'Application', 
        'Client'=>'Learning Project',
        'Project date'=>'April 2018',
        'Discription'=>'This application develop using Javascript, SweetAlert framework, HTML, to simulate the process of ATM transaction. 
        I develop this app to streamline my Javascript and SweetAlert i learned in 2017/2018.',
        'URL'=> 'www.example.com' ],

         ['id'=>'2', 
         'img1'=>'STH (1).PNG', 
         'img2'=>'STH (3).PNG', 
         'img3'=>'STH (2).PNG', 
         'Category'=>'Web Design', 
         'Client'=>'Free Web Hosting',
         'Project date'=>'January 2022', 
         'Discription'=>'SoftCode Tech Hub, is a dedicated free hosting, where developer accross
          the globa can host their website free.',
         'URL'=> 'http://www.softcodetechhub.live' ],
        
        ['id'=>'3', 
         'img1'=>'CHAT2.PNG', 
         'img2'=>'CHAT3.PNG', 
         'img3'=>'CHAT1.PNG',
         'img4'=>'naub5.PNG', 
         'Category'=>'Web Application', 
         'Client'=>'Develop for NAUB Student',
         'Project date'=>'March 2019', 
         'Discription'=>'Updating in progress....',
         'URL'=> 'www.example.com' ],

         ['id'=>'4', 
         'img1'=>'pizza2.png', 
         'img2'=>'pizza1.png', 
         'img3'=>'pizza.png', 
         'Category'=>'Web Design', 
         'Client'=>'School Mini Project',
         'Project date'=>'July 2020', 
         'Discription'=>'Updating in progress....',
         'URL'=> 'www.example.com' ],

         ['id'=>'5', 
         'img1'=>'portfolio5.png', 
         'img2'=>'portfolio6.png', 
         'img3'=>'portfolio1.png', 
         'Category'=>'Web Design', 
         'Client'=>'Confidence Technical Multipurpose Limited, Kano',
         'Project date'=>'June 2022', 
         'Discription'=>'Updating in progress....',
         'URL'=> 'https://murufi.github.io/www.confidentcompany.com/' ],

         ['id'=>'6', 
         'img1'=>'TRAD2', 
         'img2'=>'TRAD1', 
         'img3'=>'TRAD3', 
         'Category'=>'Web Design', 
         'Client'=>'GofxTrade BTC Company',
         'Project date'=>'June 2017/2018', 
         'Discription'=>'Updating in progress....',
         'URL'=> 'www.example.com' ],

         ['id'=>'7', 
         'img1'=>'school3.png', 
         'img2'=>'school2.png', 
         'img3'=>'school1.png', 
         'Category'=>'Web Design', 
         'Client'=>'Federal Science & Technical College',
         'Project date'=>'December 2015', 
         'Discription'=>'Updating in progress....',
         'URL'=> 'www.example.com' ],

         ['id'=>'8', 
         'img1'=>'siwes3', 
         'img2'=>'siwes4', 
         'img3'=>'siwes', 
         'Category'=>'Web Design', 
         'Client'=>' - ',
         'Project date'=>' 2023', 
         'Discription'=>'Updating in progress....',
         'URL'=> 'www.example.com' ],

        //  ['id'=>'9', 
        //  'img1'=>'STH (', 
        //  'img2'=>'STH (', 
        //  'img3'=>'STH (', 
        //  'Category'=>'Web Design', 
        //  'Client'=>' - ',
        //  'Project date'=>' 2023', 
        //  'Discription'=>'Updating in progress....',
        //  'URL'=> 'www.example.com' ],
        
        
        ]
        



?>
  <main id="main">

    <!-- ======= Breadcrumbs ======= -->
    <section id="breadcrumbs" class="breadcrumbs">
      <div class="container">

        <div class="d-flex justify-content-between align-items-center">
          <h2>Portfoio Details</h2>
          <ol>
            <li><a href="index.html">Home</a></li>
            <li>Portfoio Details</li>
          </ol>
        </div>

      </div>
      <?php 

              $selected_result = null; 
                foreach ($details as $key ):
                  if ($key['id'] === $result_id):
                    $selected_result = $key;
                    
              ?>
    </section><!-- End Breadcrumbs -->

    <!-- ======= Portfolio Details Section ======= -->
    <section id="portfolio-details" class="portfolio-details">
      <div class="container">

        <div class="row gy-4">

          <div class="col-lg-8">
            <div class="portfolio-details-slider swiper">
              <div class="swiper-wrapper align-items-center">

                <div class="swiper-slide">
                  <img src="assets/img/portfolio/<?php echo $selected_result['img1'];?>" alt="">
                </div>
                    <?php if ($result_id == 3) {
                        echo "<div class='swiper-slide'>
                        <img src='assets/img/portfolio/$selected_result[img4]' alt=''>
                      </div>";
                    } ?>
                <div class="swiper-slide">
                  <img src="assets/img/portfolio/<?php echo $selected_result['img2'];?>" alt="">
                </div>

                <div class="swiper-slide">
                  <img src="assets/img/portfolio/<?php echo $selected_result['img3'];?>" alt="">
                </div>

              </div>
              <div class="swiper-pagination"></div>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="portfolio-info">
              <h3>Project information</h3>
              
              <ul>
                <li><strong>Category</strong>: <?php echo $selected_result['Category'];?></li>
                <li><strong>Client</strong>: <?php echo $selected_result['Client'];?></li>
                <li><strong>Project date</strong>: <?php echo $selected_result['Project date'];?></li>
                <li><strong>Project URL</strong>: <a href="<?php echo $selected_result['URL'];?>"><?php echo $selected_result['URL'];?></a></li>
              </ul>

              <?php 
              endif;
            endforeach; ?>
            </div>
            <div class="portfolio-description">
              <h2>The Portfolio Detail</h2>
              <p>
                <?php echo $selected_result['Discription'];?>
              </p>
            </div>
          </div>

        </div>

      </div>
    </section><!-- End Portfolio Details Section -->

  </main><!-- End #main -->

  <!-- ======= Footer ======= -->
  <footer id="footer">
    <div class="container">
      <div class="copyright">
        &copy; Copyright <strong><span>AhmadRufai Portfolio</span></strong>
      </div>
      <div class="credits">
        <!-- All the links in the footer should remain intact. -->
        <!-- You can delete the links only if you purchased the pro version. -->
        <!-- Licensing information: https://bootstrapmade.com/license/ -->
        <!-- Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/ -->
        <!-- Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a> -->
      </div>
    </div>
  </footer><!-- End  Footer -->

  <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>

  <!-- Vendor JS Files -->
  <script src="assets/vendor/purecounter/purecounter_vanilla.js"></script>
  <script src="assets/vendor/aos/aos.js"></script>
  <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="assets/vendor/glightbox/js/glightbox.min.js"></script>
  <script src="assets/vendor/isotope-layout/isotope.pkgd.min.js"></script>
  <script src="assets/vendor/swiper/swiper-bundle.min.js"></script>
  <script src="assets/vendor/typed.js/typed.min.js"></script>
  <script src="assets/vendor/waypoints/noframework.waypoints.js"></script>
  <script src="assets/vendor/php-email-form/validate.js"></script>

  <!-- Template Main JS File -->
  <script src="assets/js/main.js"></script>

</body>

</html>