document.addEventListener('DOMContentLoaded', () => {
    setupActiveNav();
    setupImageCluster();
    setupGalleryModal();
    setupProjectList();
});

function setupActiveNav() {
    const currentPage = normalizePage(window.location.pathname);

    document.querySelectorAll('.top-nav a').forEach((link) => {
        const linkPage = normalizePage(new URL(link.href).pathname);
        link.classList.toggle('active', linkPage === currentPage);
    });
}

function normalizePage(pathname) {
    if (pathname === '/' || pathname.endsWith('/index.html')) {
        return 'index.html';
    }

    if (pathname.endsWith('/projects') || pathname.endsWith('/projects.html')) {
        return 'projects.html';
    }

    return pathname.split('/').pop() || 'index.html';
}

function setupImageCluster() {
    const cluster = document.querySelector('.image-cluster');
    if (!cluster) return;

    const images = cluster.querySelectorAll('.cluster-img');
    const baseDelay = 0.08;

    cluster.addEventListener('mouseenter', () => {
        cluster.classList.add('expanded');
        images.forEach((img, index) => {
            img.style.transitionDelay = `${index * baseDelay}s`;
        });
    });

    cluster.addEventListener('mouseleave', () => {
        images.forEach((img, index) => {
            img.style.transitionDelay = `${index * baseDelay}s`;
        });
        cluster.classList.remove('expanded');
    });
}

function setupGalleryModal() {
    const modal = document.getElementById('imageModal');
    if (!modal) return;

    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');
    const overlay = document.querySelector('.modal-overlay');
    const previousButton = document.getElementById('modalPrev');
    const nextButton = document.getElementById('modalNext');
    const galleryImages = Array.from(document.querySelectorAll('.cluster-link')).map((link) => ({
        src: link.dataset.fullSrc,
        description: link.dataset.description,
        alt: link.querySelector('img')?.alt || 'Project photo'
    }));

    let currentIndex = 0;

    function renderImage() {
        const image = galleryImages[currentIndex];
        if (!image || !modalImage || !modalDescription) return;

        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalDescription.textContent = image.description;
    }

    function openModal(index) {
        currentIndex = index;
        renderImage();
        modal.classList.add('modal-active');
    }

    function closeModal() {
        modal.classList.remove('modal-active');
    }

    function showPreviousImage() {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        renderImage();
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        renderImage();
    }

    document.querySelectorAll('.cluster-link').forEach((link, index) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            openModal(index);
        });
    });

    overlay?.addEventListener('click', closeModal);
    previousButton?.addEventListener('click', showPreviousImage);
    nextButton?.addEventListener('click', showNextImage);

    document.addEventListener('keydown', (event) => {
        if (!modal.classList.contains('modal-active')) return;

        if (event.key === 'ArrowLeft') showPreviousImage();
        if (event.key === 'ArrowRight') showNextImage();
        if (event.key === 'Escape') closeModal();
    });
}

function setupProjectList() {
    const projectList = document.querySelector('.project-list');
    if (!projectList) return;

    projectList.querySelectorAll('.project-header').forEach((header) => {
        header.addEventListener('click', () => {
            const item = header.closest('.project-item');
            if (!item) return;

            const isActive = item.classList.contains('active');
            projectList.querySelectorAll('.project-item.active').forEach((activeItem) => {
                activeItem.classList.remove('active');
                activeItem.querySelector('.project-header')?.setAttribute('aria-expanded', 'false');
            });

            item.classList.toggle('active', !isActive);
            header.setAttribute('aria-expanded', String(!isActive));
        });
    });
}
