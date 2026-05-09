import { Controller } from '../component.js';
import { loader } from '../index.js';

// Config
const config = await loader.config('default');

// Language
const language = await loader.language('product/product');

// Library
const local = await loader.library('local');
const tax = await loader.library('tax');

// Currency
const currency = local.has('currency') ? local.get('currency') : config.config_currency;

// Storage
const stock_status = await loader.storage('localisation/stock_status');

export default class extends Controller {
    async render() {
        let data = {};

        console.log('product');

        // Product Info
        let product = await loader.storage('catalog/product-42');

        console.log(product);

        if (product.length && config.config_language in product.description) {
            data.product_id = product.product_id;

            // Images
            data.thumb = product.thumb;
            data.popup = product.popup;
            data.images = product.images;

            let description = product.description[config.config_language];

            //description.meta_title
            //description.meta_description
            //description.meta_keyword

            data.heading_title = description.name;
            data.description = description.description;
            data.tags = description.tag.split(',');

            // Product Codes
            data.model = product.model;
            data.product_codes = product.product_codes;

            // Manufacturer
            data.manufacturer_id = product.manufacturer_id;
            data.manufacturer = product.manufacturer;

            // Price
            data.price = product.price;
            data.special = product.special;
            data.tax = '';

            if (config.config_tax) data.tax = product.special ? product.special : product.price;

            // Stock
            data.quantity = product.quantity;
            data.minimum = product.minimum;

            let stock_status_id = 0;

            if (product.quantity <= 0) {
                stock_status_id = product.stock_status_id;

                data.stock = false;
            } else if (!config.config_stock_display) {
                stock_status_id = config.config_stock_status_id;

                data.stock = true;
            } else {
                stock_status_id = 0;

                data.stock = true;
            }

            data.stock_status = product.stock_status;

            // Reward Points
            data.points = product.points;
            data.reward = product.reward;

            // Statistics
            data.sales = product.sales;
            data.rating = product.rating;

            // Weight
            data.weight = product.weight;
            data.weight_class_id = product.weight_class_id;

            // Dimensions
            data.length = product.length;
            data.width = product.width;
            data.height = product.height;
            data.length_class_id = product.length_class_id;

            // Attributes
            data.attribute_groups = product.attribute_group;

            // Discounts
            data.discounts = product.discount;

            data.options = product.option;

            data.subscription_plans = product.subscription_plans;

            data.review_status = config.config_review_status;

            data.currency = currency;

            return loader.template('product/product', { ...data, ...language, ...config });
        }
    }

    onChange(e) {
        let subscription = this.querySelectorAll('.subscription');

        subscription.classList.add('d-none');

        $('#subscription-description-' + $(element).val()).classList.remove('d-none');
    }

    onSubmit(e) {
        e.preventDefault();

        loader.request({
            url: 'index.php?route=checkout/cart.add&language={{ language }}',
            type: 'post',
            data: new FormData(this.$form.getAttribute('action')),
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded',
            cache: false,
            processData: false,
            beforeSend: function() {
                this.$button_cart.state = 'loading';
            },
            complete: function() {
                this.$button_cart.state = 'reset';
            },
            success: function(json) {
                console.log(json);

                /*
                $('#form-product').find('.is-invalid').removeClass('is-invalid');
                $('#form-product').find('.invalid-feedback').removeClass('d-block');

                if (json['error'])
                    for (key in json['error']) {
                        $('#input-' + key.replaceAll('_', '-')).addClass('is-invalid').find('.form-control, .form-select, .form-check-input, .form-check-label').addClass('is-invalid');
                        $('#error-' + key.replaceAll('_', '-')).html(json['error'][key]).addClass('d-block');
                    }
                }

                if (json['success']) {
                    $('#alert').prepend('<div class="alert alert-success alert-dismissible"><i class="fa-solid fa-circle-check"></i> ' + json['success'] + ' <button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>');

                    $('#cart').load('index.php?route=common/cart.info&language={{ language }}');
                }
                */
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

/*
$(document).ready(function() {
    $('.magnific-popup').magnificPopup({
        type: 'image',
        delegate: 'a',
        gallery: {
            enabled: true
        }
    });
});
*/