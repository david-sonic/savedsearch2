<template>
  <div class="mobile-container">
    <!-- Header -->
    <div class="header">
      <div class="search-input-container">
        <input 
          type="text" 
          class="search-input" 
          placeholder="|" 
          v-model="searchQuery"
          @focus="onSearchFocus"
          autofocus
        >
        <button class="search-clear" @click="clearSearch">
          <img 
            src="/Illustrations/Toast icons/pop-up close icon.svg" 
            alt="Clear" 
            class="search-clear-icon"
          >
        </button>
      </div>
      <button class="cancel-button" @click="goBack">Cancel</button>
    </div>

    <!-- Saved Searches Section -->
    <div class="saved-searches-section">
      <div class="saved-searches-header">
        <span class="saved-searches-title">Saved searches</span>
        <div class="divider"></div>
      </div>
      <div class="saved-searches-list">
        <div 
          v-if="filteredSearches.length === 0 && savedSearches.length > 0"
          class="empty-state"
        >
          <p>No saved searches match your search</p>
        </div>
        <div 
          v-else-if="savedSearches.length === 0"
          class="empty-state"
        >
          <p>No saved searches yet</p>
        </div>
        <div 
          v-for="(search, index) in filteredSearches" 
          :key="index"
          class="saved-search-item"
          @click="selectSavedSearch(index)"
        >
          <img 
            src="/Illustrations/02_Filter/saved-searches.svg" 
            alt="Search" 
            class="saved-search-icon"
          >
          <span class="saved-search-text">{{ search.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SavedSearches',
  data() {
    return {
      searchQuery: '',
      savedSearches: []
    }
  },
  computed: {
    filteredSearches() {
      if (!this.searchQuery.trim()) {
        return this.savedSearches
      }
      const query = this.searchQuery.toLowerCase()
      return this.savedSearches.filter(search => 
        search.name.toLowerCase().includes(query)
      )
    }
  },
  mounted() {
    this.initializeSavedSearches()
    this.populateSavedSearches()
    
    // Listen for changes to saved searches from other tabs/pages
    window.addEventListener('storage', this.handleStorageChange)
    
    // Refresh saved searches when page becomes visible
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
    
    // Also refresh when window gains focus
    window.addEventListener('focus', this.populateSavedSearches)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange)
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
    window.removeEventListener('focus', this.populateSavedSearches)
  },
  methods: {
    initializeSavedSearches() {
      // Check if saved searches already exist
      const existingSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]')
      
      // Only initialize if no saved searches exist
      if (existingSearches.length === 0) {
        const prototypeSearches = [
          {
            name: 'Under $15k for Sally',
            bodyStyles: ['Sedan'],
            priceRange: { min: '5000', max: '15000' },
            createdAt: new Date().toISOString()
          },
          {
            name: 'Dream car',
            bodyStyles: ['Convertible'],
            priceRange: { min: '25000', max: '70000' },
            fuelType: 'gas',
            make: 'BMW',
            model: '3 Series',
            createdAt: new Date().toISOString()
          },
          {
            name: 'High safety rating',
            bodyStyles: ['SUV'],
            priceRange: { min: '5000', max: '70000' },
            drivetrain: 'awd',
            yearMin: 2020,
            createdAt: new Date().toISOString()
          }
        ]
        localStorage.setItem('savedSearches', JSON.stringify(prototypeSearches))
      }
    },
    populateSavedSearches() {
      // Get saved searches from localStorage
      this.savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]')
    },
    selectSavedSearch(index) {
      // Store only the index; SRP will call applySavedSearch(index) for unified logic
      sessionStorage.setItem('selectedSavedSearchIndex', String(index))
      this.$router.push('/search')
    },
    goBack() {
      // Check if there's a previous page in history
      if (window.history.length > 1) {
        this.$router.go(-1)
      } else {
        // Default to homepage if no history
        this.$router.push('/homepage')
      }
    },
    clearSearch() {
      this.searchQuery = ''
    },
    onSearchFocus() {
      // Focus is already handled by autofocus attribute
    },
    handleStorageChange(e) {
      if (e.key === 'savedSearches') {
        this.populateSavedSearches()
      }
    },
    handleVisibilityChange() {
      if (!document.hidden) {
        this.populateSavedSearches()
      }
    }
  }
}
</script>

<style scoped>
/* Header */
.header {
  background: white;
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  position: relative;
}

.search-input-container {
  position: relative;
  flex: 1;
  margin-right: 16px;
}

.search-input {
  width: 100%;
  height: 40px;
  border: 1px solid #d4d7d9;
  border-radius: 28px;
  padding: 0 24px 0 24px;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #242c33;
  line-height: 16px;
  outline: none;
  background: white;
}

.search-input::placeholder {
  color: #242c33;
}

.search-clear {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.search-clear-icon {
  width: 16px;
  height: 16px;
}

.cancel-button {
  background: none;
  border: none;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #006fa6;
  cursor: pointer;
  padding: 0;
}

/* Saved Searches Section */
.saved-searches-section {
  padding: 24px;
}

.saved-searches-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.saved-searches-title {
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 16px;
  color: #242c33;
  line-height: 24px;
}

.divider {
  flex: 1;
  height: 1px;
  background: #e8e9eb;
}

.saved-searches-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.saved-search-item {
  background: #e6f1f5;
  border: 1px solid #006ea6;
  border-radius: 32px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  gap: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: fit-content;
}

.saved-search-item:hover {
  background: #d1e7f0;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.empty-state p {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  margin: 0;
}

.saved-search-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.saved-search-text {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #006fa6;
  line-height: 22px;
}
</style>

