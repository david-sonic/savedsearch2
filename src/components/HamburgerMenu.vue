<template>
  <div>
    <div 
      class="hamburger-overlay" 
      :class="{ 'show': isOpen }"
      @click="closeMenu"
    ></div>
    <div class="hamburger-menu-panel" :class="{ 'open': isOpen }">
      <div class="hamburger-header">
        <img 
          src="/Illustrations/05_Brand/logo-green-white.svg" 
          alt="EchoPark" 
          class="hamburger-logo" 
          @click="navigateToHomepage"
        >
        <img 
          src="/Illustrations/Close_darkmode.svg" 
          alt="Close" 
          class="hamburger-close" 
          @click="closeMenu"
        >
      </div>
      <div class="hamburger-content">
        <div class="primary-links">
          <div class="primary-link" @click="navigateToSearch">
            <span class="primary-link-text">Shop cars</span>
          </div>
          <div class="primary-link">
            <span class="primary-link-text">Sell/Trade</span>
          </div>
          <div class="primary-link">
            <span class="primary-link-text">Finance</span>
          </div>
        </div>
        <div class="secondary-links">
          <div class="secondary-link">
            <span class="secondary-link-text">Find a location</span>
          </div>
          <div class="secondary-link">
            <span class="secondary-link-text">Get a loan</span>
          </div>
          <div class="secondary-link">
            <span class="secondary-link-text">About EchoPark</span>
          </div>
          <div class="secondary-link">
            <span class="secondary-link-text">Protection plans</span>
          </div>
          <div class="secondary-link">
            <span class="secondary-link-text">190-Point inspection</span>
          </div>
          <div class="secondary-link">
            <span class="secondary-link-text">OwnerZone</span>
          </div>
          <div class="secondary-link">
            <span class="secondary-link-text">Help center & FAQs</span>
          </div>
          <div class="secondary-link">
            <span class="secondary-link-text">Shop brand-new cars</span>
          </div>
          <div class="secondary-link">
            <span class="secondary-link-text">Shop powersports</span>
          </div>
        </div>
      </div>
      <div class="hamburger-signin">
        <button class="btn-signin" @click="openSignIn">Sign in</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HamburgerMenu',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'open-signin'],
  methods: {
    closeMenu() {
      this.$emit('close')
    },
    navigateToHomepage() {
      this.$router.push('/homepage')
      this.closeMenu()
    },
    navigateToSearch() {
      this.$router.push('/search')
      this.closeMenu()
    },
    openSignIn() {
      this.$emit('open-signin')
    }
  }
}
</script>

<style scoped>
.hamburger-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: none;
}

.hamburger-overlay.show {
  display: block;
}

.hamburger-menu-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: #313d47;
  z-index: 1001;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  overflow-y: auto;
}

.hamburger-menu-panel.open {
  transform: translateX(0);
}

.hamburger-header {
  position: absolute;
  top: 16px;
  left: 24px;
  right: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
}

.hamburger-logo {
  height: 24px;
  width: 80px;
  object-fit: contain;
  cursor: pointer;
}

.hamburger-close {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.hamburger-content {
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 72px;
  padding: 0 8px 24px 8px;
  overflow-y: auto;
}

.primary-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 32px;
}

.primary-link {
  background: #313d47;
  border-radius: 8px;
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;
}

.primary-link-text {
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 26px;
  line-height: 1.2;
  color: white;
  letter-spacing: -0.2px;
}

.secondary-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.secondary-link {
  background: #313d47;
  border-radius: 8px;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;
}

.secondary-link-text {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: white;
}

.hamburger-signin {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #313d47;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  z-index: 10;
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.3);
}

.btn-signin {
  background: #3e8500;
  border: none;
  border-radius: 28px;
  padding: 13px 40px;
  height: 56px;
  width: 336px;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: white;
  text-align: center;
  cursor: pointer;
  letter-spacing: 0.4px;
}

@media (max-width: 600px) {
  .hamburger-menu-panel {
    width: 100vw !important;
  }
}
</style>

