// Массив товаров
const products = [
    {
        id: 1,
        name: 'Ноутбук',
        price: 50000,
        image: 'images/photo_2026-01-27_16-28-45.jpg',
        brand: 'Midea'
    },
    {
        id: 2,
        price: 30000,
        image: 'images/photo_2026-01-27_16-42-00.jpg',
        brand: 'Gree'
    },
    {
        id: 3,
        name: 'Наушники',
        price: 5000,
        image: 'images/photo_2026-01-27_16-58-01.jpg',
        brand: 'Haier'
    },
    {
        id: 4,
        name: 'Клавиатура',
        price: 2000,
        image: 'images/photo_2026-01-29_16-37-26.jpg',
        brand: 'Cooper&Hunter'
    },
    {
        id: 5,
        name: 'Мышь',
        price: 1000,
        image: 'images/photo_2026-01-27_17-34-05.jpg',
        brand: 'Gree'
    },
    {
        id: 6,
        name: 'Монитор',
        price: 15000,
        image: 'images/photo_2026-01-27_17-55-10.jpg',
        brand: 'Midea'
    }
];

// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Formspree endpoint (direct send without keys)
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mojlwazb';

// EmailJS configuration (fill with your keys to enable direct email sending)
const EMAILJS_CONFIG = {
    publicKey: '',
    serviceId: '',
    templateId: ''
};
let EMAILJS_ENABLED = false;

function initEmailJS() {
    try {
        if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey) {
            emailjs.init(EMAILJS_CONFIG.publicKey);
            EMAILJS_ENABLED = !!(EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.templateId);
        }
    } catch (e) {
        EMAILJS_ENABLED = false;
    }
}

function sendOrderViaEmailJS(name, phone, productTitle) {
    if (!EMAILJS_ENABLED) return Promise.reject(new Error('EmailJS not configured'));
    const params = { name, phone, product: productTitle };
    return emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, params);
}

// Функция для отображения товаров
function displayProducts(productsToDisplay = products) {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';
    productsToDisplay.forEach(product => {
        // If item is a showcase (special tile), render it as showcase element
        if (product && product.isShowcase) {
            const a = document.createElement('a');
            a.className = 'showcase-item showcase-full';
            a.href = product.href || '#home';
            a.title = product.title || 'Вітрина';
            if (product.href && product.href.startsWith('http')) {
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
            }
            const caption = product.showCaption === true ? `<span>${product.title || 'Вітрина'}</span>` : '';
            a.innerHTML = `<img src="${product.image}" alt="${product.title || 'Вітрина'}">${caption}`;
            productsContainer.appendChild(a);
            return;
        }
        // Special case: show product id 1 (Ноутбук) as image-only without white frame
        if (product.id === 1) {
            const imgWrap = document.createElement('div');
            imgWrap.className = 'product-image-only';
            imgWrap.innerHTML = `
                <a href="https://www.midea.com.ua/uk/products/pobutovi-kondytsionery/splyt-systemy-inverter/msag-09hrfn8-i-msag-09hrfn8-o" target="_blank" rel="noopener noreferrer" title="Перейти на страницу товара">
                    <img src="${product.image}" alt="${product.name}">
                </a>
            `;
            productsContainer.appendChild(imgWrap);
        } else if (product.id === 2) {
            // Smartphone: image-only, wrapped with external product link
            const imgWrap = document.createElement('div');
            imgWrap.className = 'product-image-only';
            imgWrap.innerHTML = `
                <a href="https://www.midea.com.ua/uk/products/pobutovi-kondytsionery/splyt-systemy-inverter/msag-12hrfn8-i-msag-12hrfn8-o" target="_blank" rel="noopener noreferrer" title="Перейти на сторінку товару">
                    <img src="${product.image}" alt="${product.name}">
                </a>
            `;
            productsContainer.appendChild(imgWrap);
        } else if (product.id === 3) {
            // Headphones: image-only wrapped with external product link
            const imgWrap = document.createElement('div');
            imgWrap.className = 'product-image-only';
            imgWrap.innerHTML = `
                <a href="https://www.midea.com.ua/uk/products/pobutovi-kondytsionery/splyt-systemy-inverter/msag-18hrfn8-i-msag-18hrfn8-o" target="_blank" rel="noopener noreferrer" title="Перейти на сторінку товару">
                    <img src="${product.image}" alt="${product.name}">
                </a>
            `;
            productsContainer.appendChild(imgWrap);
        } else if (product.id === 4) {
            // Keyboard: image-only wrapped with link
            // Support overrides:
            // - product.homeImage / product.homeHref for home page
            // - product.brandHref for brand-specific link override
            // - product.brandImage for brand-specific image
            // - product.featuredClass to apply special styling (e.g., height)
            const imgWrap = document.createElement('div');
            imgWrap.className = 'product-image-only' + (product.featuredClass ? (' ' + product.featuredClass) : '');
            const imgSrc = product.brandImage || product.homeImage || product.image;
            const href = (typeof product.brandHref !== 'undefined')
                ? product.brandHref
                : (typeof product.homeHref !== 'undefined')
                    ? product.homeHref
                    : 'https://www.midea.com.ua/uk/products/pobutovi-kondytsionery/splyt-systemy-inverter/msag-24hrfn8-i-msag-24hrfn8-o';
            const linkTitle = product.brandLinkTitle || product.homeLinkTitle || 'Перейти на сторінку товару';

            if ((product.hasOwnProperty('homeHref') && product.homeHref === null) || (product.hasOwnProperty('brandHref') && product.brandHref === null)) {
                // explicit null means no link
                imgWrap.innerHTML = `<img src="${imgSrc}" alt="${product.name}">`;
            } else {
                const isExternal = typeof href === 'string' && href.startsWith('http');
                imgWrap.innerHTML = `\n                <a href="${href}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} title="${linkTitle}">\n                    <img src="${imgSrc}" alt="${product.name}">\n                </a>`;
            }
            productsContainer.appendChild(imgWrap);
        } else if (product.id === 5) {
            // Mouse: image-only (display like previous photos)
            const imgWrap = document.createElement('div');
            imgWrap.className = 'product-image-only';
            imgWrap.innerHTML = `
                    <a href="https://www.midea.com.ua/ru/products/bytovye-kondicionery/split-sistemy-inverter/msab-09hrfn8-i-msab-09hrfn8-o" target="_blank" rel="noopener noreferrer" title="Перейти на страницу товара">
                        <img src="${product.image}" alt="${product.name}">
                    </a>
                `;
            productsContainer.appendChild(imgWrap);
        } else if (product.id === 6) {
            // Monitor: show image-only like previous photos
            const imgWrap = document.createElement('div');
            imgWrap.className = 'product-image-only';
            imgWrap.innerHTML = `
                <a href="https://www.midea.com.ua/ru/products/bytovye-kondicionery/split-sistemy-inverter/af8-09n1c2e-i-af8-09n1c2e-o" target="_blank" rel="noopener noreferrer" title="Перейти на страницу товара">
                    <img src="${product.image}" alt="${product.name}">
                </a>
            `;
            productsContainer.appendChild(imgWrap);
        } else {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Цена: ${product.price} руб.</p>
                <button onclick="addToCart(${product.id})">Добавить в корзину</button>
            `;
            productsContainer.appendChild(productDiv);
        }
    });
}

// Функция для добавления товара в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartCount();
    saveCart();
    alert(`${product.name} добавлен в корзину!`);
}

// Функция для обновления количества товаров в корзине
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

// Функция для сохранения корзины в localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Функция для отображения корзины
function displayCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>${item.price * item.quantity} руб.</span>
        `;
        cartItems.appendChild(itemDiv);
        total += item.price * item.quantity;
    });
    document.getElementById('total-price').textContent = total;
}

// Обработчики событий
const cartButtonEl = document.getElementById('cart-button');
if (cartButtonEl) {
    // Only attach modal behavior if the element is a button (not a link to external sites)
    if (cartButtonEl.tagName.toLowerCase() === 'button') {
        cartButtonEl.addEventListener('click', () => {
            displayCart();
            document.getElementById('cart-modal').style.display = 'block';
        });
    }
}

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('cart-modal').style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == document.getElementById('cart-modal')) {
        document.getElementById('cart-modal').style.display = 'none';
    }
});

document.getElementById('checkout-button').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Корзина пуста!');
    } else {
        alert('Заказ оформлен! Спасибо за покупку.');
        cart = [];
        updateCartCount();
        saveCart();
        document.getElementById('cart-modal').style.display = 'none';
    }
});

// Инициализация
// SPA: показать товары бренда без перезагрузки
function showBrand(brand) {
    const titleEl = document.getElementById('page-title');
    if (!titleEl) return;
    if (brand) {
        // Special view for Midea: show 15 showcases
        if (brand === 'Midea') {
            // Use the same photo for all Midea showcases and make it fill the tile
            const showcaseImage = 'images/photo_2026-01-28_16-13-34.jpg';
            let showcasesHtml = `<h2>${brand}</h2><div class="showcases">`;
            for (let i = 1; i <= 15; i++) {
                // First showcase uses a special photo, second and third showcases use other special photos, others use the main showcaseImage
                let imgToUse;
                if (i === 1) imgToUse = 'images/photo_2026-01-31_18-48-06.jpg';
                else if (i === 2) imgToUse = 'images/photo_2026-01-31_18-57-50.jpg';
                else if (i === 3) imgToUse = 'images/photo_2026-01-31_19-04-04.jpg';
                else if (i === 4) imgToUse = 'images/photo_2026-01-31_19-11-46.jpg';
                else if (i === 5) imgToUse = 'images/photo_2026-02-01_12-14-17.jpg';
                else if (i === 6) imgToUse = 'images/photo_2026-02-01_14-55-07.jpg';
                else if (i === 7) imgToUse = 'images/photo_2026-02-01_15-06-03.jpg';
                else if (i === 8) imgToUse = 'images/photo_2026-02-01_15-14-13.jpg';
                else if (i === 9) imgToUse = 'images/photo_2026-02-01_15-20-55.jpg';
                else if (i === 10) imgToUse = 'images/photo_2026-02-01_15-29-36.jpg';
                else if (i === 11) imgToUse = 'images/photo_2026-02-01_15-37-36.jpg';
                else if (i === 12) imgToUse = 'images/photo_2026-02-01_15-44-30.jpg';
                else if (i === 13) imgToUse = 'images/photo_2026-02-01_15-52-46.jpg';
                else if (i === 14) imgToUse = 'images/photo_2026-02-01_17-45-28.jpg';
                    else if (i === 15) imgToUse = 'images/photo_2026-02-01_17-48-30.jpg';
                else imgToUse = showcaseImage;

                // For showcase 1 make it clickable to the specified image, others remain non-clickable
                if (i === 1) {
                    showcasesHtml += `\n                <a class="showcase-item showcase-full" href="#image=images/photo_2026-01-31_18-48-10.jpg" title="Midea Forest AF-07N1C2-I/AF-07N1C2-O">\n                    <img src="${imgToUse}" alt="Midea Forest AF-07N1C2-I/AF-07N1C2-O">\n                </a>`;
                } else if (i === 2) {
                    showcasesHtml += `\n                <a class="showcase-item showcase-full" href="#image=images/photo_2026-01-31_18-57-54.jpg" title="Midea Forest AF-09N1C2-I/AF-09N1C2-O">\n                    <img src="${imgToUse}" alt="Midea Forest AF-09N1C2-I/AF-09N1C2-O">\n                </a>`;
                } else if (i === 3) {
                    showcasesHtml += `\n                <a class="showcase-item showcase-full" href="#image=images/photo_2026-01-31_19-04-46.jpg" title="Midea Forest AF6-12N8C2E-I/AF6-12N8C2E-O">\n                    <img src="${imgToUse}" alt="Midea Forest AF6-12N8C2E-I/AF6-12N8C2E-O">\n                </a>`;
                } else if (i === 4) {
                    showcasesHtml += `\n                <a class=\"showcase-item showcase-full\" href=\"#image=images/photo_2026-01-31_19-11-52.jpg\" title=\"Midea Forest AF8-18N8C0E-I/AF8-18N8C0E-O\">\n                    <img src=\"${imgToUse}\" alt=\"Midea Forest AF8-18N8C0E-I/AF8-18N8C0E-O\">\n                </a>`;
                    showcasesHtml += `\n                <a class=\"showcase-item showcase-full\" href=\"#image=images/photo_2026-02-01_12-14-24.jpg\" title=\"Midea Forest AF6-24N8-D0E-I/AF6-24N8-D0E-O\">\n                    <img src=\"images/photo_2026-02-01_12-14-17.jpg\" alt=\"Midea Forest AF6-24N8-D0E-I/AF6-24N8-D0E-O\">\n                </a>`;
                } else if (i === 5) {
                    
                } else if (i === 6) {
                    // Make showcase 6 clickable to the requested image viewer
                    showcasesHtml += `\n                <a class="showcase-item showcase-full" href="#image=images/photo_2026-02-01_14-55-12.jpg" title="Midea XTreme MSAG-09HRFN8-I/MSAG-09HRFN8-O">\n                    <img src="${imgToUse}" alt="Midea XTreme MSAG-09HRFN8-I/MSAG-09HRFN8-O">\n                </a>`;
                } else if (i === 7) {
                    // Make showcase 7 clickable to the requested image viewer
                    showcasesHtml += `\n                <a class=\"showcase-item showcase-full\" href=\"#image=images/photo_2026-02-01_15-06-06.jpg\" title=\"Midea XTreme MSAG-12HRFN8-I/MSAG-12HRFN8-O\">\n                    <img src=\"${imgToUse}\" alt=\"Midea XTreme MSAG-12HRFN8-I/MSAG-12HRFN8-O\">\n                </a>`;
                } else if (i === 8) {
                    // Make showcase 8 clickable to the requested image viewer
                    showcasesHtml += `\n                <a class=\"showcase-item showcase-full\" href=\"#image=images/photo_2026-02-01_15-14-21.jpg\" title=\"Midea XTreme MSAG-18HRFN8-I/MSAG-18HRFN8-O\">\n                    <img src=\"${imgToUse}\" alt=\"Midea XTreme MSAG-18HRFN8-I/MSAG-18HRFN8-O\">\n                </a>`;
                } else if (i === 9) {
                    // Make showcase 9 clickable to the requested image viewer
                    showcasesHtml += `\n                <a class=\"showcase-item showcase-full\" href=\"#image=images/photo_2026-02-01_15-21-02.jpg\" title=\"Midea XTreme MSAG-24HRFN8-I/MSAG-24HRFN8-O\">\n                    <img src=\"${imgToUse}\" alt=\"Midea XTreme MSAG-24HRFN8-I/MSAG-24HRFN8-O\">\n                </a>`;
                } else if (i === 10) {
                    // Make showcase 10 clickable to the requested image viewer
                    showcasesHtml += `\n                <a class=\"showcase-item showcase-full\" href=\"#image=images/photo_2026-02-01_15-29-40.jpg\" title=\"Midea Aurora MSAB-09HRFN8-I/MSAB-09HRFN8-O\">\n                    <img src=\"${imgToUse}\" alt=\"Midea Aurora MSAB-09HRFN8-I/MSAB-09HRFN8-O\">\n                </a>`;
                } else if (i === 11) {
                    // Make showcase 11 clickable to the requested image viewer
                    showcasesHtml += `\n                <a class=\"showcase-item showcase-full\" href=\"#image=images/photo_2026-02-01_15-37-40.jpg\" title=\"Midea Aurora MSAB-12HRFN8-I/MSAB-12HRFN8-O\">\n                    <img src=\"${imgToUse}\" alt=\"Midea Aurora MSAB-12HRFN8-I/MSAB-12HRFN8-O\">\n                </a>`;
                } else if (i === 12) {
                    // Make showcase 12 clickable to the requested image viewer
                    showcasesHtml += `\n                <a class=\"showcase-item showcase-full\" href=\"#image=images/photo_2026-02-01_15-44-34.jpg\" title=\"Midea Aurora MSAB-18HRFN8-I/MSAB-18HRFN8-O\">\n                    <img src=\"${imgToUse}\" alt=\"Midea Aurora MSAB-18HRFN8-I/MSAB-18HRFN8-O\">\n                </a>`;
                } else if (i === 13) {
                    // Make showcase 13 clickable to the requested image viewer
                    showcasesHtml += `\n                <a class=\"showcase-item showcase-full\" href=\"#image=images/photo_2026-02-01_15-52-50.jpg\" title=\"Midea Aurora MSAB-24HRFN8-I/MSAB-24HRFN8-O\">\n                    <img src=\"${imgToUse}\" alt=\"Midea Aurora MSAB-24HRFN8-I/MSAB-24HRFN8-O\">\n                </a>`;
                } else if (i === 14) {
                    // Make showcase 14 clickable to the requested image viewer
                    showcasesHtml += `\n                <a class=\"showcase-item showcase-full\" href=\"#image=images/photo_2026-02-01_17-45-32.jpg\" title=\"Midea Nordic MSAGN-09FN8-I/MSAGN-09FN8-O\">\n                    <img src=\"${imgToUse}\" alt=\"Midea Nordic MSAGN-09FN8-I/MSAGN-09FN8-O\">\n                </a>`;
                } else if (i === 15) {
                    // Make showcase 15 clickable to the requested image viewer
                    showcasesHtml += `\n                <a class=\"showcase-item showcase-full\" href=\"#image=images/photo_2026-02-01_17-48-36.jpg\" title=\"Midea Nordic MSAGN-12FN8-I/MSAGN-12FN8-O\">\n                    <img src=\"${imgToUse}\" alt=\"Midea Nordic MSAGN-12FN8-I/MSAGN-12FN8-O\">\n                </a>`;
                } else {
                    // Non-clickable showcase tiles for Midea (except the first)
                    showcasesHtml += `\n                <div class="showcase-item showcase-full" title="Вітрина ${i}">\n                    <img src="${imgToUse}" alt="Вітрина ${i}">\n                </div>`;
                }
            }
            showcasesHtml += '\n</div>';
            titleEl.innerHTML = showcasesHtml;
            const filtered = products.filter(p => p.brand === brand && p.name !== 'Ноутбук' && p.name !== 'Монитор');
            displayProducts(filtered);
            return;
        }
        // Special view for Gree: show 10 showcases
        else if (brand === 'Gree') {
            const greeImages = [
                'images/photo_2026-01-27_16-42-00.jpg',
                'images/photo_2026-01-27_17-34-05.jpg',
                'images/photo_2026-01-29_12-53-24.jpg',
                'images/photo_2026-01-27_17-55-10.jpg',
                'images/photo_2026-01-27_18-13-40.jpg',
                'images/photo_2026-01-27_16-58-01.jpg'
            ];
            let showcasesHtmlG = `<h2>${brand}</h2><div class="showcases">`;
            for (let i = 1; i <= 10; i++) {
                const img = greeImages[(i - 1) % greeImages.length];
                showcasesHtmlG += `\n                <a class="showcase-item" href="#brand=Gree" title="Вітрина ${i}">
                    <img src="${img}" alt="Вітрина ${i}">
                </a>`;
            }
            showcasesHtmlG += '\n</div>';
            titleEl.innerHTML = showcasesHtmlG;
            const filtered = products.filter(p => p.brand === brand);
            displayProducts(filtered);
            return;
        }
        // Special view for Haier: show 10 showcases
        else if (brand === 'Haier') {
            const haierImages = [
                'images/photo_2026-01-30_12-19-08.jpg',
                'images/photo_2026-01-30_12-01-51.jpg',
                'images/photo_2026-01-30_12-12-23.jpg',
                'images/photo_2026-01-30_12-25-16.jpg',
                'images/photo_2026-01-30_12-31-16.jpg',
                'images/photo_2026-01-30_12-46-59.jpg'
            ];
            let showcasesHtmlH = `<h2>${brand}</h2><div class="showcases">`;
                for (let i = 1; i <= 10; i++) {
                    let img = haierImages[(i - 1) % haierImages.length];
                    if (i === 1) {
                        img = 'images/photo_2026-02-01_19-44-54.jpg';
                    }
                    if (i === 2) {
                        img = 'images/photo_2026-02-01_19-47-30.jpg';
                    }
                    if (i === 3) {
                        img = 'images/photo_2026-02-01_19-50-34.jpg';
                    }
                    if (i === 4) {
                        img = 'images/photo_2026-02-01_19-55-08.jpg';
                    }
                    if (i === 5) {
                        img = 'images/photo_2026-02-01_19-57-52.jpg';
                    }
                    if (i === 6) {
                        img = 'images/photo_2026-02-01_20-01-08.jpg';
                    }
                    if (i === 7) {
                        img = 'images/photo_2026-02-01_20-08-47.jpg';
                    }
                    if (i === 8) {
                        img = 'images/photo_2026-02-01_20-17-35.jpg';
                    }
                    if (i === 9) {
                        img = 'images/photo_2026-01-31_18-25-33.jpg';
                    }
                    if (i === 10) {
                        img = 'images/photo_2026-01-31_18-22-26.jpg';
                    }
                    if (i === 1) {
                        showcasesHtmlH += `\n                <a class="showcase-item" href="#image=images/photo_2026-01-30_11-43-25.jpg" title="Haier Revive AS25RHBHRA/1U25YERFRA">
                        <img src="${img}" alt="Haier Revive AS25RHBHRA/1U25YERFRA">
                    </a>`;
                    } else if (i === 2) {
                        showcasesHtmlH += `\n                <a class="showcase-item" href="#image=images/photo_2026-01-30_12-01-59.jpg" title="Haier Revive AS35RHBHRA/1U35YERFRA">
                        <img src="${img}" alt="Haier Revive AS35RHBHRA/1U35YERFRA">
                    </a>`;
                        } else if (i === 3) {
                                showcasesHtmlH += `\n                <a class="showcase-item" href="#image=images/photo_2026-01-30_12-12-28.jpg" title="Haier Revive AS50RCBHRA/1U50MERFRA">
                                <img src="${img}" alt="Haier Revive AS50RCBHRA/1U50MERFRA">
                        </a>`;
                        } else if (i === 4) {
                            showcasesHtmlH += `\n                <a class="showcase-item" href="#image=images/photo_2026-01-30_12-25-20.jpg" title="Haier Flexis AS25FL-W/1U25MEHFRA-1">
                                <img src="${img}" alt="Haier Flexis AS25FL-W/1U25MEHFRA-1">
                        </a>`;
                        } else if (i === 5) {
                                showcasesHtmlH += `\n                <a class="showcase-item" href="#image=images/photo_2026-01-30_12-31-22.jpg" title="Haier Flexis AS35FL-W/1U35MEHFRA-1">
                                <img src="${img}" alt="Haier Flexis AS35FL-W/1U35MEHFRA-1">
                        </a>`;
                        } else if (i === 6) {
                            showcasesHtmlH += `\n                <a class="showcase-item" href="#image=images/photo_2026-01-31_18-34-25.jpg" title="Haier Flexis AS50FL-W/1U50KEFFRA-1">
                                <img src="${img}" alt="Haier Flexis AS50FL-W/1U50KEFFRA-1">
                        </a>`;
                        } else if (i === 7) {
                                showcasesHtmlH += `\n                <a class="showcase-item" href="#image=images/photo_2026-01-30_12-57-34.jpg" title="Haier Flexis AS71FL-W/1U71FL">
                                <img src="${img}" alt="Haier Flexis AS71FL-W/1U71FL">
                            </a>`;
                        } else if (i === 8) {
                                showcasesHtmlH += `\n                <a class="showcase-item" href="#image=images/photo_2026-01-30_13-09-26.jpg" title="Haier Flexis AS25FL-B/1U25MEHFRA-1">
                                <img src="${img}" alt="Haier Flexis AS25FL-B/1U25MEHFRA-1">
                        </a>`;
                        } else if (i === 9) {
                                showcasesHtmlH += `\n                <a class="showcase-item" href="#image=images/photo_2026-01-30_13-14-18.jpg" title="Haier Flexis AS35FL-B/1U35MEHFRA-1">
                                    <img src="${img}" alt="Haier Flexis AS35FL-B/1U35MEHFRA-1">
                        </a>`;
                        } else if (i === 10) {
                            showcasesHtmlH += `\n                <a class="showcase-item" href="#image=images/photo_2026-01-31_18-34-25.jpg" title="Haier Flexis AS50S2SF1FA-BH/1U50S2SM1FA">
                            <img src="${img}" alt="Haier Flexis AS50S2SF1FA-BH/1U50S2SM1FA">
                        </a>`;
                        } else {
                            showcasesHtmlH += `\n                <a class="showcase-item" href="#brand=Haier" title="Вітрина ${i}">
                            <img src="${img}" alt="Вітрина ${i}">
                        </a>`;
                    }
            }
            showcasesHtmlH += '\n</div>';
            titleEl.innerHTML = showcasesHtmlH;
            // В категории Haier убираем колонку товара с id=3 (содержит нежеланную ссылку)
            const filteredH = products.filter(p => p.brand === brand && p.id !== 3);
            displayProducts(filteredH);
            return;
        }
        // Special view for Cooper&Hunter: show 10 showcases
        else if (brand === 'Cooper&Hunter') {
            const chImages = [
                'images/photo_2026-01-29_13-09-00.jpg',
                'images/photo_2026-01-29_12-04-22.jpg',
                'images/photo_2026-01-29_12-53-24.jpg',
                'images/photo_2026-01-29_16-25-55.jpg',
                'images/photo_2026-01-29_16-57-16.jpg',
                'images/photo_2026-01-29_17-08-48.jpg',
                'images/photo_2026-01-29_17-30-01.jpg',
                'images/photo_2026-01-29_17-39-48.jpg'
            ];
            let showcasesHtmlC = `<h2>${brand}</h2><div class="showcases">`;
            for (let i = 1; i <= 12; i++) {
                let img = chImages[(i - 1) % chImages.length];
                if (i === 1) {
                    // Витрина 1: заменить отображаемое фото на 2026-01-31_15-33-38
                    img = 'images/photo_2026-01-31_15-33-38.jpg';
                }
                if (i === 2) {
                    // Витрина 2: заменить отображаемое фото на 2026-01-31_15-41-46
                    img = 'images/photo_2026-01-31_15-41-46.jpg';
                }
                if (i === 3) {
                    // Витрина 3: заменить отображаемое фото на 2026-01-31_15-45-54
                    img = 'images/photo_2026-01-31_15-45-54.jpg';
                }
                if (i === 4) {
                    // Витрина 4: заменить отображаемое фото на 2026-01-31_15-51-54
                    img = 'images/photo_2026-01-31_15-51-54.jpg';
                }
                if (i === 5) {
                    // Витрина 5: заменить отображаемое фото на 2026-01-31_15-55-26
                    img = 'images/photo_2026-01-31_15-55-26.jpg';
                }
                if (i === 6) {
                    // Витрина 6: заменить отображаемое фото на 2026-01-31_15-58-37
                    img = 'images/photo_2026-01-31_15-58-37.jpg';
                }
                if (i === 7) {
                    // Витрина 7: заменить отображаемое фото на 2026-01-31_16-02-09
                    img = 'images/photo_2026-01-31_16-02-09.jpg';
                }
                if (i === 8) {
                    // Витрина 8: заменить отображаемое фото на 2026-01-31_16-05-02
                    img = 'images/photo_2026-01-31_16-05-02.jpg';
                }
                if (i === 9) {
                    // Витрина 9: заменить отображаемое фото на 2026-01-31_16-09-06
                    img = 'images/photo_2026-01-31_16-09-06.jpg';
                }
                if (i === 10) {
                    // Витрина 10: заменить отображаемое фото на 2026-01-31_16-14-07
                    img = 'images/photo_2026-01-31_16-14-07.jpg';
                }
                if (i === 11) {
                    // Витрина 11: заменить отображаемое фото на 2026-01-31_16-17-29
                    img = 'images/photo_2026-01-31_16-17-29.jpg';
                }
                if (i === 12) {
                    // Витрина 12: заменить отображаемое фото на 2026-01-31_16-21-01
                    img = 'images/photo_2026-01-31_16-21-01.jpg';
                }
                if (i === 1) {
                    // Витрина 1: ссылка на просмотр 14-00-16
                    showcasesHtmlC += `\n                <a class="showcase-item" href="#image=images/photo_2026-01-30_14-00-16.jpg" title="Cooper&Hunter CH-S07FTXF2-NG">\n                    <img src="${img}" alt="Cooper&Hunter CH-S07FTXF2-NG">\n                </a>`;
                } else if (i === 2) {
                    // Витрина 2: ссылка на просмотр 14-00-26
                    showcasesHtmlC += `\n                <a class="showcase-item" href="#image=images/photo_2026-01-30_14-00-26.jpg" title="Cooper&Hunter CH-S09FTXF2-NG">\n                    <img src="${img}" alt="Cooper&Hunter CH-S09FTXF2-NG">\n                </a>`;
                } else if (i === 3) {
                    // Витрина 3: ссылка на просмотр 14-00-35
                    showcasesHtmlC += `\n                <a class="showcase-item" href="#image=images/photo_2026-01-30_14-00-35.jpg" title="Cooper&Hunter CH-S12FTXF2-NG">\n                        <img src="${img}" alt="Cooper&Hunter CH-S12FTXF2-NG">\n                    </a>`;
                } else if (i === 4) {
                    // Витрина 4: ссылка на просмотр 14-00-40
                    showcasesHtmlC += `\n                <a class="showcase-item" href="#image=images/photo_2026-01-30_14-00-40.jpg" title="Cooper&Hunter CH-S18FTXF2-NG">\n                        <img src="${img}" alt="Cooper&Hunter CH-S18FTXF2-NG">\n                    </a>`;
                    } else if (i === 5) {
                        // Витрина 5: ссылка на просмотр 14-00-46
                        showcasesHtmlC += `\n                <a class="showcase-item" href="#image=images/photo_2026-01-30_14-00-46.jpg" title="Cooper&Hunter CH-S09FTXLA2-NG">\n                    <img src="${img}" alt="Cooper&Hunter CH-S09FTXLA2-NG">\n                </a>`;
                    } else if (i === 6) {
                        // Витрина 6: ссылка на просмотр 14-00-50
                        showcasesHtmlC += `\n                <a class="showcase-item" href="#image=images/photo_2026-01-30_14-00-50.jpg" title="Cooper&Hunter CH-S12FTXLA2-NG">\n                    <img src="${img}" alt="Cooper&Hunter CH-S12FTXLA2-NG">\n                </a>`;
                    } else if (i === 7) {
                        // Витрина 7: ссылка на просмотр 14-00-55
                        showcasesHtmlC += `\n                <a class="showcase-item" href="#image=images/photo_2026-01-30_14-00-55.jpg" title="Cooper&Hunter CH-S18FTXLA2-NG">\n                    <img src="${img}" alt="Cooper&Hunter CH-S18FTXLA2-NG">\n                </a>`;
                    } else if (i === 8) {
                        // Витрина 8: ссылка на просмотр 14-01-01
                        showcasesHtmlC += `\n                <a class="showcase-item" href="#image=images/photo_2026-01-30_14-01-01.jpg" title="Cooper&Hunter CH-S24FTXLA2-NG">\n                    <img src="${img}" alt="Cooper&Hunter CH-S24FTXLA2-NG">\n                </a>`;
                    } else if (i === 9) {
                        // Витрина 9: ссылка на просмотр 14-01-06
                        showcasesHtmlC += `\n                <a class="showcase-item" href="#image=images/photo_2026-01-30_14-01-06.jpg" title="Cooper&Hunter CH-S09FTXTB2S-NG">\n                    <img src="${img}" alt="Cooper&Hunter CH-S09FTXTB2S-NG">\n                </a>`;
                    } else if (i === 10) {
                        // Витрина 10: ссылка на просмотр 14-01-12
                        showcasesHtmlC += `\n                <a class="showcase-item" href="#image=images/photo_2026-01-30_14-01-12.jpg" title="Cooper&Hunter CH-S12FTXTB2S-NG">\n                    <img src="${img}" alt="Cooper&Hunter CH-S12FTXTB2S-NG">\n                </a>`;
                    } else if (i === 11) {
                        // Витрина 11: ссылка на просмотр 13-35-42
                        showcasesHtmlC += `\n                <a class="showcase-item" href="#image=images/photo_2026-01-30_13-35-42.jpg" title="Cooper&Hunter CH-S18FTXAL2-NG">\n                    <img src="${img}" alt="Cooper&Hunter CH-S18FTXAL2-NG">\n                </a>`;
                    } else if (i === 12) {
                        // Витрина 12: ссылка на просмотр 13-43-19
                        showcasesHtmlC += `\n                <a class="showcase-item" href="#image=images/photo_2026-01-30_13-43-19.jpg" title="Cooper&Hunter CH-S24FTXQ2-NG">\n                    <img src="${img}" alt="Cooper&Hunter CH-S24FTXQ2-NG">\n                </a>`;
                    } else {
                        showcasesHtmlC += `\n                <a class="showcase-item" href="#brand=Cooper%26Hunter" title="Вітрина ${i}">\n                    <img src="${img}" alt="Вітрина ${i}">\n                </a>`;
                    }
            }
            showcasesHtmlC += '\n</div>';
            titleEl.innerHTML = showcasesHtmlC;
            const filteredC = products.filter(p => p.brand === brand);
            const filteredCWithLink = filteredC.map(p => {
                if (p.id === 4) {
                    // For Cooper&Hunter product id=4, update link to the new requested image viewer
                    return { 
                        ...p, 
                        brandHref: '#image=images/photo_2026-01-30_14-27-34.jpg', 
                        brandLinkTitle: 'Cooper&Hunter CH-S24FTXF2-NG',
                        brandImage: 'images/photo_2026-01-31_16-27-44.jpg',
                        featuredClass: 'ch-featured-350'
                    };
                }
                return p;
            });
            displayProducts(filteredCWithLink);
            return;
        }
        titleEl.innerHTML = `<h2>${brand}</h2>`;
        const filtered = products.filter(p => p.brand === brand);
        displayProducts(filtered);
    } else {
        // Главная страница (#home): показываем 8 витрин с подписями "Вітрина 1–8"
        titleEl.innerHTML = `<h2 style="text-align:center;">АКЦІЙНІ ТОВАРИ</h2>`;
        const p1 = products.find(p => p.id === 1);
        const p2 = products.find(p => p.id === 2);
        const p3 = products.find(p => p.id === 3);
        const p4 = products.find(p => p.id === 4);
        const p5 = products.find(p => p.id === 5);
        const p6 = products.find(p => p.id === 6);

        const s1 = p1 ? { 
            isShowcase: true, 
            image: 'images/photo_2026-02-01_14-55-07.jpg', 
            title: 'Midea XTreme MSAG-09HRFN8-I/MSAG-09HRFN8-O', 
            href: '#image=images/photo_2026-02-01_14-55-12.jpg', 
            showCaption: false 
        } : null;
        const s2 = p2 ? { 
            isShowcase: true, 
            image: 'images/photo_2026-02-01_15-06-03.jpg', 
            title: 'Midea XTreme MSAG-12HRFN8-I/MSAG-12HRFN8-O', 
            href: '#image=images/photo_2026-02-01_15-06-06.jpg', 
            showCaption: false 
        } : null;
        const s3 = p3 ? { 
            isShowcase: true, 
            image: 'images/photo_2026-02-01_15-14-13.jpg', 
            title: 'Midea XTreme MSAG-18HRFN8-I/MSAG-18HRFN8-O', 
            href: '#image=images/photo_2026-02-01_15-14-21.jpg', 
            showCaption: false 
        } : null;
        const s4 = p4 ? { 
            isShowcase: true, 
            image: 'images/photo_2026-02-01_15-20-55.jpg', 
            title: 'Midea XTreme MSAG-24HRFN8-I/MSAG-24HRFN8-O', 
            href: '#image=images/photo_2026-02-01_15-21-02.jpg', 
            showCaption: false 
        } : null;
        const s5 = p5 ? { 
            isShowcase: true, 
            image: 'images/photo_2026-02-01_15-29-36.jpg', 
            title: 'Midea Aurora MSAB-09HRFN8-I/MSAB-09HRFN8-O', 
            href: '#image=images/photo_2026-02-01_15-29-40.jpg', 
            showCaption: false 
        } : null;
        const s6 = p6 ? { 
            isShowcase: true, 
            image: 'images/photo_2026-02-01_15-37-36.jpg', 
            title: 'Midea Aurora MSAB-12HRFN8-I/MSAB-12HRFN8-O', 
            href: '#image=images/photo_2026-02-01_15-37-40.jpg', 
            showCaption: false 
        } : null;
        const s7 = { 
            isShowcase: true, 
            image: 'images/photo_2026-02-01_15-44-30.jpg', 
            title: 'Midea Aurora MSAB-18HRFN8-I/MSAB-18HRFN8-O', 
            href: '#image=images/photo_2026-02-01_15-44-34.jpg', 
            showCaption: false 
        };
        const s8 = { 
            isShowcase: true, 
            image: 'images/photo_2026-02-01_15-52-46.jpg', 
            title: 'Midea Aurora MSAB-24HRFN8-I/MSAB-24HRFN8-O', 
            href: '#image=images/photo_2026-02-01_15-52-50.jpg', 
            showCaption: false 
        };

        const homeItems = [s1, s2, s3, s4, s5, s6, s7, s8].filter(Boolean);
        displayProducts(homeItems);
    }
}

document.querySelectorAll('.brand-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href') || '';
        let brand = '';
        if (href.startsWith('#brand=')) {
            brand = decodeURIComponent(href.split('=')[1]);
        } else {
            brand = this.textContent.trim();
        }
        window.location.hash = 'brand=' + encodeURIComponent(brand);
        showBrand(brand);
        hideOrderFab();
        // Scroll to top (or to page title) after switching brand
        // Force scroll to absolute top so brand title is visible under fixed header
        window.scrollTo({ top: 0, behavior: 'auto' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        setActiveNav(brand);
    });
});

// Intercept Home icon clicks to render Home view and scroll to title
document.querySelectorAll('a[href="#home"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        // Clear any custom background and show Home
        document.body.style.backgroundImage = '';
        showBrand(null);
        hideOrderFab();
        // Smoothly scroll so the "АКЦІЙНІ ТОВАРИ" heading is visible
        const titleEl = document.getElementById('page-title');
        if (titleEl && titleEl.scrollIntoView) {
            titleEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // Update URL to #home without relying on anchor default scroll
        if (window.history && window.history.pushState) {
            window.history.pushState(null, '', '#home');
        } else {
            window.location.hash = '#home';
        }
        setActiveNav('home');
    });
});

function showImage(imagePath) {
    const titleEl = document.getElementById('page-title');
    if (!titleEl) return;
    // Clear prior return highlight when entering viewer
    document.querySelectorAll('.return-highlight').forEach(el => el.classList.remove('return-highlight'));
    // Track last viewed image for order form context
    window.lastViewedImage = imagePath;
    // Resolve human-readable title from search index
    try {
        const idx = getShowcaseSearchIndex();
        const hit = idx.find(item => (item.href || '') === ('#image=' + imagePath));
        window.lastViewedTitle = hit ? hit.title : '';
    } catch (_) {
        window.lastViewedTitle = '';
    }
    // If the viewed image is one of the special ones, set page background to requested photo
    const specialBgImages = [
        'images/photo_2026-01-29_12-53-29.jpg',
        'images/photo_2026-01-29_12-26-56.jpg',
        'images/photo_2026-01-29_12-46-14.jpg'
    ];
    if (specialBgImages.includes(imagePath)) {
        document.body.style.backgroundImage = "url('images/photo_2026-01-28_13-31-34.jpg')";
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
    } else {
        // default: no custom background
        document.body.style.backgroundImage = '';
    }
    const viewerTitle = window.lastViewedTitle || '';
    titleEl.innerHTML = `
        <div class="image-viewer" style="position:relative;display:flex;justify-content:center;align-items:center;padding:20px;">
            ${viewerTitle ? `<div class="image-title-overlay"><span>${viewerTitle}</span></div>` : ''}
            <img src="${imagePath}" alt="Просмотр изображения" style="max-width:100%;height:auto;box-shadow:0 2px 8px rgba(0,0,0,0.3);">
        </div>`;
    // clear products area
    const productsContainer = document.getElementById('products');
    if (productsContainer) productsContainer.innerHTML = '';

    // Show floating order button
    ensureOrderFab();
    showOrderFab();
}

function handleHash() {
    const hash = window.location.hash || '';
    if (hash.startsWith('#image=')) {
        const img = decodeURIComponent(hash.split('=')[1]);
        showImage(img);
        showOrderFab();
    } else if (hash.startsWith('#brand=')) {
        // clear any custom background when showing brand
        document.body.style.backgroundImage = '';
        const brand = decodeURIComponent(hash.split('=')[1]);
        showBrand(brand);
        hideOrderFab();
        // Ensure we are at the top when changing brand via hash (back/forward)
        // Ensure absolute top on brand change via hash navigation
        window.scrollTo({ top: 0, behavior: 'auto' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        setActiveNav(brand);
        // After rendering brand, highlight last viewed item and center it
        setTimeout(() => { highlightLastViewedAndScroll(); }, 60);
    } else {
        document.body.style.backgroundImage = '';
        showBrand(null);
        hideOrderFab();
        setActiveNav('home');
        // On returning to home, highlight last viewed showcase if present
        setTimeout(() => { highlightLastViewedAndScroll(); }, 60);
    }
}

window.addEventListener('hashchange', handleHash);
window.addEventListener('load', handleHash);

updateCartCount();

// Highlight last viewed item on the page and scroll it into view
function highlightLastViewedAndScroll() {
    const img = window.lastViewedImage;
    if (!img) return;
    const selector = `a[href="#image=${img}"]`;
    // Remove any previous highlights
    document.querySelectorAll('.return-highlight').forEach(el => el.classList.remove('return-highlight'));
    const candidates = [];
    const inTitle = document.querySelector(`#page-title ${selector}`);
    if (inTitle) candidates.push(inTitle);
    const inProducts = document.querySelector(`#products ${selector}`);
    if (inProducts) candidates.push(inProducts);
    if (candidates.length) {
        candidates.forEach(el => el.classList.add('return-highlight'));
        // Center first match for clarity
        try {
            candidates[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (_) { /* no-op */ }
    }
}

// Floating order button helpers
function ensureOrderFab() {
    let fab = document.getElementById('order-fab');
    if (!fab) {
        fab = document.createElement('div');
        fab.id = 'order-fab';
        fab.innerHTML = `
            <a href="#" id="order-fab-btn" aria-label="Замовити" title="Замовити">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="false">
                    <path d="M3 5h2l1.2 6.1A2 2 0 008.17 13h8.66a2 2 0 001.96-1.6L20 7H6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="9" cy="19" r="1.6" fill="currentColor"/>
                    <circle cx="18" cy="19" r="1.6" fill="currentColor"/>
                </svg>
                <span>Замовити</span>
            </a>
        `;
        document.body.appendChild(fab);
        const btn = document.getElementById('order-fab-btn');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openOrderModal();
            });
        }
    }
}

function showOrderFab() {
    const fab = document.getElementById('order-fab');
    if (fab) fab.style.display = 'block';
}

function hideOrderFab() {
    const fab = document.getElementById('order-fab');
    if (fab) fab.style.display = 'none';
}

// Order modal logic
function openOrderModal() {
    const modal = document.getElementById('order-modal');
    if (!modal) return;
    modal.style.display = 'block';
    // Prefill product title if available
    const productInput = document.getElementById('order-product');
    if (productInput) {
        productInput.value = window.lastViewedTitle || window.lastViewedImage || '';
    }
}

function closeOrderModal() {
    const modal = document.getElementById('order-modal');
    if (!modal) return;
    modal.style.display = 'none';
}

function submitOrderForm(e) {
    e.preventDefault();
    const name = (document.getElementById('order-name')?.value || '').trim();
    const phone = (document.getElementById('order-phone')?.value || '').trim();
    const productTitle = (document.getElementById('order-product')?.value || window.lastViewedTitle || '').trim();
    if (!name || !phone) {
        alert('Будь ласка, заповніть ім\'я та телефон');
        return;
    }
    // Prefer Formspree direct submission if endpoint is set
    if (typeof FORMSPREE_ENDPOINT === 'string' && FORMSPREE_ENDPOINT) {
        const formEl = document.getElementById('order-form');
        const fd = new FormData(formEl);
        fd.set('name', name);
        fd.set('phone', phone);
        fd.set('product', productTitle);
        fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: fd
        })
        .then(resp => {
            if (resp.ok) {
                closeOrderModal();
                alert('Заявку надіслано. Дякуємо!');
            } else {
                return resp.json().then(() => { throw new Error('Formspree error'); });
            }
        })
        .catch(() => {
            const message = `Ім'я: ${name}\nТелефон: ${phone}\nНазва: ${productTitle}`;
            const subject = encodeURIComponent('Заявка Smart Climat');
            const body = encodeURIComponent(message);
            const mailto = `mailto:denissvatiy@icloud.com?subject=${subject}&body=${body}`;
            window.location.href = mailto;
            closeOrderModal();
            alert('Відправлено через Email-клієнт.');
        });
        return;
    }
    if (EMAILJS_ENABLED) {
        sendOrderViaEmailJS(name, phone, productTitle)
            .then(() => {
                closeOrderModal();
                alert('Заявку надіслано на email. Дякуємо!');
            })
            .catch(() => {
                const message = `Ім'я: ${name}\nТелефон: ${phone}\nНазва: ${productTitle}`;
                const subject = encodeURIComponent('Заявка Smart Climat');
                const body = encodeURIComponent(message);
                const mailto = `mailto:denissvatiy@icloud.com?subject=${subject}&body=${body}`;
                window.location.href = mailto;
                closeOrderModal();
                alert('Відправлено через Email-клієнт.');
            });
    } else {
        const message = `Ім'я: ${name}\nТелефон: ${phone}\nНазва: ${productTitle}`;
        const subject = encodeURIComponent('Заявка Smart Climat');
        const body = encodeURIComponent(message);
        const mailto = `mailto:denissvatiy@icloud.com?subject=${subject}&body=${body}`;
        window.location.href = mailto;
        closeOrderModal();
        alert('Відправлено через Email-клієнт.');
    }
}

// Bind order modal events once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initEmailJS();
    const closeBtn = document.getElementById('order-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeOrderModal);
    }
    const form = document.getElementById('order-form');
    if (form) {
        form.addEventListener('submit', submitOrderForm);
    }
    // Click outside modal to close
    const modal = document.getElementById('order-modal');
    if (modal) {
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeOrderModal();
            }
        });
    }
});

// Highlight active category (brand or home)
function setActiveNav(state) {
    const brandLinks = document.querySelectorAll('.brand-link');
    brandLinks.forEach(link => link.classList.remove('active'));
    if (state && state !== 'home') {
        brandLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            let label = link.textContent.trim();
            if (href.startsWith('#brand=')) {
                label = decodeURIComponent(href.split('=')[1]);
            }
            if (label.toLowerCase() === String(state).toLowerCase()) {
                link.classList.add('active');
            }
        });
    }
    const homeLink = document.querySelector('#bottom-nav a[href="#home"]');
    if (homeLink) {
        if (state === 'home' || !state) {
            homeLink.classList.add('active');
        } else {
            homeLink.classList.remove('active');
        }
    }
}

// Back button behavior: go back if possible, otherwise to Home
document.querySelectorAll('.back-button').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        if (window.history && window.history.length > 1) {
            window.history.back();
        } else {
            document.body.style.backgroundImage = '';
            showBrand(null);
            window.location.hash = '#home';
            // ensure top
            window.scrollTo({ top: 0, behavior: 'auto' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            setActiveNav('home');
        }
    });
});

// --- Search binding: open showcase by typing its title and pressing Enter ---
function normalizeText(s) {
    // Lowercase and make separators tolerant: treat any non-alphanumeric (Latin/Cyrillic) as spaces,
    // then collapse spaces so queries like "ch s24ftxf2 ng" match titles with dashes/slashes.
    const t = (s || '').toLowerCase();
    return t
        .replace(/[^a-z0-9\u0400-\u04FF]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function getShowcaseSearchIndex() {
    // Consolidated index of showcase titles to viewer links
    return [
        // Home showcases (AKЦІЙНІ ТОВАРИ)
        { title: 'Midea XTreme MSAG-09HRFN8-I/MSAG-09HRFN8-O', brand: 'Midea', href: '#image=images/photo_2026-02-01_14-55-12.jpg' },
        { title: 'Midea XTreme MSAG-12HRFN8-I/MSAG-12HRFN8-O', brand: 'Midea', href: '#image=images/photo_2026-02-01_15-06-06.jpg' },
        { title: 'Midea XTreme MSAG-18HRFN8-I/MSAG-18HRFN8-O', brand: 'Midea', href: '#image=images/photo_2026-02-01_15-14-21.jpg' },
        { title: 'Midea XTreme MSAG-24HRFN8-I/MSAG-24HRFN8-O', brand: 'Midea', href: '#image=images/photo_2026-02-01_15-21-02.jpg' },
        { title: 'Midea Aurora MSAB-09HRFN8-I/MSAB-09HRFN8-O', brand: 'Midea', href: '#image=images/photo_2026-02-01_15-29-40.jpg' },
        { title: 'Midea Aurora MSAB-12HRFN8-I/MSAB-12HRFN8-O', brand: 'Midea', href: '#image=images/photo_2026-02-01_15-37-40.jpg' },
        { title: 'Midea Aurora MSAB-18HRFN8-I/MSAB-18HRFN8-O', brand: 'Midea', href: '#image=images/photo_2026-02-01_15-44-34.jpg' },
        { title: 'Midea Aurora MSAB-24HRFN8-I/MSAB-24HRFN8-O', brand: 'Midea', href: '#image=images/photo_2026-02-01_15-52-50.jpg' },

        // Midea brand showcases
        { title: 'Midea Forest AF-07N1C2-I/AF-07N1C2-O', brand: 'Midea', href: '#image=images/photo_2026-01-31_18-48-10.jpg' },
        { title: 'Midea Forest AF-09N1C2-I/AF-09N1C2-O', brand: 'Midea', href: '#image=images/photo_2026-01-31_18-57-54.jpg' },
        { title: 'Midea Forest AF6-12N8C2E-I/AF6-12N8C2E-O', brand: 'Midea', href: '#image=images/photo_2026-01-31_19-04-46.jpg' },
        { title: 'Midea Forest AF8-18N8C0E-I/AF8-18N8C0E-O', brand: 'Midea', href: '#image=images/photo_2026-01-31_19-11-52.jpg' },
        { title: 'Midea Forest AF6-24N8-D0E-I/AF6-24N8-D0E-O', brand: 'Midea', href: '#image=images/photo_2026-02-01_12-14-24.jpg' },
        { title: 'Midea XTreme MSAG-09HRFN8-I/MSAG-09HRFN8-O', brand: 'Midea', href: '#image=images/photo_2026-02-01_14-55-12.jpg' },
        { title: 'Midea XTreme MSAG-12HRFN8-I/MSAG-12HRFN8-O', brand: 'Midea', href: '#image=images/photo_2026-02-01_15-06-06.jpg' },
        { title: 'Midea XTreme MSAG-18HRFN8-I/MSAG-18HRFN8-O', brand: 'Midea', href: '#image=images/photo_2026-02-01_15-14-21.jpg' },
        { title: 'Midea XTreme MSAG-24HRFN8-I/MSAG-24HRFN8-O', brand: 'Midea', href: '#image=images/photo_2026-02-01_15-21-02.jpg' },
        { title: 'Midea Aurora MSAB-09HRFN8-I/MSAB-09HRFN8-O', brand: 'Midea', href: '#image=images/photo_2026-02-01_15-29-40.jpg' },
        { title: 'Midea Aurora MSAB-12HRFN8-I/MSAB-12HRFN8-O', brand: 'Midea', href: '#image=images/photo_2026-02-01_15-37-40.jpg' },
        { title: 'Midea Aurora MSAB-18HRFN8-I/MSAB-18HRFN8-O', brand: 'Midea', href: '#image=images/photo_2026-02-01_15-44-34.jpg' },
        { title: 'Midea Aurora MSAB-24HRFN8-I/MSAB-24HRFN8-O', brand: 'Midea', href: '#image=images/photo_2026-02-01_15-52-50.jpg' },
        { title: 'Midea Nordic MSAGN-09FN8-I/MSAGN-09FN8-O', brand: 'Midea', href: '#image=images/photo_2026-02-01_17-45-32.jpg' },
        { title: 'Midea Nordic MSAGN-12FN8-I/MSAGN-12FN8-O', brand: 'Midea', href: '#image=images/photo_2026-02-01_17-48-36.jpg' },

        // Haier brand showcases
        { title: 'Haier Revive AS25RHBHRA/1U25YERFRA', brand: 'Haier', href: '#image=images/photo_2026-01-30_11-43-25.jpg' },
        { title: 'Haier Revive AS35RHBHRA/1U35YERFRA', brand: 'Haier', href: '#image=images/photo_2026-01-30_12-01-59.jpg' },
        { title: 'Haier Revive AS50RCBHRA/1U50MERFRA', brand: 'Haier', href: '#image=images/photo_2026-01-30_12-12-28.jpg' },
        { title: 'Haier Flexis AS25FL-W/1U25MEHFRA-1', brand: 'Haier', href: '#image=images/photo_2026-01-30_12-25-20.jpg' },
        { title: 'Haier Flexis AS35FL-W/1U35MEHFRA-1', brand: 'Haier', href: '#image=images/photo_2026-01-30_12-31-22.jpg' },
        { title: 'Haier Flexis AS50FL-W/1U50KEFFRA-1', brand: 'Haier', href: '#image=images/photo_2026-01-31_18-34-25.jpg' },
        { title: 'Haier Flexis AS71FL-W/1U71FL', brand: 'Haier', href: '#image=images/photo_2026-01-30_12-57-34.jpg' },
        { title: 'Haier Flexis AS25FL-B/1U25MEHFRA-1', brand: 'Haier', href: '#image=images/photo_2026-01-30_13-09-26.jpg' },
        { title: 'Haier Flexis AS35FL-B/1U35MEHFRA-1', brand: 'Haier', href: '#image=images/photo_2026-01-30_13-14-18.jpg' },
        { title: 'Haier Flexis AS50S2SF1FA-BH/1U50S2SM1FA', brand: 'Haier', href: '#image=images/photo_2026-01-31_18-34-25.jpg' },

        // Cooper&Hunter brand showcases
        { title: 'Cooper&Hunter CH-S07FTXF2-NG', brand: 'Cooper&Hunter', href: '#image=images/photo_2026-01-30_14-00-16.jpg' },
        { title: 'Cooper&Hunter CH-S09FTXF2-NG', brand: 'Cooper&Hunter', href: '#image=images/photo_2026-01-30_14-00-26.jpg' },
        { title: 'Cooper&Hunter CH-S12FTXF2-NG', brand: 'Cooper&Hunter', href: '#image=images/photo_2026-01-30_14-00-35.jpg' },
        { title: 'Cooper&Hunter CH-S18FTXF2-NG', brand: 'Cooper&Hunter', href: '#image=images/photo_2026-01-30_14-00-40.jpg' },
        { title: 'Cooper&Hunter CH-S09FTXLA2-NG', brand: 'Cooper&Hunter', href: '#image=images/photo_2026-01-30_14-00-46.jpg' },
        { title: 'Cooper&Hunter CH-S12FTXLA2-NG', brand: 'Cooper&Hunter', href: '#image=images/photo_2026-01-30_14-00-50.jpg' },
        { title: 'Cooper&Hunter CH-S18FTXLA2-NG', brand: 'Cooper&Hunter', href: '#image=images/photo_2026-01-30_14-00-55.jpg' },
        { title: 'Cooper&Hunter CH-S24FTXLA2-NG', brand: 'Cooper&Hunter', href: '#image=images/photo_2026-01-30_14-01-01.jpg' },
        { title: 'Cooper&Hunter CH-S09FTXTB2S-NG', brand: 'Cooper&Hunter', href: '#image=images/photo_2026-01-30_14-01-06.jpg' },
        { title: 'Cooper&Hunter CH-S12FTXTB2S-NG', brand: 'Cooper&Hunter', href: '#image=images/photo_2026-01-30_14-01-12.jpg' },
        { title: 'Cooper&Hunter CH-S18FTXAL2-NG', brand: 'Cooper&Hunter', href: '#image=images/photo_2026-01-30_13-35-42.jpg' },
        { title: 'Cooper&Hunter CH-S24FTXQ2-NG', brand: 'Cooper&Hunter', href: '#image=images/photo_2026-01-30_13-43-19.jpg' }
    ];
}

function findIndexMatch(raw) {
    const q = normalizeText(raw);
    if (!q) return null;
    const index = getShowcaseSearchIndex();
    return index.find(item => normalizeText(item.title).includes(q)) || null;
}

function handleSearchQuery(raw) {
    const q = normalizeText(raw);
    if (!q) return;
    const index = getShowcaseSearchIndex();
    const match = index.find(item => normalizeText(item.title).includes(q));
    if (match) {
        // Navigate to the image viewer of the matched showcase
        window.location.hash = match.href;
    } else {
        alert('Нічого не знайдено за запитом');
    }
}

function clearSearchHighlights() {
    document.querySelectorAll('.search-highlight').forEach(el => el.classList.remove('search-highlight'));
    document.querySelectorAll('.return-highlight').forEach(el => el.classList.remove('return-highlight'));
}

function highlightMatchesLive(raw) {
    clearSearchHighlights();
    const q = normalizeText(raw);
    if (!q) return;
    // Search across showcase tiles and product cards
    const candidates = [];
    // Showcase tiles: anchor/div with title or img alt
    document.querySelectorAll('.showcase-item').forEach(el => {
        const img = el.querySelector('img');
        const title = (el.getAttribute('title') || '').trim();
        const alt = img ? (img.getAttribute('alt') || '').trim() : '';
        const text = normalizeText(title || alt);
        if (text && text.includes(q)) candidates.push(el);
    });
    // Product cards image-only wrappers
    document.querySelectorAll('.product-image-only').forEach(el => {
        const img = el.querySelector('img');
        const alt = img ? (img.getAttribute('alt') || '').trim() : '';
        const link = el.querySelector('a');
        const linkTitle = link ? (link.getAttribute('title') || '').trim() : '';
        const text = normalizeText(alt || linkTitle);
        if (text && text.includes(q)) candidates.push(el);
    });
    // Regular product cards
    document.querySelectorAll('.product').forEach(el => {
        const h3 = el.querySelector('h3');
        const text = normalizeText(h3 ? h3.textContent : '');
        if (text && text.includes(q)) candidates.push(el);
    });
    // Apply highlight and scroll to first match
    candidates.forEach(el => el.classList.add('search-highlight'));
    if (candidates.length > 0) {
        candidates[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        // If nothing matches in current view, try to auto-switch to the brand where a match exists
        const idxMatch = findIndexMatch(raw);
        if (idxMatch && idxMatch.brand) {
            window.location.hash = 'brand=' + encodeURIComponent(idxMatch.brand);
            showBrand(idxMatch.brand);
            setTimeout(() => {
                // Re-run highlight after DOM updates
                highlightMatchesLive(raw);
            }, 0);
        }
    }
}

const searchInputEl = document.getElementById('search');
if (searchInputEl) {
    // Live highlight on input
    searchInputEl.addEventListener('input', (e) => {
        highlightMatchesLive(searchInputEl.value);
    });
    // On Enter: only highlight + scroll, do not open immediately
    searchInputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Navigate to brand if query mentions it, then highlight
            const raw = searchInputEl.value;
            const q = normalizeText(raw);
            const brand = (q.includes('midea')) ? 'Midea'
                         : (q.includes('haier')) ? 'Haier'
                         : (q.includes('cooper') || q.includes('hunter')) ? 'Cooper&Hunter'
                         : (q.includes('gree')) ? 'Gree'
                         : (findIndexMatch(raw)?.brand || null);
            if (brand) {
                // Switch brand view
                window.location.hash = 'brand=' + encodeURIComponent(brand);
                showBrand(brand);
                // After DOM updates, highlight matches and scroll to them
                setTimeout(() => {
                    highlightMatchesLive(raw);
                }, 0);
            } else {
                highlightMatchesLive(raw);
            }
        }
    });
    // Click on search button triggers same behavior as Enter
    const searchButtonEl = document.getElementById('search-button');
    if (searchButtonEl) {
        searchButtonEl.addEventListener('click', (e) => {
            e.preventDefault();
            const raw = searchInputEl.value;
            const q = normalizeText(raw);
            const brand = (q.includes('midea')) ? 'Midea'
                         : (q.includes('haier')) ? 'Haier'
                         : (q.includes('cooper') || q.includes('hunter')) ? 'Cooper&Hunter'
                         : (q.includes('gree')) ? 'Gree'
                         : (findIndexMatch(raw)?.brand || null);
            if (brand) {
                window.location.hash = 'brand=' + encodeURIComponent(brand);
                showBrand(brand);
                setTimeout(() => {
                    highlightMatchesLive(raw);
                }, 0);
            } else {
                highlightMatchesLive(raw);
            }
        });
    }
}
