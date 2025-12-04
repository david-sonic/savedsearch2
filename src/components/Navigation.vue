<template>
  <div class="navigation-container">
    <div class="navigation-top">
      <div class="navigation-left">
        <img 
          src="/Illustrations/07_SRP/hamburger-menu.svg" 
          alt="Menu" 
          class="hamburger-icon" 
          @click="openHamburgerMenu"
        >
        <img 
          src="/Illustrations/05_Brand/logo-white.svg" 
          alt="EchoPark" 
          class="logo-icon" 
          @click="navigateToHomepage"
        >
      </div>
      <div class="navigation-right">
        <div class="location-info">
          <span class="location-text">75214</span>
          <img src="/Illustrations/07_SRP/map-icon.svg" alt="Location" class="icon">
        </div>
        <img src="/Illustrations/07_SRP/favorites.svg" alt="Favorites" class="icon">
        <img src="/Illustrations/07_SRP/account.svg" alt="Account" class="icon">
      </div>
    </div>
    <div class="search-container" @click="navigateToSavedSearches">
      <input 
        type="text" 
        class="search-field" 
        placeholder="Search make, model, or feature" 
        readonly
      >
      <button class="search-btn">
        <img 
          src="/Illustrations/Filter Bar Icons/Inputs/Button/Smalls/search-default.svg" 
          alt="Search" 
          class="search-icon"
        >
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  emits: ['open-menu'],
  methods: {
    openHamburgerMenu() {
      this.$emit('open-menu')
    },
    navigateToHomepage() {
      this.$router.push('/homepage')
    },
    navigateToSavedSearches() {
      this.$router.push('/saved-searches')
    }
  }
}
</script>

<style scoped>
.navigation-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 16px 24px 8px;
}

.navigation-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.navigation-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.navigation-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.hamburger-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  filter: brightness(0) invert(1);
}

.logo-icon {
  height: 28px;
  cursor: pointer;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 3px;
}

.location-text {
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #006fa6;
  line-height: 24px;
}

.icon {
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1);
}

.search-container {
  background: white;
  border: 1px solid white;
  border-radius: 100px;
  padding: 4px 4px 4px 24px;
  display: flex;
  align-items: center;
  gap: 24px;
  height: 56px;
  cursor: pointer;
}

.search-field {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #666b70;
  line-height: 24px;
  border: none;
  outline: none;
  background: transparent;
  flex: 1;
}

.search-btn {
  background: #3e8500;
  border-radius: 100px;
  padding: 12px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-icon {
  width: 24px;
  height: 24px;
  display: block;
}
</style>

