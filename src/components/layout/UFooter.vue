<!-- components/layout/UFooter.vue -->
<template>
    <footer class="u-footer">
      <div class="u-footer__top">
        <div class="u-footer__wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#222" fill-opacity="1" d="M0,192L48,202.7C96,213,192,235,288,218.7C384,203,480,149,576,138.7C672,128,768,160,864,186.7C960,213,1056,235,1152,229.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>
      
      <div class="u-footer__main">
        <div class="container">
          <div class="u-footer__content">
            <div class="u-footer__brand">
              <h2 class="u-footer__logo">Elixium Foods</h2>
              <p class="u-footer__tagline">Delicious food delivered to your door. The best local restaurants at your fingertips.</p>
              <div class="u-footer__social">
                <a href="#" class="u-footer__social-link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" class="u-footer__social-link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a href="#" class="u-footer__social-link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>
            
            <div class="u-footer__nav">
              <div class="u-footer__column">
                <h3 class="u-footer__heading">Company</h3>
                <ul class="u-footer__list">
                  <li><a href="#" class="u-footer__link">About Us</a></li>
                  <li><a href="#" class="u-footer__link">Careers</a></li>
                  <li><a href="#" class="u-footer__link">Blog</a></li>
                  <li><a href="#" class="u-footer__link">Partner With Us</a></li>
                </ul>
              </div>
              
              <div class="u-footer__column">
                <h3 class="u-footer__heading">Support</h3>
                <ul class="u-footer__list">
                  <li><a href="#" class="u-footer__link">Help Center</a></li>
                  <li><a href="#" class="u-footer__link">Safety</a></li>
                  <li><a href="#" class="u-footer__link">Contact Us</a></li>
                  <li><a href="#" class="u-footer__link">FAQs</a></li>
                </ul>
              </div>
              
              <div class="u-footer__column">
                <h3 class="u-footer__heading">Legal</h3>
                <ul class="u-footer__list">
                  <li><a href="#" class="u-footer__link">Terms & Conditions</a></li>
                  <li><a href="#" class="u-footer__link">Privacy Policy</a></li>
                  <li><a href="#" class="u-footer__link">Cookies</a></li>
                  <li><a href="#" class="u-footer__link">Licenses</a></li>
                </ul>
              </div>
            </div>
            
            <div class="u-footer__newsletter">
              <h3 class="u-footer__heading">Stay Updated</h3>
              <p class="u-footer__newsletter-text">Subscribe to our newsletter for special deals and offers</p>
              <form class="u-footer__form">
                <input type="email" placeholder="Your email address" class="u-footer__input" />
                <button type="submit" class="u-footer__button">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <div class="u-footer__bottom">
        <div class="container">
          <div class="u-footer__bottom-content">
            <p class="u-footer__copyright">© {{ new Date().getFullYear() }} Elixium Foods. All rights reserved.</p>
            <div class="u-footer__payment">
                <span class="u-footer__payment-icon">
              <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="30" height="20" rx="4" fill="#016FD0"/>
                <path d="M13.5 14H16.5V6H13.5V14ZM18.5 14H21.5V10H18.5V14ZM7.5 14H10.5V6H7.5V14ZM10.5 8H13.5V6H10.5V8Z" fill="white"/>
              </svg>
            </span>
            <span class="u-footer__payment-icon">
              <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="30" height="20" rx="4" fill="#EB001B"/>
                <circle cx="11" cy="10" r="5" fill="#EB001B"/>
                <circle cx="19" cy="10" r="5" fill="#F79E1B"/>
                <path d="M15 6.8C16.6 8 17.7 9.9 17.7 12C17.7 14.1 16.6 16 15 17.2C13.4 16 12.3 14.1 12.3 12C12.3 9.9 13.4 8 15 6.8Z" fill="#FF5F00"/>
              </svg>
            </span>
            <span class="u-footer__payment-icon">
              <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="30" height="20" rx="4" fill="#393939"/>
                <path d="M11.5 12.9C11.5 14.1 12.4 15 13.6 15H18.5V13.2H13.8C13.5 13.2 13.3 13 13.3 12.7V10H18.5V8.2H13.3V5H11.5V12.9Z" fill="white"/>
              </svg>
            </span>
            <span class="u-footer__payment-icon">
              <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="30" height="20" rx="4" fill="#1434CB"/>
                <path d="M10.5 7L9 14H11L12.5 7H10.5ZM16 7L14.5 14H16.5L18 7H16ZM12.5 7L11 14H13L14.5 7H12.5ZM19 11.5H21L21.5 10H19.5L20 8.5H22L22.5 7H18.5L17 14H21L21.5 12.5H19.5L19 11.5Z" fill="white"/>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// No necesitamos script específico para el footer
</script>

<style lang="scss" scoped>
.u-footer {
  position: relative;
  color: #fff;
  
  &__top {
    position: relative;
    height: 150px;
  }
  
  &__wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    
    svg {
      display: block;
      width: 100%;
    }
  }
  
  &__main {
    background-color: #222;
    padding: 4rem 0 3rem;
  }
  
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  &__content {
    display: grid;
    grid-template-columns: 1.5fr 2fr 1.5fr;
    gap: 3rem;
    
    @media (max-width: 992px) {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }
  
  &__brand {
    display: flex;
    flex-direction: column;
  }
  
  &__logo {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0 0 1rem;
    background: linear-gradient(135deg, #FF6B6B, #FF8E53);
    -webkit-background-clip: text;
    color: transparent;
    background-clip: text;
  }
  
  &__tagline {
    color: #aaa;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
  
  &__social {
    display: flex;
    gap: 1rem;
  }
  
  &__social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    color: #fff;
    transition: all 0.3s;
    
    &:hover {
      background-color: #FF6B6B;
      transform: translateY(-3px);
    }
  }
  
  &__nav {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    
    @media (max-width: 576px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  &__heading {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 1.5rem;
    position: relative;
    padding-bottom: 0.8rem;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 2px;
      background: linear-gradient(to right, #FF6B6B, #FF8E53);
    }
  }
  
  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  &__link {
    color: #aaa;
    text-decoration: none;
    display: block;
    padding: 0.5rem 0;
    transition: all 0.3s;
    
    &:hover {
      color: #fff;
      transform: translateX(5px);
    }
  }
  
  &__newsletter-text {
    color: #aaa;
    margin-bottom: 1.2rem;
    line-height: 1.6;
  }
  
  &__form {
    display: flex;
    overflow: hidden;
    border-radius: 8px;
  }
  
  &__input {
    flex: 1;
    padding: 0.8rem 1rem;
    border: none;
    outline: none;
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
    
    &::placeholder {
      color: #aaa;
    }
  }
  
  &__button {
    background: linear-gradient(135deg, #FF6B6B, #FF8E53);
    color: white;
    border: none;
    padding: 0 1.2rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.3s;
    
    &:hover {
      opacity: 0.9;
    }
  }
  
  &__bottom {
    background-color: #1a1a1a;
    padding: 1.5rem 0;
  }
  
  &__bottom-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  &__copyright {
    color: #777;
    margin: 0;
    font-size: 0.9rem;
  }
  
  &__payment {
    display: flex;
    gap: 0.5rem;
  }
  
  &__payment-icon {
    opacity: 0.7;
    transition: opacity 0.3s;
    
    &:hover {
      opacity: 1;
    }
  }
}

@media (max-width: 768px) {
  .u-footer {
    &__bottom-content {
      flex-direction: column;
      text-align: center;
    }
  }
}
</style>