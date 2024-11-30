/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/
import HhHeader from '@/components/header';
import "./product.css"
import HhSearch from '@/components/search';
import MhFooter from '@/components/footer';
import Slots from '@/components/slots';

const products = [
  {
    id: 1,
    name: 'Earthen Bottle',
    href: '#',
    price: '₹48',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-01.jpg',
    imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
  },
  {
    id: 2,
    name: 'Nomad Tumbler',
    href: '#',
    price: '₹35',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-02.jpg',
    imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
  },
  {
    id: 3,
    name: 'Focus Paper Refill',
    href: '#',
    price: '₹89',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-03.jpg',
    imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
  },
  {
    id: 4,
    name: 'Machined Mechanical Pencil',
    href: '#',
    price: '₹35',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-04.jpg',
    imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
  },
  {
    id: 5,
    name: 'Earthen Bottle',
    href: '#',
    price: '₹48',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-05.jpg',
    imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
  },
  {
    id: 6,
    name: 'Nomad Tumbler',
    href: '#',
    price: '₹35',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-06.jpg',
    imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
  },
  {
    id: 7,
    name: 'Focus Paper Refill',
    href: '#',
    price: '₹89',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-07.jpg',
    imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
  },
  {
    id: 8,
    name: 'Machined Mechanical Pencil',
    href: '#',
    price: '₹35',
    imageSrc:'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-08.jpg',
    imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
  }
]


export default function Products() {
  return (
    <>
      <HhHeader></HhHeader>
      <Slots></Slots>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6  lg:max-w-7xl lg:px-8">
          <div id='search-sec-id'>
            <HhSearch></HhSearch>
          </div>
          <h2 className="sr-only">Products</h2>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div key={product.id}>
                <a href={product.href} className="group">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                    <img
                      alt={product.imageAlt}
                      src={product.imageSrc}
                      className="h-full w-full object-cover object-center group-hover:opacity-75"
                    />
                  </div>
                  <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>

                </a>
                <div className='item-bottom-panel'>
                  <div className='left-panel'>
                    <div className="mt-1 text-lg font-medium text-gray-900">{product.price}</div>
                  </div>
                  <div className='right-panel'>
                    <form className="max-w-xs mx-auto">
                      <div className="relative flex items-center max-w-[8rem]">
                        <button type="button" id="decrement-button" data-input-counter-decrement="quantity-input" className="rounded-s-lg bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 p-3 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                          <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                          </svg>
                        </button>
                        <input type="text" id="quantity-input" data-input-counter aria-describedby="helper-text-explanation" className="bg-gray-50 border-x-0 border-gray-300 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0" required />
                        <button type="button" id="increment-button" data-input-counter-increment="quantity-input" className="rounded-e-lg bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 p-3 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                          <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                          </svg>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

            ))}
          </div>
        </div>
      </div>
      <MhFooter></MhFooter>
    </>
  )
}
