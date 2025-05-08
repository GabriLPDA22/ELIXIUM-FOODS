<!-- components/ui/PopularTag.vue -->
<template>
    <div class="popular-tag">
        <span class="popular-tag__text">Popular</span>
    </div>
</template>

<script setup>
// No se necesita lógica adicional para este componente
</script>

<style lang="scss" scoped>
.popular-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #FF8000;
    border-radius: 4px;
    padding: 4px 8px;
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 5;

    &__text {
        color: white;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
}
</style>