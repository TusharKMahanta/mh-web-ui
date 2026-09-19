"use server";

import StoreServer from "~/actions/store.server";

const catagories = [
  {
    name: 'Top in Town',
    description: 'Grocery and daily essentials',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-02-edition-01.jpg',
    imageAlt: 'Desk with leather desk pad, walnut desk organizer, wireless keyboard and mouse, and porcelain mug.',
    href: '/store/str_1',
  },
  {
    name: '1947 Mart',
    description: 'Grocery and daily essentials',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-02-edition-02.jpg',
    imageAlt: 'Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.',
    href: '/store/str_2',
  },
  {
    name: 'Dus Minute Mart',
    description: 'Grocery and daily essentials',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-02-edition-03.jpg',
    imageAlt: 'Collection of four insulated travel bottles on wooden shelf.',
    href: '/store/str_3',
  },
]
async function getCatagories() { 
    return catagories;
}
async function getStoresNearYou(lat: number, lng: number, radius: number) {
    return await StoreServer.getStoresNearYou({ lat, lng, radius });
  }
const HomeServer = {
    getCatagories,
    getStoresNearYou

}
export default HomeServer