<!-- src/components/feature/profile/ProfileHeader.vue -->
<template>
    <div class="profile-header-component">
        <div class="user-info">
            <div class="user-photo">
                <img v-if="user.photoURL" :src="user.photoURL" :alt="user.displayName" />
                <div v-else class="user-initials">{{ getInitials(user.displayName) }}</div>
            </div>
            <div class="user-details">
                <h1 class="user-name">{{ user.displayName }}</h1>
                <div class="user-meta">
                    <span class="user-email">{{ user.email }}</span>
                    <span class="user-joined">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Miembro desde {{ formatDate(user.createdAt) }}
                    </span>
                </div>
            </div>
        </div>
        <div class="edit-profile">
            <button class="edit-btn" @click="$emit('edit')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
                Editar perfil
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    user: {
        type: Object,
        required: true
    }
});

defineEmits(['edit']);

const getInitials = (name: string) => {
    if (!name) return '?';
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

const formatDate = (date: Date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(date));
};
</script>

<style lang="scss" scoped>
.profile-header-component {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
        gap: 1.5rem;
    }
}

.user-info {
    display: flex;
    align-items: center;
    gap: 1.5rem;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
    }
}

.user-photo {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid rgba(255, 255, 255, 0.3);

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.user-initials {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 3rem;
    font-weight: 700;
}

.user-details {
    display: flex;
    flex-direction: column;
}

.user-name {
    margin: 0 0 0.5rem;
    font-size: 2.5rem;
    font-weight: 800;

    @media (max-width: 768px) {
        font-size: 2rem;
    }
}

.user-meta {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    opacity: 0.9;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
    }
}

.user-email,
.user-joined {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.edit-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background-color: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50px;
    color: white;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background-color: rgba(255, 255, 255, 0.25);
        transform: translateY(-2px);

        svg {
            transition: transform 0.3s ease;
        }

        &:hover svg {
            transform: rotate(15deg);
        }
    }
}
</style>