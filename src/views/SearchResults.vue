<template>
  <div class="mobile-container" :class="{ 'menu-open': isMenuOpen || isFilterMenuOpen }">
    <!-- Navigation -->
    <div class="navigation-container">
      <div class="navigation-top">
        <div class="navigation-left">
          <img 
            src="/Illustrations/07_SRP/hamburger-menu.svg" 
            alt="Menu" 
            class="hamburger-icon" 
            @click="openHamburgerMenu"
          >
          <router-link to="/homepage">
            <img 
              src="/Illustrations/05_Brand/logo-full-color.svg" 
              alt="EchoPark" 
              class="logo-icon"
            >
          </router-link>
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

    <!-- Filter Bar -->
    <div class="filter-bar">
      <div class="filter-section" @click="openFilterMenu">
        <img src="/Illustrations/04_UI/filter.svg" alt="Filter" class="filter-icon">
        <span class="filter-text">Filters</span>
      </div>
      <div class="filter-divider"></div>
      <div class="filter-section" @click="openSortMenu">
        <img src="/Illustrations/04_UI/sort.svg" alt="Sort" class="filter-icon">
        <span class="filter-text">Sort by</span>
      </div>
      <div class="filter-divider"></div>
      <div class="filter-section" @click="handleSaveSearch">
        <img 
          :src="saveSearchIconSrc" 
          alt="Save" 
          class="filter-icon"
        >
        <span class="filter-text">{{ saveSearchText }}</span>
      </div>
    </div>

    <!-- Name Search Overlay -->
    <div 
      v-if="showNameSearch" 
      class="name-search-overlay"
      @click.self="closeNameSearch"
    >
      <div class="name-search-modal">
        <div class="name-search-header">
          <button class="name-search-close" @click="closeNameSearch">
            <img 
              src="/Illustrations/Toast icons/pop-up close icon.svg" 
              alt="Close" 
              class="name-search-close-icon"
            >
          </button>
        </div>
        <div class="name-search-form">
          <div 
            class="name-search-input-group" 
            :data-state="nameInputState"
          >
            <input 
              type="text" 
              class="name-search-input" 
              v-model="searchName"
              @focus="nameInputState = 'focus'"
              @blur="nameInputState = searchName ? 'filled' : 'default'"
              placeholder=" "
            >
            <label class="name-search-input-label">Name this search</label>
            <div class="name-search-input-line"></div>
          </div>
        </div>
        <div class="name-search-actions">
          <button class="save-search-btn" @click="saveNamedSearch">Save</button>
          <a href="#" class="manage-alerts-link" @click.prevent="manageAlerts">
            <span>Manage alerts</span>
            <img src="/Illustrations/right arrow.svg" alt="Arrow" class="arrow-icon">
          </a>
        </div>
      </div>
    </div>

    <!-- Filter Pills -->
    <div class="filter-pills">
      <div class="permanent-filter">
        <div class="location-pill">
          <img 
            src="/Illustrations/Filter Bar Icons/location pill.svg" 
            alt="Location" 
            class="location-icon"
          >
          <span class="location-text-white">75214</span>
        </div>
        <span class="filter-separator">|</span>
        <span class="filter-description" style="white-space: nowrap;">Cars within 250 mi</span>
      </div>
      <div v-if="activeFilters.length > 0" class="filter-pills-row">
        <div v-if="activeFilters.length > 6" class="more-filters">
          <span class="more-filters-text">+{{ activeFilters.length - 6 }}</span>
        </div>
        <div 
          v-for="(filter, index) in activeFilters.slice(0, 6)" 
          :key="index"
          class="filter-pill"
        >
          <span class="filter-pill-text">{{ filter }}</span>
          <button class="filter-pill-close" @click="removeFilter(filter)">
            <img src="/Illustrations/04_UI/x.svg" alt="Close" class="close-icon">
          </button>
        </div>
      </div>
    </div>

    <!-- Results Header -->
    <div class="results-header">
      <h1 class="results-title">{{ resultsTitle }}</h1>
    </div>

    <!-- Results Grid -->
    <div class="results-grid">
      <div 
        v-for="(car, index) in cars" 
        :key="index"
        class="srp-tile"
      >
        <div class="tile-image-container">
          <img :src="car.image" alt="Car" class="tile-image">
          <button 
            class="favorite-button" 
            @click="toggleFavorite(index)"
            :class="{ 'favorited': car.isFavorite }"
          >
            <img 
              :src="car.isFavorite ? '/Illustrations/07_SRP/favorite.svg' : '/Illustrations/07_SRP/favorite.svg'" 
              alt="Favorite" 
              class="favorite-icon"
            >
          </button>
        </div>
        <div class="carousel-dots">
          <img src="/Illustrations/07_SRP/carousel-dots.svg" alt="Carousel dots">
        </div>
        <div class="tile-content">
          <div class="tile-details">
            <div class="tile-meta">
              <span class="tile-year">{{ car.year }}</span>
              <span class="tile-separator">|</span>
              <span class="tile-mileage">{{ car.mileage }}k mi</span>
              <span class="tile-separator">|</span>
              <span class="tile-stock">Stock #: {{ car.stock }}</span>
              <div v-if="car.isNew && isViewingSavedSearch" class="srp-tile-new-badge">
                <img 
                  src="/Illustrations/02_Filter/saved-search-car-icon.svg" 
                  alt="New" 
                  class="srp-tile-new-badge-icon"
                >
              </div>
            </div>
            <h3 class="tile-title">{{ car.title }}</h3>
          </div>
          <div class="tile-price-location">
            <div class="tile-price">
              <div class="price-container">
                <div style="display: flex; align-items: end;">
                  <span class="price-currency">$</span>
                  <span class="price-amount">{{ car.price.toLocaleString() }}</span>
                </div>
              </div>
            </div>
            <div class="tile-location">
              <p class="location-label">Pick up today at</p>
              <p class="location-details">
                <span>{{ car.store }}</span>
                <span class="location-distance"> ({{ car.distance }} mi)</span>
              </p>
            </div>
          </div>
          <div class="tile-actions">
            <button class="calculator-button">
              <img src="/Illustrations/07_SRP/calculator.svg" alt="Calculator" class="calculator-icon">
            </button>
            <button class="test-drive-button">
              <img src="/Illustrations/07_SRP/test-drive.svg" alt="Test Drive" class="test-drive-icon">
              <span class="test-drive-text">Schedule test drive</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Menu Overlay -->
    <div 
      v-if="isFilterMenuOpen" 
      class="filter-menu-overlay"
      @click.self="closeFilterMenu"
    >
      <div class="filter-menu-panel">
        <!-- Header -->
        <div class="filter-menu-header">
          <div class="filter-menu-tabs">
            <div 
              class="filter-tab" 
              :class="{ 'active': activeTab === 'filters' }"
              @click="switchTab('filters')"
            >
              <img 
                src="/Illustrations/filter menu icons/Filter menu icon.svg" 
                alt="Filter" 
                class="filter-tab-icon"
              >
              <span class="filter-tab-text">Filters</span>
              <div class="filter-tab-bar"></div>
            </div>
            <div 
              class="filter-tab" 
              :class="{ 'active': activeTab === 'searches' }"
              @click="switchTab('searches')"
            >
              <img 
                src="/Illustrations/filter menu icons/Saved searches filter menu.svg" 
                alt="Saved" 
                class="filter-tab-icon"
              >
              <span class="filter-tab-text">My searches</span>
              <div class="filter-tab-bar"></div>
            </div>
          </div>
          <button class="filter-menu-close" @click="closeFilterMenu">
            <img 
              src="/Illustrations/filter menu icons/Filter menu close.svg" 
              alt="Close" 
              class="filter-close-icon"
            >
          </button>
        </div>

        <!-- Filter Pills Section -->
        <div v-if="activeTab === 'filters'" class="filter-pills-section">
          <div class="permanent-filter">
            <div class="location-pill">
              <img 
                src="/Illustrations/Filter Bar Icons/location pill.svg" 
                alt="Location" 
                class="location-icon"
              >
              <span class="location-text-white">75214</span>
            </div>
            <span class="filter-separator">|</span>
            <span class="filter-description" style="white-space: nowrap;">Cars within 250 mi</span>
          </div>
          <div v-if="activeFilters.length > 0" class="filter-pills-row">
            <div v-if="activeFilters.length > 6" class="more-filters">
              <span class="more-filters-text">+{{ activeFilters.length - 6 }}</span>
            </div>
            <div 
              v-for="(filter, index) in activeFilters.slice(0, 6)" 
              :key="index"
              class="filter-pill"
            >
              <span class="filter-pill-text">{{ filter }}</span>
              <button class="filter-pill-close" @click="removeFilter(filter)">
                <img src="/Illustrations/04_UI/x.svg" alt="Close" class="close-icon">
              </button>
            </div>
          </div>
          <div v-if="activeFilters.length > 0" class="reset-link" @click="resetAllFilters">
            <span>Reset</span>
          </div>
        </div>

        <!-- Filter Options List -->
        <div v-if="activeTab === 'filters'" class="filter-options-list">
          <div 
            v-for="option in filterOptions" 
            :key="option"
            class="filter-option"
            @click="openFilterOption(option)"
          >
            <span class="filter-option-text">{{ option }}</span>
            <img 
              src="/Illustrations/filter menu icons/Parent filter icon.svg" 
              alt="Arrow" 
              class="filter-arrow"
            >
          </div>
        </div>

        <!-- My Searches Content -->
        <div v-if="activeTab === 'searches'" class="my-searches-content">
          <div v-if="!isSignedIn" class="my-searches-not-signed-in">
            <div class="my-searches-message">
              <p class="my-searches-text">Sign in to save searches & get notified about new matches.</p>
            </div>
            <div class="my-searches-actions">
              <button class="my-searches-signin-btn" @click="openSignIn">Sign in</button>
              <a href="#" class="my-searches-create-link" @click.prevent="openAccountCreation">Create an account</a>
            </div>
          </div>
          <div v-else-if="savedSearches.length === 0" class="my-searches-empty-state">
            <div class="empty-state-illustration">
              <img 
                src="/Illustrations/09_Empty_States/no-saved-searches.svg" 
                alt="No saved searches" 
                class="empty-state-icon"
              >
            </div>
            <div class="empty-state-content">
              <h3 class="empty-state-heading">You don't have any saved searches</h3>
              <p class="empty-state-description">Save a search to get notified when new cars match what you're looking for.</p>
            </div>
          </div>
          <div v-else class="my-searches-signed-in">
            <div class="saved-searches-section">
              <h3 class="saved-searches-heading">Saved searches</h3>
              <div class="saved-searches-list">
                <div 
                  v-for="(search, index) in savedSearches" 
                  :key="index"
                  class="saved-search-card"
                  :class="{ 'selected': selectedSearchIndex === index }"
                  @click="selectSavedSearch(index)"
                >
                  <div class="saved-search-info">
                    <h4 class="saved-search-name">{{ search.name }}</h4>
                    <p class="saved-search-criteria">{{ search.criteria }}</p>
                  </div>
                  <div v-if="search.newResults" class="saved-search-status">
                    <div class="car-icon-container">
                      <img 
                        src="/Illustrations/02_Filter/saved-search-car-icon.svg" 
                        alt="Car" 
                        class="car-icon"
                      >
                    </div>
                    <span class="new-results">{{ search.newResults }} new</span>
                  </div>
                </div>
              </div>
              <div class="manage-alerts-link">
                <span>Manage alerts</span>
                <img src="/Illustrations/right arrow.svg" alt="Arrow" class="arrow-icon">
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Bottom Button -->
      <div class="filter-menu-bottom">
        <button class="view-results-btn" @click="closeFilterMenu">
          <span class="view-results-text">View results</span>
        </button>
      </div>
    </div>

    <!-- Body Style Filter Overlay -->
    <div 
      v-if="showBodyStyleFilter" 
      class="body-style-overlay show"
      @click.self="closeBodyStyleFilter"
    >
      <div class="body-style-panel">
        <!-- Header -->
        <div class="body-style-header">
          <div class="body-style-back" @click="closeBodyStyleFilter">
            <img 
              src="/Illustrations/filter menu icons/distance&stores icons/Right Icon.svg" 
              alt="Back" 
              class="body-style-back-icon"
            >
            <span class="body-style-back-text">All filters</span>
          </div>
        </div>
        
        <!-- Body Style Heading -->
        <div class="body-style-heading">
          <h3>Body style</h3>
        </div>
        
        <!-- Body Style Options -->
        <div class="body-style-options">
          <div 
            v-for="style in bodyStyles" 
            :key="style.name"
            class="body-style-option"
            :class="{ 'selected': selectedBodyStyles.includes(style.name) }"
            @click="toggleBodyStyle(style.name)"
          >
            <div class="body-style-info">
              <span class="body-style-name">{{ style.name }}</span>
              <span class="body-style-count">({{ style.count }})</span>
            </div>
            <img 
              :src="style.icon" 
              :alt="style.name" 
              class="body-style-icon"
            >
          </div>
        </div>
        
        <!-- Bottom Button -->
        <div class="body-style-bottom">
          <button class="view-results-btn" @click="applyBodyStyles">
            <span class="view-results-text">View results</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Price & Payment Filter Overlay -->
    <div 
      v-if="showPriceFilter" 
      class="price-payment-overlay show"
      @click.self="closePriceFilter"
    >
      <div class="price-payment-panel">
        <!-- Header -->
        <div class="price-payment-header">
          <div class="price-payment-back" @click="closePriceFilter">
            <img 
              src="/Illustrations/filter menu icons/distance&stores icons/Right Icon.svg" 
              alt="Back" 
              class="price-payment-back-icon"
            >
            <span class="price-payment-back-text">All filters</span>
          </div>
        </div>
        
        <!-- Price & Payment Heading -->
        <div class="price-payment-heading">
          <h3>Price & payment</h3>
        </div>
        
        <!-- Price & Payment Content -->
        <div class="price-payment-content">
          <!-- Segmented Control (Non-interactive) -->
          <div class="segmented-control">
            <div class="segmented-option selected">
              <span>Price</span>
            </div>
            <div class="segmented-option">
              <span>Payment</span>
            </div>
          </div>
          
          <!-- Price Range Inputs -->
          <div class="price-inputs">
            <div class="price-input-group">
              <label class="price-input-label">Min</label>
              <div class="price-input-container">
                <input 
                  type="text" 
                  class="price-input" 
                  :value="formatPrice(minPrice)" 
                  @input="updateMinPrice"
                  @blur="formatMinPrice"
                >
              </div>
            </div>
            <div class="price-input-group">
              <label class="price-input-label">Max</label>
              <div class="price-input-container">
                <input 
                  type="text" 
                  class="price-input" 
                  :value="formatPrice(maxPrice)" 
                  @input="updateMaxPrice"
                  @blur="formatMaxPrice"
                >
              </div>
            </div>
          </div>
          
          <!-- Range Slider -->
          <div class="range-slider-container">
            <div class="range-slider-wrapper">
              <div class="range-slider-track"></div>
              <div 
                class="range-slider-range" 
                :style="rangeBarStyle"
              ></div>
              <input 
                type="range" 
                class="range-slider range-slider-min" 
                v-model.number="minPrice" 
                min="0" 
                max="100000" 
                step="1000"
                @input="updateRangeBar"
              >
              <input 
                type="range" 
                class="range-slider range-slider-max" 
                v-model.number="maxPrice" 
                min="0" 
                max="100000" 
                step="1000"
                @input="updateRangeBar"
              >
              <div 
                class="range-slider-thumb range-slider-thumb-min" 
                :style="minThumbStyle"
              ></div>
              <div 
                class="range-slider-thumb range-slider-thumb-max" 
                :style="maxThumbStyle"
              ></div>
            </div>
          </div>
        </div>
        
        <!-- Bottom Button -->
        <div class="price-payment-bottom">
          <button class="view-results-btn" @click="applyPriceFilter">
            <span class="view-results-text">View results</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Sort Menu Overlay -->
    <div 
      v-if="showSortMenu" 
      class="sort-menu-overlay show"
      @click.self="closeSortMenu"
    >
      <div class="sort-menu-panel">
        <div class="sort-menu-header">
          <h3 class="sort-menu-title">Sort by</h3>
        </div>
        <div class="sort-menu-options">
          <div 
            class="sort-option" 
            :class="{ 'selected': selectedSortOption === 'new-arrivals' }"
            @click="selectSortOption('new-arrivals')"
          >
            <span class="sort-option-text">New Arrivals</span>
            <span class="sort-option-check">✓</span>
          </div>
          <div 
            class="sort-option" 
            :class="{ 'selected': selectedSortOption === 'distance-nearest' }"
            @click="selectSortOption('distance-nearest')"
          >
            <span class="sort-option-text">Distance: Nearest</span>
            <span class="sort-option-check">✓</span>
          </div>
          <div 
            class="sort-option" 
            :class="{ 'selected': selectedSortOption === 'mileage-highest' }"
            @click="selectSortOption('mileage-highest')"
          >
            <span class="sort-option-text">Mileage: Highest</span>
            <span class="sort-option-check">✓</span>
          </div>
          <div 
            class="sort-option" 
            :class="{ 'selected': selectedSortOption === 'mileage-lowest' }"
            @click="selectSortOption('mileage-lowest')"
          >
            <span class="sort-option-text">Mileage: Lowest</span>
            <span class="sort-option-check">✓</span>
          </div>
          <div 
            class="sort-option" 
            :class="{ 'selected': selectedSortOption === 'price-highest' }"
            @click="selectSortOption('price-highest')"
          >
            <span class="sort-option-text">Price: Highest</span>
            <span class="sort-option-check">✓</span>
          </div>
          <div 
            class="sort-option" 
            :class="{ 'selected': selectedSortOption === 'price-lowest' }"
            @click="selectSortOption('price-lowest')"
          >
            <span class="sort-option-text">Price: Lowest</span>
            <span class="sort-option-check">✓</span>
          </div>
          <div 
            class="sort-option" 
            :class="{ 'selected': selectedSortOption === 'year-newest' }"
            @click="selectSortOption('year-newest')"
          >
            <span class="sort-option-text">Year: Newest</span>
            <span class="sort-option-check">✓</span>
          </div>
          <div 
            class="sort-option" 
            :class="{ 'selected': selectedSortOption === 'year-oldest' }"
            @click="selectSortOption('year-oldest')"
          >
            <span class="sort-option-text">Year: Oldest</span>
            <span class="sort-option-check">✓</span>
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
import HamburgerMenu from '../components/HamburgerMenu.vue'

export default {
  name: 'SearchResults',
  components: {
    HamburgerMenu
  },
  data() {
    return {
      isMenuOpen: false,
      isFilterMenuOpen: false,
      activeTab: 'filters',
      showNameSearch: false,
      searchName: '',
      nameInputState: 'default',
      isSearchSaved: false,
      activeFilters: [],
      selectedSearchIndex: null,
      showBodyStyleFilter: false,
      showPriceFilter: false,
      selectedBodyStyles: [],
      isViewingSavedSearch: false,
      savedSearchesUpdateKey: 0, // Used to force reactivity on saved searches list
      minPrice: 5000,
      maxPrice: 70000,
      showSortMenu: false,
      selectedSortOption: 'price-lowest', // Default to price-lowest for homepage
      originalCarsOrder: [], // Store original order for distance-nearest
      cars: [
        {
          year: 2020,
          mileage: 126,
          stock: 'PDW077969',
          title: 'Lamborghini Aventador LP 750-4 Superveloce Roadster SE',
          price: 30499,
          store: 'SW Houston store',
          distance: 125,
          image: '/Illustrations/07_SRP/srp-tile-car-image.png',
          isFavorite: false,
          added: '11/10/2025',
          isNew: true
        },
        {
          year: 2019,
          mileage: 45,
          stock: 'PDW077970',
          title: 'BMW 3 Series 330i',
          price: 28999,
          store: 'Dallas store',
          distance: 200,
          image: '/Illustrations/07_SRP/srp-tile-car-image.png',
          isFavorite: false,
          added: '11/10/2025',
          isNew: true
        },
        {
          year: 2021,
          mileage: 32,
          stock: 'PDW077971',
          title: 'Tesla Model 3',
          price: 34999,
          store: 'Austin store',
          distance: 150,
          image: '/Illustrations/07_SRP/srp-tile-car-image.png',
          isFavorite: false,
          added: '11/9/2025',
        },
        {
          year: 2020,
          mileage: 78,
          stock: 'PDW077972',
          title: 'Toyota Camry XSE',
          price: 22999,
          store: 'Houston store',
          distance: 100,
          image: '/Illustrations/07_SRP/srp-tile-car-image.png',
          isFavorite: false,
          added: '10/9/2025',
        }
      ],
      filterOptions: [
        'Distance & shipping',
        'Make/Model/Trim',
        'Body style',
        'Price & payment',
        'Year',
        'Mileage',
        'Features',
        'MPG & engine type',
        'Drive type & transmission',
        'Color'
      ],
      bodyStyles: [
        { name: 'Convertible', count: 66, icon: '/Illustrations/Body style illustrations/Convertible.svg' },
        { name: 'Coupe', count: 102, icon: '/Illustrations/Body style illustrations/Coupe.svg' },
        { name: 'Hatchback', count: 87, icon: '/Illustrations/Body style illustrations/Hatchback.svg' },
        { name: 'Sedan', count: 3102, icon: '/Illustrations/Body style illustrations/Sedan.svg' },
        { name: 'SUV', count: 124, icon: '/Illustrations/Body style illustrations/SUV.svg' },
        { name: 'Truck', count: 573, icon: '/Illustrations/Body style illustrations/Truck.svg' },
        { name: 'Van/Minivan', count: 77, icon: '/Illustrations/Body style illustrations/Minivan.svg' },
        { name: 'Wagon', count: 2, icon: '/Illustrations/Body style illustrations/Wagon.svg' }
      ]
    }
  },
  computed: {
    saveSearchIconSrc() {
      return (this.isSearchSaved || this.isViewingSavedSearch)
        ? '/Illustrations/04_UI/search-saved.svg'
        : '/Illustrations/04_UI/save-search.svg'
    },
    saveSearchText() {
      if (this.isSearchSaved) {
        // User has saved the current search via the save search feature
        return 'Search saved'
      } else if (this.isViewingSavedSearch) {
        // User is viewing from a saved search click
        return 'Saved'
      } else {
        // Default state
        return 'Save search'
      }
    },
    resultsTitle() {
      if (this.activeFilters.length === 0) {
        return `${this.cars.length} used cars for sale at EchoPark`
      }
      return `${this.cars.length} used ${this.activeFilters.slice(0, 6).join(', ')} for sale at EchoPark`
    },
    isSignedIn() {
      // Always return true - no sign-in required
      return true
    },
    savedSearches() {
      // Include savedSearchesUpdateKey to force reactivity when saved searches change
      this.savedSearchesUpdateKey
      return JSON.parse(localStorage.getItem('savedSearches') || '[]').map(search => ({
        name: search.name,
        criteria: this.formatSearchCriteria(search),
        newResults: Math.floor(Math.random() * 100)
      }))
    },
    rangeBarStyle() {
      const minPercent = (this.minPrice / 100000) * 100
      const maxPercent = (this.maxPrice / 100000) * 100
      return {
        left: `${minPercent}%`,
        width: `${maxPercent - minPercent}%`
      }
    },
    minThumbStyle() {
      const percent = (this.minPrice / 100000) * 100
      return {
        left: `${percent}%`
      }
    },
    maxThumbStyle() {
      const percent = (this.maxPrice / 100000) * 100
      return {
        left: `${percent}%`
      }
    }
  },
  mounted() {
    // Initialize saved searches if they don't exist
    this.initializeSavedSearches()
    
    // Store the original order BEFORE any sorting
    this.originalCarsOrder = [...this.cars]
    
    // Check for selected saved search from sessionStorage FIRST
    const selectedIndex = sessionStorage.getItem('selectedSavedSearchIndex')
    const isComingFromSavedSearch = selectedIndex !== null
    const savedSort = sessionStorage.getItem('sortBy')
    
    if (isComingFromSavedSearch) {
      this.selectedSearchIndex = parseInt(selectedIndex)
      this.isViewingSavedSearch = true
      sessionStorage.removeItem('selectedSavedSearchIndex')
      
      // Sort by added date (most recent to oldest) when coming from saved search
      this.selectedSortOption = 'new-arrivals'
      sessionStorage.setItem('sortBy', 'new-arrivals')
      this.applySort('new-arrivals')
    } else {
      // Coming from homepage - always default to price (lowest to highest)
      this.selectedSortOption = 'price-lowest'
      sessionStorage.setItem('sortBy', 'price-lowest')
      this.applySort('price-lowest')
    }
    
    // Load filters from sessionStorage
    this.loadFiltersFromSession()
  },
  watch: {
    activeFilters: {
      handler(newFilters) {
        // Save filters to sessionStorage whenever they change
        sessionStorage.setItem('activeFilters', JSON.stringify(newFilters))
      },
      deep: true
    },
    selectedBodyStyles: {
      handler(newStyles) {
        // Save selected body styles to sessionStorage
        sessionStorage.setItem('selectedBodyStyles', JSON.stringify(newStyles))
      },
      deep: true
    }
  },
  methods: {
    openHamburgerMenu() {
      this.isMenuOpen = true
    },
    closeHamburgerMenu() {
      this.isMenuOpen = false
    },
    navigateToSavedSearches() {
      this.$router.push('/saved-searches')
    },
    openFilterMenu() {
      this.isFilterMenuOpen = true
    },
    closeFilterMenu() {
      this.isFilterMenuOpen = false
    },
    openSortMenu() {
      this.showSortMenu = true
      // Prevent background scrolling
      document.body.style.overflow = 'hidden'
    },
    closeSortMenu() {
      this.showSortMenu = false
      // Restore background scrolling
      document.body.style.overflow = 'auto'
    },
    selectSortOption(sortType) {
      this.selectedSortOption = sortType
      // Store sort preference in sessionStorage
      sessionStorage.setItem('sortBy', sortType)
      
      // Apply the sort
      this.applySort(sortType)
      
      // Close the sort menu after a short delay
      setTimeout(() => {
        this.closeSortMenu()
      }, 300)
    },
    parseDate(dateString) {
      // Parse date string in format "MM/DD/YYYY"
      if (!dateString) return new Date(0) // Return epoch date if missing
      const parts = dateString.split('/')
      if (parts.length !== 3) return new Date(0)
      const month = parseInt(parts[0]) - 1 // Month is 0-indexed
      const day = parseInt(parts[1])
      const year = parseInt(parts[2])
      return new Date(year, month, day)
    },
    sortByAddedDate() {
      // Sort by added date (most recent to oldest)
      this.cars.sort((a, b) => {
        const dateA = this.parseDate(a.added)
        const dateB = this.parseDate(b.added)
        return dateB - dateA // Most recent first (descending)
      })
    },
    sortByPriceLowest() {
      // Sort by price (lowest to highest)
      this.cars.sort((a, b) => a.price - b.price)
    },
    applySort(sortType) {
      // Create a copy of cars array to sort
      let sortedCars = [...this.cars]
      
      switch (sortType) {
        case 'new-arrivals':
          // New arrivals: sort by added date (most recent to oldest)
          sortedCars.sort((a, b) => {
            const dateA = this.parseDate(a.added)
            const dateB = this.parseDate(b.added)
            return dateB - dateA // Most recent first (descending)
          })
          break
        case 'price-lowest':
          // Price lowest: sort by price ascending
          sortedCars.sort((a, b) => a.price - b.price)
          break
        case 'price-highest':
          // Price highest: sort by price descending
          sortedCars.sort((a, b) => b.price - a.price)
          break
        case 'year-newest':
          // Year newest: sort by year descending
          sortedCars.sort((a, b) => b.year - a.year)
          break
        case 'year-oldest':
          // Year oldest: sort by year ascending
          sortedCars.sort((a, b) => a.year - b.year)
          break
        case 'mileage-lowest':
          // Mileage lowest: sort by mileage ascending
          sortedCars.sort((a, b) => a.mileage - b.mileage)
          break
        case 'mileage-highest':
          // Mileage highest: sort by mileage descending
          sortedCars.sort((a, b) => b.mileage - a.mileage)
          break
        case 'distance-nearest':
        default:
          // Distance nearest: restore original order
          sortedCars = [...this.originalCarsOrder]
          break
      }
      
      // Update the cars array
      this.cars = sortedCars
    },
    handleSaveSearch() {
      if (this.isViewingSavedSearch) {
        // User is viewing a saved search - clicking will unsave it
        this.unsaveSearch()
      } else if (this.isSearchSaved) {
        // User has saved the current search - could show manage alerts
        this.manageAlerts()
      } else {
        // Show name search modal
        this.showNameSearch = true
      }
    },
    closeNameSearch() {
      this.showNameSearch = false
      this.searchName = ''
      this.nameInputState = 'default'
    },
    saveNamedSearch() {
      if (!this.searchName.trim()) {
        return
      }
      
      // Save to localStorage
      const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]')
      savedSearches.push({
        name: this.searchName,
        bodyStyles: this.activeFilters.filter(f => ['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback', 'Convertible', 'Wagon', 'Minivan'].includes(f)),
        priceRange: { min: '5000', max: '70000' },
        createdAt: new Date().toISOString()
      })
      localStorage.setItem('savedSearches', JSON.stringify(savedSearches))
      
      // Force reactivity update
      this.savedSearchesUpdateKey++
      
      this.isSearchSaved = true
      this.closeNameSearch()
    },
    manageAlerts() {
      console.log('Manage alerts')
    },
    removeFilter(filter) {
      this.activeFilters = this.activeFilters.filter(f => f !== filter)
      // Reset save search state when filters are modified
      this.resetSaveSearchState()
      // Filters are automatically saved via watcher
    },
    resetAllFilters() {
      this.activeFilters = []
      this.selectedBodyStyles = []
      this.isViewingSavedSearch = false
      this.selectedSearchIndex = null
      this.resetSaveSearchState()
      // Clear from sessionStorage
      sessionStorage.removeItem('activeFilters')
      sessionStorage.removeItem('selectedBodyStyles')
    },
    resetSaveSearchState() {
      // Reset save search states when filters are modified
      this.isSearchSaved = false
      this.isViewingSavedSearch = false
      this.selectedSearchIndex = null
    },
    unsaveSearch() {
      // Remove the saved search from the list
      if (this.selectedSearchIndex !== null) {
        const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]')
        if (savedSearches[this.selectedSearchIndex]) {
          // Remove the saved search at the selected index
          savedSearches.splice(this.selectedSearchIndex, 1)
          localStorage.setItem('savedSearches', JSON.stringify(savedSearches))
          
          // Force reactivity update
          this.savedSearchesUpdateKey++
          
          // Reset the state
          this.selectedSearchIndex = null
          this.isViewingSavedSearch = false
        }
      }
    },
    loadFiltersFromSession() {
      // Load active filters from sessionStorage
      const savedFilters = sessionStorage.getItem('activeFilters')
      if (savedFilters) {
        try {
          this.activeFilters = JSON.parse(savedFilters)
        } catch (e) {
          console.error('Error loading filters from session:', e)
          this.activeFilters = []
        }
      }
      
      // Load selected body styles from sessionStorage
      const savedBodyStyles = sessionStorage.getItem('selectedBodyStyles')
      if (savedBodyStyles) {
        try {
          this.selectedBodyStyles = JSON.parse(savedBodyStyles)
        } catch (e) {
          console.error('Error loading body styles from session:', e)
          this.selectedBodyStyles = []
        }
      }
    },
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
    switchTab(tab) {
      this.activeTab = tab
    },
    openFilterOption(option) {
      // Close the filter menu first
      this.isFilterMenuOpen = false
      
      // Open the appropriate filter overlay
      if (option === 'Body style') {
        // Sync selected body styles with active filters
        const bodyStyleNames = this.bodyStyles.map(s => s.name)
        this.selectedBodyStyles = this.activeFilters.filter(filter => 
          bodyStyleNames.includes(filter)
        )
        setTimeout(() => {
          this.showBodyStyleFilter = true
        }, 100)
      } else if (option === 'Price & payment') {
        // Initialize price values from existing filter if any
        const existingPriceFilter = this.activeFilters.find(f => f.startsWith('$') && f.includes('-'))
        if (existingPriceFilter) {
          const match = existingPriceFilter.match(/\$([\d,]+)-\$([\d,]+)/)
          if (match) {
            this.minPrice = parseInt(match[1].replace(/,/g, ''))
            this.maxPrice = parseInt(match[2].replace(/,/g, ''))
          }
        } else {
          // Reset to defaults
          this.minPrice = 5000
          this.maxPrice = 70000
        }
        setTimeout(() => {
          this.showPriceFilter = true
        }, 100)
      } else {
        console.log('Filter option not yet implemented:', option)
      }
    },
    selectSavedSearch(index) {
      this.selectedSearchIndex = index
      this.isViewingSavedSearch = true
      // Apply saved search filters
      const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]')
      if (savedSearches[index]) {
        const savedSearch = savedSearches[index]
        
        // Clear all non-persistent filter pills (keep only permanent location filter)
        // The permanent filter is the location (75214) which we want to keep
        // So we clear all activeFilters
        this.activeFilters = []
        this.selectedBodyStyles = []
        
        // Repopulate from saved search record
        if (savedSearch.bodyStyles && Array.isArray(savedSearch.bodyStyles)) {
          // Add body styles to both activeFilters and selectedBodyStyles
          savedSearch.bodyStyles.forEach(style => {
            if (!this.activeFilters.includes(style)) {
              this.activeFilters.push(style)
            }
            if (!this.selectedBodyStyles.includes(style)) {
              this.selectedBodyStyles.push(style)
            }
          })
        }
        
        // Add price range if it exists
        if (savedSearch.priceRange) {
          const min = savedSearch.priceRange.min || '5000'
          const max = savedSearch.priceRange.max || '70000'
          const priceFilter = `$${parseInt(min).toLocaleString()}-$${parseInt(max).toLocaleString()}`
          if (!this.activeFilters.includes(priceFilter)) {
            this.activeFilters.push(priceFilter)
          }
        }
        
        // Add make if it exists
        if (savedSearch.make) {
          if (!this.activeFilters.includes(savedSearch.make)) {
            this.activeFilters.push(savedSearch.make)
          }
        }
        
        // Add model if it exists
        if (savedSearch.model) {
          if (!this.activeFilters.includes(savedSearch.model)) {
            this.activeFilters.push(savedSearch.model)
          }
        }
        
        // Add fuel type if it exists
        if (savedSearch.fuelType) {
          const fuelTypeMap = {
            'gas': 'Gas',
            'electric': 'Electric',
            'hybrid': 'Hybrid'
          }
          const fuelTypeLabel = fuelTypeMap[savedSearch.fuelType] || savedSearch.fuelType
          if (!this.activeFilters.includes(fuelTypeLabel)) {
            this.activeFilters.push(fuelTypeLabel)
          }
        }
        
        // Add drivetrain if it exists
        if (savedSearch.drivetrain) {
          const drivetrainMap = {
            'awd': 'AWD',
            'fwd': 'FWD',
            'rwd': 'RWD'
          }
          const drivetrainLabel = drivetrainMap[savedSearch.drivetrain] || savedSearch.drivetrain
          if (!this.activeFilters.includes(drivetrainLabel)) {
            this.activeFilters.push(drivetrainLabel)
          }
        }
        
        // Add year minimum if it exists
        if (savedSearch.yearMin) {
          const yearFilter = `${savedSearch.yearMin}+`
          if (!this.activeFilters.includes(yearFilter)) {
            this.activeFilters.push(yearFilter)
          }
        }
        
        // Sort by added date (most recent to oldest) when selecting a saved search
        this.selectedSortOption = 'new-arrivals'
        sessionStorage.setItem('sortBy', 'new-arrivals')
        this.applySort('new-arrivals')
        
        // Close the filter menu after applying
        this.closeFilterMenu()
      }
    },
    toggleFavorite(index) {
      this.cars[index].isFavorite = !this.cars[index].isFavorite
    },
    openSignIn() {
      console.log('Open sign in')
    },
    openAccountCreation() {
      console.log('Open account creation')
    },
    closeBodyStyleFilter() {
      this.showBodyStyleFilter = false
    },
    closePriceFilter() {
      this.showPriceFilter = false
    },
    formatPrice(value) {
      return `$${parseInt(value).toLocaleString()}`
    },
    updateMinPrice(event) {
      const value = event.target.value.replace(/[^0-9]/g, '')
      if (value) {
        this.minPrice = Math.min(parseInt(value), this.maxPrice - 1000)
      }
    },
    updateMaxPrice(event) {
      const value = event.target.value.replace(/[^0-9]/g, '')
      if (value) {
        this.maxPrice = Math.max(parseInt(value), this.minPrice + 1000)
      }
    },
    formatMinPrice(event) {
      if (this.minPrice) {
        event.target.value = this.formatPrice(this.minPrice)
      }
    },
    formatMaxPrice(event) {
      if (this.maxPrice) {
        event.target.value = this.formatPrice(this.maxPrice)
      }
    },
    updateRangeBar() {
      // Ensure min doesn't exceed max and vice versa
      if (this.minPrice >= this.maxPrice) {
        if (this.minPrice >= 100000) {
          this.maxPrice = 100000
          this.minPrice = 99000
        } else {
          this.maxPrice = this.minPrice + 1000
        }
      }
    },
    applyPriceFilter() {
      // Remove existing price filter if any
      this.activeFilters = this.activeFilters.filter(f => !f.startsWith('$') || !f.includes('-'))
      
      // Add new price filter
      const priceFilter = `${this.formatPrice(this.minPrice)}-${this.formatPrice(this.maxPrice)}`
      if (!this.activeFilters.includes(priceFilter)) {
        this.activeFilters.push(priceFilter)
      }
      
      // Reset save search state
      this.resetSaveSearchState()
      
      // Close the price filter overlay
      this.closePriceFilter()
    },
    toggleBodyStyle(styleName) {
      const index = this.selectedBodyStyles.indexOf(styleName)
      if (index > -1) {
        this.selectedBodyStyles.splice(index, 1)
      } else {
        this.selectedBodyStyles.push(styleName)
      }
    },
    applyBodyStyles() {
      // Store previous filter count to detect changes
      const previousFilterCount = this.activeFilters.length
      
      // Add selected body styles to active filters
      this.selectedBodyStyles.forEach(style => {
        if (!this.activeFilters.includes(style)) {
          this.activeFilters.push(style)
        }
      })
      // Remove unselected body styles from active filters
      const bodyStyleNames = this.bodyStyles.map(s => s.name)
      this.activeFilters = this.activeFilters.filter(filter => {
        if (bodyStyleNames.includes(filter)) {
          return this.selectedBodyStyles.includes(filter)
        }
        return true
      })
      
      // Reset save search state if filters changed
      if (this.activeFilters.length !== previousFilterCount) {
        this.resetSaveSearchState()
      }
      
      // Filters are automatically saved via watcher
      this.closeBodyStyleFilter()
    },
    formatSearchCriteria(search) {
      const parts = []
      if (search.make) parts.push(search.make)
      if (search.bodyStyles && search.bodyStyles.length > 0) parts.push(search.bodyStyles.join(', '))
      if (search.priceRange) {
        parts.push(`$${search.priceRange.min}-${search.priceRange.max}`)
      }
      return parts.join(', ') || 'No criteria'
    }
  }
}
</script>

<style scoped>
/* Navigation styles - same as homepage */
.navigation-container {
  background: white;
  border-bottom: 1px solid #e8e9eb;
  padding: 16px 24px 8px;
  position: relative;
  z-index: 1000;
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
}

.search-container {
  background: #f5f4f3;
  border: 1px solid #e8e9eb;
  border-radius: 32px;
  padding: 16px 24px;
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
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.search-icon {
  width: 24px;
  height: 24px;
  display: block;
}

/* Filter Bar */
.filter-bar {
  background: white !important;
  border-bottom: 1px solid #e8e9eb;
  display: flex;
  height: 51px;
  align-items: center;
  position: relative;
  z-index: 4000;
}

.filter-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 8px;
  height: 100%;
  cursor: pointer;
}

.filter-icon {
  width: 18px;
  height: 18px;
}

.filter-text {
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #006fa6;
  line-height: 24px;
}

.filter-divider {
  width: 1px;
  height: 50.5px;
  background: #e8e9eb;
}

/* Name Search Overlay */
.name-search-overlay {
  position: fixed;
  top: 158px;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 3500;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}

.name-search-modal {
  background: white;
  border: 1px solid #e8e9eb;
  border-radius: 0 0 16px 16px;
  padding: 24px 24px 16px;
  width: 100%;
  max-width: 375px;
  animation: slideDownModal 0.3s ease-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.name-search-header {
  position: relative;
  margin-bottom: 24px;
}

.name-search-close {
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
}

.name-search-close-icon {
  width: 24px;
  height: 24px;
}

.name-search-input-group {
  position: relative;
  margin-bottom: 24px;
}

.name-search-input {
  width: 100%;
  height: 34px;
  border: none;
  background: transparent;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #242c33;
  line-height: 16px;
  padding: 0;
  outline: none;
}

.name-search-input-label {
  position: absolute;
  left: 0;
  top: 8px;
  font-size: 16px;
  color: #999;
  pointer-events: none;
  transition: all 0.2s ease;
  transform-origin: left top;
}

.name-search-input-group[data-state="focus"] .name-search-input-label,
.name-search-input-group[data-state="filled"] .name-search-input-label {
  transform: translateY(-20px) scale(0.75);
  color: #006fa6;
}

.name-search-input-group[data-state="focus"] .name-search-input-line {
  background: #006fa6;
}

.name-search-input-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: #e8e9eb;
  transition: background-color 0.2s ease;
}

.name-search-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
}

.save-search-btn {
  background: #3e8500;
  border: none;
  border-radius: 100px;
  color: white;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 14px;
  padding: 13px 24px;
  cursor: pointer;
  width: fit-content;
}

.manage-alerts-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #006fa6;
  text-decoration: none;
}

.arrow-icon {
  width: 24px;
  height: 24px;
}

@keyframes slideDownModal {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Filter Pills */
.filter-pills {
  background: white !important;
  border-bottom: 1px solid #e8e9eb;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.permanent-filter {
  background: #006fa6;
  border: 1px solid #006ea6;
  border-radius: 34px;
  padding: 4px 8px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  width: fit-content;
}

.location-pill {
  background: #006fa6;
  border-radius: 32px;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 0;
  padding-right: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 34px;
}

.location-icon {
  width: 18px;
  height: 24px;
}

.location-text-white {
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: white;
  line-height: 22px;
}

.filter-separator {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: white;
  line-height: 22px;
}

.filter-description {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: white;
  line-height: 22px;
}

.filter-pills-row {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  min-height: 36px;
}

.filter-pill {
  background: #e6f1f5;
  border: 1px solid #006ea6;
  border-radius: 32px;
  padding: 4px 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 36px;
}

.filter-pill-text {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #006fa6;
  line-height: 22px;
}

.filter-pill-close {
  width: 30px;
  height: 30px;
  background: transparent;
  border: none;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.close-icon {
  width: 8px;
  height: 8px;
}

.more-filters {
  background: white;
  border: 1px solid #006ea6;
  border-radius: 32px;
  padding: 4px 16px;
  display: flex;
  align-items: center;
  height: 36px;
}

.more-filters-text {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #006fa6;
  line-height: 22px;
}

/* Results Header */
.results-header {
  padding: 24px;
}

.results-title {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #242c33;
  line-height: 24px;
}

/* SRP Tiles */
.results-grid {
  padding: 0 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.srp-tile {
  background: white;
  border: 1px solid #e8e9eb;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.tile-image-container {
  position: relative;
  height: 294px;
  overflow: hidden;
}

.tile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-button {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: white;
  border: 1px solid #e8e9eb;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.favorite-icon {
  width: 24px;
  height: 24px;
}

.carousel-dots {
  position: absolute;
  left: 50%;
  top: 294px;
  transform: translateX(-50%) translateY(-50%);
  width: 121px;
  height: 12px;
  z-index: 10;
}

.tile-content {
  padding: 16px;
  border-top: 1px solid #e8e9eb;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.tile-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tile-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 16px;
  line-height: 16px;
  position: relative;
}

.tile-year {
  color: #242c33;
}

.tile-separator {
  color: #bcbfc2;
  line-height: 26px;
}

.tile-mileage {
  color: #242c33;
}

.tile-stock {
  color: #666b70;
  font-size: 12px;
  letter-spacing: 0.2px;
}

.srp-tile-new-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: #eaf5dc;
  border-radius: 2px 0 0 2px;
  position: absolute;
  right: -16px;
  top: 0;
}

.srp-tile-new-badge::after {
  content: '';
  position: absolute;
  right: -2px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #eaf5dc;
  border-radius: 0 2px 2px 0;
}

.srp-tile-new-badge-icon {
  width: 18px;
  height: 18px;
  filter: brightness(0) saturate(100%) invert(20%) sepia(100%) saturate(2000%) hue-rotate(90deg) brightness(0.8) contrast(1.2);
}

.tile-title {
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  color: #242c33;
  height: 48px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.tile-price-location {
  display: flex;
  align-items: end;
  gap: 21px;
}

.tile-price {
  display: flex;
  align-items: end;
  gap: 21px;
}

.price-container {
  display: flex;
  flex-direction: column;
  height: 50px;
  justify-content: end;
}

.price-currency {
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 15.48px;
  line-height: 21px;
  color: #3e8500;
  letter-spacing: -0.4px;
}

.price-amount {
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 26px;
  line-height: 24px;
  color: #3e8500;
  letter-spacing: 0.4px;
}

.tile-location {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: end;
  text-align: right;
  height: 42px;
}

.location-label {
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #242c33;
  margin-bottom: 0;
}

.location-details {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: #242c33;
}

.location-distance {
  font-size: 12px;
}

.tile-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.calculator-button {
  width: 40px;
  height: 40px;
  border: 2px solid #006fa6;
  border-radius: 28px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.calculator-icon {
  width: 20px;
  height: 20px;
}

.test-drive-button {
  border: 2px solid #006fa6;
  border-radius: 28px;
  background: transparent;
  padding: 0 16px;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  width: 200px;
}

.test-drive-icon {
  width: 24px;
  height: 24px;
}

.test-drive-text {
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: #006fa6;
  line-height: 14px;
  white-space: nowrap;
}

/* Filter Menu */
.filter-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 5000;
  display: flex;
  flex-direction: column;
}

.filter-menu-panel {
  background: white;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.filter-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e8e9eb;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.filter-menu-tabs {
  display: flex;
  gap: 24px;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
}

.filter-tab.active .filter-tab-text {
  color: #006fa6;
}

.filter-tab-icon {
  width: 24px;
  height: 24px;
}

.filter-tab-text {
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #666b70;
}

.filter-tab-bar {
  position: absolute;
  bottom: -16px;
  left: 0;
  right: 0;
  height: 2px;
  background: #006fa6;
  display: none;
}

.filter-tab.active .filter-tab-bar {
  display: block;
}

.filter-menu-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.filter-close-icon {
  width: 24px;
  height: 24px;
}

.filter-pills-section {
  padding: 16px 24px;
  border-bottom: 1px solid #e8e9eb;
  display: flex;
  flex-direction: column;
  gap: 8px;
}


.reset-link {
  margin-top: 16px;
  color: #006fa6;
  cursor: pointer;
  font-size: 14px;
}

.filter-options-list {
  padding: 0;
  display: flex;
  flex-direction: column;
}

.filter-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e8e9eb;
  cursor: pointer;
}

.filter-option-text {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #242c33;
}

.filter-arrow {
  width: 24px;
  height: 24px;
}

/* My Searches */
.my-searches-content {
  padding: 24px;
}

.my-searches-not-signed-in {
  text-align: center;
}

.my-searches-text {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  color: #242c33;
  margin-bottom: 24px;
}

.my-searches-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.my-searches-signin-btn {
  background: #3e8500;
  border: none;
  border-radius: 28px;
  padding: 13px 40px;
  height: 56px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.my-searches-create-link {
  color: #006fa6;
  text-decoration: none;
  font-size: 16px;
}

.saved-searches-heading {
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: #242c33;
  margin-bottom: 16px;
}

.saved-searches-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.saved-search-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e8e9eb;
  border-radius: 8px;
  cursor: pointer;
}

.saved-search-card.selected {
  border-color: #006fa6;
  background: #e6f1f5;
}

.saved-search-name {
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #242c33;
  margin-bottom: 4px;
}

.saved-search-criteria {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #666b70;
}

.saved-search-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.car-icon {
  width: 24px;
  height: 24px;
}

.new-results {
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #006fa6;
}

.my-searches-empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-state-icon {
  width: 200px;
  height: 200px;
  margin-bottom: 24px;
}

.empty-state-heading {
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: #242c33;
  margin-bottom: 8px;
}

.empty-state-description {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #666b70;
}

.filter-menu-bottom {
  padding: 16px 24px;
  border-top: 1px solid #e8e9eb;
  background: white;
}

.view-results-btn {
  width: 100%;
  background: #3e8500;
  border: none;
  border-radius: 28px;
  padding: 13px 40px;
  height: 56px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

/* Body Style Filter Overlay */
.body-style-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 6000;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}

.body-style-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: white;
  transform: translateX(100%);
  transition: transform 0.3s ease-out;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.body-style-overlay.show .body-style-panel,
.body-style-overlay .body-style-panel {
  transform: translateX(0);
}

.body-style-header {
  padding: 24px 24px 0;
}

.body-style-back {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 2px 0;
}

.body-style-back-icon {
  width: 24px;
  height: 24px;
  transform: rotate(90deg);
}

.body-style-back-text {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #242c33;
}

.body-style-heading {
  padding: 24px 24px 0;
}

.body-style-heading h3 {
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 24px;
  color: #242c33;
  margin: 0;
}

.body-style-options {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.body-style-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e8e9eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.body-style-option:hover {
  background: #f5f4f3;
}

.body-style-option.selected {
  border-color: #006fa6;
  background: #e6f1f5;
}

.body-style-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.body-style-name {
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #242c33;
}

.body-style-count {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #666b70;
}

.body-style-icon {
  width: 48px;
  height: 48px;
}

.body-style-bottom {
  padding: 16px 24px;
  border-top: 1px solid #e8e9eb;
  background: white;
  position: sticky;
  bottom: 0;
}

/* Price & Payment Filter Overlay */
.price-payment-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 6000;
}

.price-payment-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: white;
  transform: translateX(100%);
  transition: transform 0.3s ease-out;
  overflow-y: auto;
  padding-bottom: 80px;
}

.price-payment-overlay.show .price-payment-panel {
  transform: translateX(0);
}

.price-payment-header {
  padding: 24px 24px 0;
}

.price-payment-back {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 2px 0;
}

.price-payment-back-icon {
  width: 24px;
  height: 24px;
  transform: rotate(90deg);
}

.price-payment-back-text {
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #006fa6;
}

.price-payment-heading {
  padding: 24px 24px 0;
}

.price-payment-heading h3 {
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #242c33;
  margin: 0;
}

.price-payment-content {
  padding: 24px 24px 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Segmented Control */
.segmented-control {
  background: white;
  border: 1px solid #d4d7d9;
  border-radius: 19.5px;
  padding: 4px;
  display: flex;
  width: 100%;
  box-sizing: border-box;
}

.segmented-option {
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 8px 16px;
  text-align: center;
  cursor: default;
  transition: none;
}

.segmented-option.selected {
  background: #3e8500;
  color: white;
}

.segmented-option span {
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  color: #242c33;
  white-space: nowrap;
}

.segmented-option.selected span {
  color: white;
}

/* Price Inputs */
.price-inputs {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.price-input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.price-input-label {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #666b70;
}

.price-input-container {
  border: 1px solid #d4d7d9;
  border-radius: 8px;
  height: 40px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  width: 100px;
}

.price-input {
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  color: #242c33;
  width: 100%;
}

/* Range Slider */
.range-slider-container {
  width: 100%;
  position: relative;
}

.range-slider-wrapper {
  position: relative;
  height: 24px;
  display: flex;
  align-items: center;
}

.range-slider-track {
  position: absolute;
  width: 100%;
  height: 4px;
  background: #d4d7d9;
  border-radius: 11px;
  pointer-events: none;
}

.range-slider-range {
  position: absolute;
  height: 4px;
  background: #3e8500;
  border-radius: 11px;
  pointer-events: none;
}

.range-slider {
  position: absolute;
  width: 100%;
  height: 24px;
  border-radius: 11px;
  background: transparent;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  pointer-events: auto;
  cursor: pointer;
  z-index: 2;
}

.range-slider-min {
  z-index: 1;
}

.range-slider-max {
  z-index: 1;
}

.range-slider-thumb {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #3e8500;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  pointer-events: none;
  z-index: 3;
  transform: translateX(-50%);
}

.range-slider-thumb-min {
  z-index: 4;
}

.range-slider-thumb-max {
  z-index: 5;
}

.range-slider::-webkit-slider-track {
  background: transparent;
  height: 4px;
  border-radius: 11px;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0;
  height: 0;
  background: transparent;
  cursor: pointer;
}

.range-slider::-moz-range-track {
  background: transparent;
  height: 4px;
  border-radius: 11px;
  border: none;
}

.range-slider::-moz-range-thumb {
  width: 0;
  height: 0;
  background: transparent;
  cursor: pointer;
  border: none;
}

.price-payment-bottom {
  padding: 16px 24px;
  border-top: 1px solid #e8e9eb;
  background: white;
  position: sticky;
  bottom: 0;
}

/* Sort Menu Styles */
.sort-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 2000;
  display: none;
}

.sort-menu-overlay.show {
  display: block;
}

.sort-menu-panel {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(44, 44, 46, 0.95);
  border-radius: 12px;
  width: auto;
  min-width: 200px;
  max-width: 90vw;
  max-height: 400px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
}

.sort-menu-header {
  padding: 16px 20px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sort-menu-title {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 600;
  font-size: 17px;
  color: white;
  margin: 0;
  text-align: center;
}

.sort-menu-options {
  padding: 8px 0;
}

.sort-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  position: relative;
}

.sort-option:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.sort-option:last-child {
  border-bottom: none;
}

.sort-option-text {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: white;
}

.sort-option-check {
  width: 16px;
  height: 16px;
  display: none;
  color: white;
  font-weight: bold;
}

.sort-option.selected .sort-option-check {
  display: block;
}

@media (max-width: 600px) {
  .filter-menu-panel {
    width: 100vw !important;
  }
  
  .name-search-modal {
    width: 100vw !important;
    max-width: none !important;
  }
  
  .body-style-panel {
    width: 100vw !important;
  }
  
  .price-payment-panel {
    width: 100vw !important;
  }
}
</style>

