<template>
  <div class="mobile-container" :class="{ 'menu-open': isMenuOpen }">
    <Navigation @open-menu="openHamburgerMenu" />
    
    <!-- Hero Section -->
    <div class="hero">
      <div class="hero-image"></div>
      <div class="hero-overlay"></div>
      <img 
        src="/Illustrations/05_Brand/logo-white.svg" 
        alt="EchoPark Logo" 
        class="hero-logo"
      >
      <div class="hero-card">
        <div class="hero-text">
          <h1 class="hero-title">Drive happy, worry less</h1>
          <p class="hero-subtitle">Buy a car with vehicle protection for less than just the car at our competitors.</p>
        </div>
        <div class="hero-buttons">
          <button class="btn-primary" @click="navigateToSearch">Find your ride</button>
          <button class="btn-secondary">Sell your car</button>
        </div>
      </div>
    </div>

    <!-- Shop Categories -->
    <div class="shop-categories">
      <h2 class="categories-title">Shop top categories</h2>
      <div class="categories-buttons">
        <button class="btn-category">Under $20k</button>
        <button class="btn-category">EVs & Hybrids</button>
        <button class="btn-category">Under $20k</button>
        <button class="btn-category">Trending cars</button>
      </div>
    </div>

    <!-- Company Introduction -->
    <div class="company-intro">
      <h2 class="intro-title">A better way to own</h2>
      <div class="intro-cards">
        <div class="intro-card">
          <div class="card-illustration">
            <img 
              src="/Illustrations/Homepage illustrations/Scene Illustration-1.svg" 
              alt="Vehicle Protection"
            >
          </div>
          <div class="card-content">
            <h3 class="card-title">Don't overpay for repairs</h3>
            <p class="card-description">Major repairs happen when warranties end. Cover what matters most.</p>
            <a href="#" class="card-link">
              Explore vehicle protection
              <img 
                src="/Illustrations/01_Navigation/forward-arrow.svg" 
                alt="Arrow" 
                class="arrow-icon"
              >
            </a>
          </div>
        </div>
        <div class="intro-card">
          <div class="card-illustration">
            <img 
              src="/Illustrations/Homepage illustrations/Scene Illustration-2.svg" 
              alt="Dream Cars"
            >
          </div>
          <div class="card-content">
            <h3 class="card-title">Thousands of dream cars</h3>
            <p class="card-description">We keep our inventory stocked with the best options so we can find you the perfect match.</p>
            <a href="#" class="card-link">
              Shop cars
              <img 
                src="/Illustrations/01_Navigation/forward-arrow.svg" 
                alt="Arrow" 
                class="arrow-icon"
              >
            </a>
          </div>
        </div>
        <div class="intro-card">
          <div class="card-illustration">
            <img 
              src="/Illustrations/Homepage illustrations/Scene Illustration.svg" 
              alt="Happiness Guarantee"
            >
          </div>
          <div class="card-content">
            <h3 class="card-title">Happiness, guaranteed</h3>
            <p class="card-description">With our 7-day Happiness Guarantee, if you don't love it in a week, we want it back.</p>
            <a href="#" class="card-link">
              More about us
              <img 
                src="/Illustrations/01_Navigation/forward-arrow.svg" 
                alt="Arrow" 
                class="arrow-icon"
              >
            </a>
          </div>
        </div>
      </div>
    </div>

    <HamburgerMenu 
      :is-open="isMenuOpen" 
      @close="closeHamburgerMenu"
      @open-signin="openSignIn"
    />
  </div>
</template>

<script>
import Navigation from '../components/Navigation.vue'
import HamburgerMenu from '../components/HamburgerMenu.vue'

export default {
  name: 'Homepage',
  components: {
    Navigation,
    HamburgerMenu
  },
  data() {
    return {
      isMenuOpen: false
    }
  },
  methods: {
    openHamburgerMenu() {
      this.isMenuOpen = true
    },
    closeHamburgerMenu() {
      this.isMenuOpen = false
    },
    navigateToSearch() {
      this.$router.push('/search')
    },
    openSignIn() {
      console.log('Sign in clicked')
    }
  }
}
</script>

<style scoped>
.mobile-container.menu-open {
  overflow: hidden;
}

/* Hero Section */
.hero {
  position: relative;
  height: 668px;
  overflow: hidden;
}

.hero-image {
  position: absolute;
  top: -31px;
  left: -16px;
  width: 488px;
  height: 364px;
  background: url('/Illustrations/06_Homepage/vsc-takeover-hero-image-mb.svg') center/cover;
}

.hero-overlay {
  position: absolute;
  top: -31px;
  left: -16px;
  width: 488px;
  height: 157px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
}

.hero-logo {
  position: absolute;
  top: 233px;
  left: 36px;
  width: 156px;
  height: 52px;
}

.hero-card {
  position: absolute;
  top: 316px;
  left: 0;
  right: 0;
  background: #313d47;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hero-title {
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 42px;
  line-height: 48px;
  color: white;
  letter-spacing: -0.4px;
}

.hero-subtitle {
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 16px;
  line-height: 24px;
  color: white;
}

.hero-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.btn-primary {
  background: #3e8500;
  border: none;
  border-radius: 28px;
  padding: 13px 40px;
  height: 56px;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: white;
  text-align: center;
  cursor: pointer;
  letter-spacing: 0.4px;
}

.btn-secondary {
  background: transparent;
  border: 2px solid #e8e9eb;
  border-radius: 28px;
  padding: 13px 40px;
  height: 56px;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: white;
  text-align: center;
  cursor: pointer;
  letter-spacing: 0.4px;
}

/* Shop Categories */
.shop-categories {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}

.categories-title {
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 32px;
  line-height: 40px;
  color: #242c33;
  letter-spacing: -0.4px;
  text-align: center;
}

.categories-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.btn-category {
  border: 3px solid #242c33;
  background: transparent;
  border-radius: 28px;
  padding: 13px 40px;
  height: 56px;
  width: 327px;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #242c33;
  text-align: center;
  cursor: pointer;
  letter-spacing: 0.4px;
}

/* Company Introduction */
.company-intro {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.intro-title {
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 32px;
  line-height: 40px;
  color: #242c33;
  letter-spacing: -0.4px;
}

.intro-cards {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.intro-card {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card-illustration {
  height: 213px;
  background: #f5f4f3;
  border-radius: 18.74px;
  position: relative;
  overflow: hidden;
}

.card-illustration img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-title {
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 22px;
  line-height: 26px;
  color: #242c33;
}

.card-description {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #242c33;
}

.card-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #006fa6;
  text-decoration: none;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
}

.card-link:hover {
  text-decoration: underline;
}

.arrow-icon {
  width: 24px;
  height: 24px;
}
</style>

